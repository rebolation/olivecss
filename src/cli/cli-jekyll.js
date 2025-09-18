#!/usr/bin/env node

// ========================================
// Olive CSS Jekyll Integration CLI
// ========================================

import path from 'path';
import { fileURLToPath } from 'url';
import http from "http";
import fs from 'fs';
import { execSync, spawn } from 'child_process';

// cli.js에서 Livereload 관련 함수들과 ColorUtility 클래스, logStatus import
import { 
  attachLivereloadScript,
  logStatus
} from './cli.js';

// 보안 모듈 import
import { WebSocketSecurityValidator, ProxyServerSecurityValidator } from './cli-validators.js';

// 새로운 클래스들 import
import { SecureProxyWebServer } from './cli-webserver.js';
import { SecureWebSocketServer } from './cli-websocketserver.js';

import { ColorUtility } from './cli-utils.js';

// ---------------------------------------------
// OliveCSS Jekyll 통합 클래스
// ---------------------------------------------

class OliveCSSJekyll {
  constructor(watchDirs = null, outputDirs = null, watcher = null) {
    this.baseDir = null;
    this.jekyllPort = 6636;  // Jekyll 기본 포트
    this.olivePort = 5525;   // Olive CSS 프록시 서버 포트
    this.jekyllProcess = null;
    this.server = null;
    this.wsServer = null;
    
    // Olive CSS 관련 설정
    this.oliveHTML = null;
    
    // cli.js에서 전달받은 감시 폴더와 출력 폴더 사용
    this.watchDirs = watchDirs;
    this.outputDirs = outputDirs;
    
    // cli.js에서 전달받은 Watcher 인스턴스 사용
    this.watcher = watcher;
        
    // WebServer와 WebSocketServer 인스턴스 생성
    this.webServer = new SecureProxyWebServer(this.olivePort, this.baseDir, new ProxyServerSecurityValidator());
    this.webSocketServer = new SecureWebSocketServer(this.olivePort, new WebSocketSecurityValidator());
    
    // Jekyll 빌드 상태 추적
    this.lastJekyllBuilding = false;
    this.lastJekyllBuildTime = null;
     
    // 색상 유틸리티 인스턴스 생성
    this.colorUtility = new ColorUtility();

    // ColorUtility 클래스의 메서드들을 위임받아 사용
    this.highlight = this.colorUtility.highlight.bind(this.colorUtility);
    this.highlightFile = this.colorUtility.highlightFile.bind(this.colorUtility);
    this.highlightSuccess = this.colorUtility.highlightSuccess.bind(this.colorUtility);
    this.highlightInfo = this.colorUtility.highlightInfo.bind(this.colorUtility);
    this.highlightError = this.colorUtility.highlightError.bind(this.colorUtility);
    this.highlightFade = this.colorUtility.highlightFade.bind(this.colorUtility);
  }

  // ---------------------------------------------
  // 메인 실행 메서드
  // ---------------------------------------------
  
  async start() {
    try {
      await this.initialize();
      
      // console.log('  🫒  Starting Olive CSS Jekyll integration...');
      
      // 1. Jekyll 서버 시작
      await this.startJekyllServe();
      
      // 2. Jekyll 서버가 준비될 때까지 대기
      await this.waitForJekyllReady();
      
      // 3. Olive CSS 프록시 서버 시작 (최신 Jekyll 포트 사용)
      await this.startOliveCSSProxy();
      
      // 4. WebSocket 서버 포트를 Olive 포트와 동일하게 설정
      this.webSocketServer.port = this.olivePort;
      
      // 5. WebSocket 서버 시작 (Livereload) - SecureWebSocketServer 클래스 사용
      this.wsServer = await this.webSocketServer.start(this.server);
      
      // 4. 파일 감시 시작 - cli.js의 Watcher 인스턴스 직접 사용
      if (this.watcher) {
        // Watcher에 Jekyll 빌드 완료 콜백 설정
        this.watcher.setJekyllBuildCompleteCallback((filePath) => {
          // Jekyll 빌드 완료 대기 후 Livereload 트리거
          this.waitForJekyllBuildComplete(filePath);
        });
        
        this.watcher.startFileWatcher();
      } else {
        console.log('  🫒  Warning: No Watcher instance provided, using basic file watching');
      }
      
      // 5. 상태 표시 - cli.js의 logStatus 함수 직접 사용
      this.isJekyllMode = true;
      this.serveRoot = '_site'; // Jekyll의 기본 출력 디렉토리
      this.port = this.olivePort;
      logStatus.call(this);
      
      // 6. 프로세스 종료 처리
      this.setupProcessHandlers();
      
         } catch (error) {
       console.error(`  🫒  ${this.colorUtility.highlightError("STARTUP FAILED")} - ${error.message}`);
       this.cleanup();
       process.exit(1);
     }
  }

  // ---------------------------------------------
  // 초기화 메서드
  // ---------------------------------------------
  
  async initialize() {
    this.baseDir = process.cwd();
    
    // Jekyll 프로젝트 확인
    if (!this.isJekyllProject()) {
      throw new Error('This directory does not appear to be a Jekyll project. Please run this command from a Jekyll project directory.');
    }
  }

  // ---------------------------------------------
  // Jekyll 프로젝트 확인
  // ---------------------------------------------
  
  isJekyllProject() {
    const configFile = path.join(this.baseDir, '_config.yml');
    const gemfile = path.join(this.baseDir, 'Gemfile');
    
    return fs.existsSync(configFile) && fs.existsSync(gemfile);
  }

  // ---------------------------------------------
  // Bundle 명령어 경로 확인
  // ---------------------------------------------
  
  getBundleCommand() {
    // PATH에서 bundle 찾기 시도
    try {
      // const { execSync } = require('child_process');
      const result = execSync('where bundle', { encoding: 'utf8' });
      const lines = result.trim().split('\n');
      if (lines.length > 0) {
        const bundlePath = lines[0].trim();
        // console.log(`  🫒  Found bundle in PATH: ${bundlePath}`);
        return process.platform === 'win32' ? bundlePath + ".bat" : bundlePath;
      }
    } catch (error) {
      throw new Error('Make sure Ruby/Jekyll is installed');
    }
  }

  // ---------------------------------------------
  // Jekyll 서버 시작
  // ---------------------------------------------
  
  async startJekyllServe() {
    return new Promise((resolve, reject) => {
      // console.log('  🫒  Starting Jekyll server...');
      
      // bundle exec jekyll serve 실행 (Windows 환경 고려)
      const bundleCommand = this.getBundleCommand();
      
      const args = ['exec', 'jekyll', 'serve', '--port', this.jekyllPort];
      
      // Windows에서 .bat 파일 실행 시 cmd를 통해 실행
      let finalCommand = bundleCommand;
      let finalArgs = args;
      
      if (process.platform === 'win32' && bundleCommand.endsWith('.bat')) {
        finalCommand = 'cmd';
        finalArgs = ['/c', bundleCommand, ...args];
      }
      
      this.jekyllProcess = spawn(finalCommand, finalArgs, {
        cwd: this.baseDir,
        stdio: 'pipe',
        detached: false
      });

      // Jekyll 출력 처리
      this.jekyllProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Server running')) {
          // Jekyll 서버가 실제로 실행된 포트를 감지
          const portMatch = output.match(/http:\/\/localhost:(\d+)/);
          if (portMatch) {
            const actualPort = parseInt(portMatch[1], 10);
            if (actualPort !== this.jekyllPort) {
              console.log(`  🫒  Jekyll server started on port ${actualPort} (original port ${this.jekyllPort} was busy)`);
              this.jekyllPort = actualPort;
              // 프록시 서버의 타겟 포트도 업데이트
              if (this.webServer) {
                this.webServer.targetPort = this.jekyllPort;
              }
            }
          }
          // console.log(`  🫒  Jekyll server is running at http://localhost:${this.jekyllPort}`);
          resolve();
        }
        
        // Jekyll 빌드 상태 감지
        if (output.includes('Generating')) {
          this.isJekyllBuilding = true;
        }
        
        if (output.includes('done in')) {
          this.isJekyllBuilding = false;
          this.lastJekyllBuildTime = Date.now();
        }
      });

      this.jekyllProcess.stderr.on('data', (data) => {
        const error = data.toString();
        if (error.includes('ERROR') || error.includes('Error')) {
          console.error(`  🫒  ${this.colorUtility.highlightError("JEKYLL SERVER FAILED")} - ${error}`);
        }
      });

      this.jekyllProcess.on('error', (error) => {
        reject(new Error(`Failed to start Jekyll: ${error.message}`));
      });

      this.jekyllProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`  🫒  ${this.colorUtility.highlightError("JEKYLL PROCESS FAILED")} - Process exited with code ${code}`);
        }
      });

      // Jekyll 서버 준비 대기 (타임아웃 설정)
      setTimeout(() => {
        // console.log('  🫒  Jekyll server startup timeout, proceeding...');
        resolve();
      }, 10000); // 5초 후 진행
    });
  }

  // ---------------------------------------------
  // Jekyll 서버 준비 대기
  // ---------------------------------------------
  
  async waitForJekyllReady() {
    return new Promise((resolve) => {
      const maxAttempts = 30; // 최대 30초 대기
      let attempts = 0;
      
      const checkInterval = setInterval(async () => {
        attempts++;
        
        try {
          const response = await this.checkJekyllServer();
          if (response) {
            clearInterval(checkInterval);
            resolve();
          }
        } catch (error) {
          // 아직 서버가 준비되지 않음
        }
        
        if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          resolve(); // 타임아웃이어도 계속 진행
        }
      }, 1000);
    });
  }

  // ---------------------------------------------
  // Jekyll 서버 상태 확인
  // ---------------------------------------------
  
  async checkJekyllServer() {
    return new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: this.jekyllPort,
        path: '/',
        method: 'GET',
        timeout: 2000
      }, (res) => {
        resolve(res.statusCode === 200);
      });

      req.on('error', () => resolve(false));
      req.on('timeout', () => resolve(false));
      req.end();
    });
  }

  // ---------------------------------------------
  // Olive CSS 프록시 서버 시작
  // ---------------------------------------------
  
  async startOliveCSSProxy() {
    try {
      // Jekyll 서버가 실제로 실행 중인지 확인
      const isJekyllReady = await this.checkJekyllServer();
      if (!isJekyllReady) {
        throw new Error(`Jekyll server is not ready at port ${this.jekyllPort}. Please check if Jekyll is running properly.`);
      }
      
      // 프록시 서버의 타겟 포트를 Jekyll 포트로 설정
      this.webServer.targetPort = this.jekyllPort;
      
      // WebServer 클래스를 사용하여 프록시 서버 시작
      await this.webServer.start();
      
      // 서버 인스턴스 참조 설정
      this.server = this.webServer.server;
      this.olivePort = this.webServer.port;
      
      // 포트가 변경되었는지 확인하고 로깅
      if (this.olivePort !== 5525) {
        console.log(`  🫒  Olive CSS proxy server started on port ${this.olivePort} (original port was busy)`);
      }
      console.log(`  🫒  Proxying to Jekyll server at http://localhost:${this.jekyllPort}`);
      
    } catch (error) {
      throw error;
    }
  }

  // ---------------------------------------------
  // Jekyll 빌드 완료 대기 후 Livereload 트리거
  // ---------------------------------------------
  
  async waitForJekyllBuildComplete(filePath) {
    try {
      // Jekyll 빌드 완료를 감지
      let attempts = 0;
      const maxAttempts = 30; // 최대 30초 대기
      const startTime = Date.now();
      
      const checkInterval = setInterval(async () => {
        attempts++;
        
        try {
          // Jekyll 빌드 상태 확인
          if (!this.isJekyllBuilding && this.lastJekyllBuildTime && this.lastJekyllBuildTime > startTime) {
            clearInterval(checkInterval);
            
            // 즉시 Livereload 트리거 (Watcher 인스턴스의 메소드 사용)
            if (this.watcher) {
              this.watcher.triggerLivereload();
            }
            return;
          }
          
        } catch (error) {
          // 오류 무시
        }
        
        // 타임아웃 체크
        if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          if (this.watcher) {
            this.watcher.triggerLivereload();
          }
        }
      }, 100); // 더 빠른 체크 (200ms)
      
    } catch (error) {
      // 오류 발생 시 즉시 Livereload 트리거 (Watcher 인스턴스의 메소드 사용)
      if (this.watcher) {
        this.watcher.triggerLivereload();
      }
    }
  }

  // ---------------------------------------------
  // 프로세스 종료 처리
  // ---------------------------------------------
  
  setupProcessHandlers() {
    process.on('SIGINT', () => {
      // console.log('\n  🫒  Shutting down servers...');
      this.cleanup();
      console.log('\n  🫒  Good bye!\n');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n  🫒  Shutting down servers...');
      this.cleanup();
      process.exit(0);
    });
  }

  // ---------------------------------------------
  // 정리 작업
  // ---------------------------------------------
  
  cleanup() {
    try {
      if (this.jekyllProcess) {
        this.jekyllProcess.kill('SIGTERM');
        console.log('  🫒  Jekyll server stopped');
      }
      
      // WebServer와 WebSocketServer 클래스의 cleanup 메서드 호출
      this.webServer.cleanup();
      this.webSocketServer.cleanup();
      
    } catch (error) {
      console.error(`  🫒  ${this.colorUtility.highlightError("SHUTDOWN FAILED")} - ${error.message}`);
    }
  }
}

// ---------------------------------------------
// Export functions for testing
// ---------------------------------------------

export { OliveCSSJekyll };