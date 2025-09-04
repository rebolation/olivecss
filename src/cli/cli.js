#!/usr/bin/env node

// ========================================
// Olive CSS CLI tool (최적화된 보안 적용)
// ========================================

import { OliveHTML } from '../olive-html.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// 개선된 검증 시스템 import
import { ValidationFactory } from './cli-validators.js';

// 분리된 클래스들 import
import { ColorUtility } from './cli-utils.js';
import { Watcher } from './cli-watcher.js';
import { SecureStaticWebServer } from './cli-webserver.js';
import { SecureWebSocketServer } from './cli-websocketserver.js';

// ---------------------------------------------
// OliveCSS 클래스
// ---------------------------------------------

class OliveCSS {
  constructor() {
    this.port = 3000;
    this.baseDir = null;
    this.watchDirs = []; // 여러 폴더를 배열로 저장
    this.serveRoot = null; // 정적 파일 서빙 루트 디렉토리
    this.outputDirs = []; // 출력 디렉토리 배열
    this.server = null;
    this.prefix = ['olive_', '_']; // 앞에 붙거나
    this.suffix = ['_olive', '_']; // 뒤에 붙거나
    this.defaultDirectories = ['src'];
    this.defaultDirectoriesJekyll = ['_includes', '_layouts', '_sass', '_posts',];
    this.isJekyllMode = false; // Jekyll 모드 플래그
    
    // 개선된 검증 시스템 사용
    this.validators = ValidationFactory.createAllValidators();
    this.oliveHTML = null;
    
    // 색상 유틸리티 인스턴스 생성
    this.colorUtility = new ColorUtility();

    // ColorUtility 클래스의 메서드들을 위임받아 사용
    this.highlight = this.colorUtility.highlight.bind(this.colorUtility);
    this.highlightFile = this.colorUtility.highlightFile.bind(this.colorUtility);
    this.highlightSuccess = this.colorUtility.highlightSuccess.bind(this.colorUtility);
    this.highlightInfo = this.colorUtility.highlightInfo.bind(this.colorUtility);
    this.highlightError = this.colorUtility.highlightError.bind(this.colorUtility);
    this.highlightFade = this.colorUtility.highlightFade.bind(this.colorUtility);
    
    // WebServer와 WebSocketServer 인스턴스 생성 (개선된 검증기 사용)
    this.webServer = new SecureStaticWebServer(this.port, this.baseDir, this.validators.webserver);
    this.webSocketServer = new SecureWebSocketServer(this.port, this.validators.websocket);
    
    // Watcher 인스턴스 (나중에 초기화)
    this.watcher = null;
  }

  // ---------------------------------------------
  // 메인 실행 메서드
  // ---------------------------------------------
  
  async start() {
    try {
      await this.initialize();
      
      const watchDirs = this.parseArguments();
      
      this.configureDirectories(watchDirs);
      
      // Jekyll 모드인 경우 cli-jekyll.js 사용
      if (this.isJekyllMode) {
        // console.log('\n    🫒  Jekyll Mode detected, switching to Jekyll integration...');
        console.log(`\n  🫒  [ ${this.highlight("JEKYLL MODE")} ] - ${this.highlightFade("https://github.com/rebolation/olivecss")}`);
        await this.startJekyllMode();
        return;
      } else {
        console.log(`\n  🫒  [ ${this.highlight("BASIC MODE")} ] - ${this.highlightFade("https://github.com/rebolation/olivecss")}`);
        console.log(`  🫒  ${this.highlightFade("for JEKYLL MODE, use")} olive jekyll`);
      }
      
      await this.startServer();
      await this.startWebSocketServer();
      
      // Watcher 인스턴스 생성 및 시작
      this.watcher = new Watcher(this.watchDirs, this.outputDirs, this.baseDir, this.isJekyllMode);
      this.watcher.setOliveHTML(this.oliveHTML);
      this.watcher.startFileWatcher();
      
      this.logStatus();
      
      // 프로세스 종료 처리 설정
      this.setupProcessHandlers();
      
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("STARTUP FAILED")} - ${error.message}`);
      process.exit(1);
    }
  }

  // ---------------------------------------------
  // Jekyll 모드 시작
  // ---------------------------------------------
  
  async startJekyllMode() {
    try {
      // cli-jekyll.js 모듈 동적 import
      const { OliveCSSJekyll } = await import('./cli-jekyll.js');
      
      // Jekyll 모드에서는 _site를 서빙 루트로 설정
      this.serveRoot = '_site';
      
      // Watcher 인스턴스 생성
      const watcher = new Watcher(this.watchDirs, this.outputDirs, this.baseDir, true);
      watcher.setOliveHTML(this.oliveHTML);
      
      // Jekyll 통합 인스턴스 생성 시 Watcher 인스턴스 전달
      const jekyllIntegration = new OliveCSSJekyll(this.watchDirs, this.outputDirs, watcher);
      
      await jekyllIntegration.start();
      
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("JEKYLL MODE FAILED")} - ${error.message}`);
      process.exit(1);
    }
  }

  // ---------------------------------------------
  // 초기화 메서드 (간소화)
  // ---------------------------------------------
  
  async initialize() {
    this.baseDir = process.cwd();
    this.oliveHTML = await OliveHTML();
  }

  // ---------------------------------------------
  // 명령행 인수 파싱 및 유효성 검사
  // ---------------------------------------------
  
  parseArguments() {
    try {
              // 명령행 인수 파싱 및 유효성 검사
        let dirArgs = this.validators.argument.validateArguments(process.argv.slice(2).filter(arg => !arg.startsWith('-')));
      
      // Jekyll 모드 확인
      this.isJekyllMode = dirArgs.length > 0 && dirArgs[0] === 'jekyll';
      
      // 인자가 없거나 jekyll이면 자동으로 폴더 검색
      let directories;
      if (dirArgs.length == 0 || dirArgs[0] === 'jekyll') {
        directories = this.findDefaultDirectory(this.isJekyllMode);
      } else {
        directories = dirArgs;
      }
      
      // 모든 경로를 소문자화하고, 프로젝트 루트 기준 상대경로로 정규화
      directories = directories.map(dir => {
        dir = dir.toLowerCase();
        // 절대경로인 경우 프로젝트 루트 기준 상대경로로 변환
        if (path.isAbsolute(dir)) {
          return path.relative(this.baseDir, dir);
        }
        // 이미 상대경로인 경우 그대로 사용
        return dir;
      });
      
      return directories;
    } catch (error) {
      // validateArguments에서 발생한 예외 처리
      if (error.message.startsWith('FOLDER RULE VIOLATION')) {
        // 폴더명 규칙 위반
        console.error(`  🫒  ${this.highlightError("FOLDER RULE VIOLATION")} - Directory name must follow one of these patterns:`);
        console.error(`  🫒  ${this.highlightFile('- Start with "_" or "olive_" (e.g., _mysrc, olive_mysrc)')}`);
        console.error(`  🫒  ${this.highlightFile('- End with "_" or "_olive" (e.g., mysrc_, mysrc_olive)')}`);
        console.error(`\n  🫒  ${this.highlight("USAGE EXAMPLE")} - ${this.highlightInfo("olivecss _mysrc")} or ${this.highlightInfo("olivecss _mysrc _other olive_src")}`);
        process.exit(1);
      } else if (error.message.includes('Too many arguments')) {
        // 인자가 너무 많은 경우 (이제는 여러 폴더 허용)
        console.error(`  🫒  ${this.highlightError("ARGUMENT VALIDATION FAILED")} - Invalid arguments provided`);
        console.error(`\n  🫒  ${this.highlight("USAGE EXAMPLE")} - ${this.highlightInfo("olivecss _mysrc")} or ${this.highlightInfo("olivecss _mysrc _other olive_src")}`);
        process.exit(1);
      } else {
        // 기타 예외
        console.error(`  🫒  ${this.highlightError("VALIDATION FAILED")} - ${error.message}`);
        process.exit(1);
      }
    }
  }

  // ---------------------------------------------
  // 기본 감시 디렉토리 자동 검색 : 인자가 없을 때
  // ---------------------------------------------
   
  findDefaultDirectory(isJekyllMode = false) {
    try {
      // Jekyll 모드일 때는 defaultDirectoriesJekyll 사용
      const baseDirectories = isJekyllMode ? this.defaultDirectoriesJekyll : this.defaultDirectories;
      
      // prefix와 suffix를 사용하여 동적으로 기본 디렉토리 생성
      const dynamicDirectories = [];
      
      // baseDirectories의 각 디렉토리에 prefix와 suffix 조합 적용
      for (const baseDir of baseDirectories) {
        // prefix 패턴 (olive_, _)
        for (const prefix of this.prefix) {
          dynamicDirectories.push(`${prefix}${baseDir}`);
        }
        
        // suffix 패턴 (_olive, _)
        for (const suffix of this.suffix) {
          dynamicDirectories.push(`${baseDir}${suffix}`);
        }
      }
      
      // 중복 제거
      const uniqueDirectories = [...new Set(dynamicDirectories)];
      
      // console.log(`\n  🫒  Searching for default directories: ${this.highlightInfo(uniqueDirectories.join(', '))}`);
      
      // 존재하는 모든 디렉토리를 찾아서 배열로 반환
      const foundDirectories = [];
      for (const dir of uniqueDirectories) {
        const fullPath = path.join(this.baseDir, dir);
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
          // console.log(`  🫒  Auto-detected directory: ${this.highlightInfo(dir)}`);
          foundDirectories.push(dir);
        }
      }
      
      if (foundDirectories.length === 0) {
        if (isJekyllMode) {
          throw new Error(`No default directory found. \n\n  Run 'bundle info --path minima' to get the path. \n  Copy '_includes', '_layouts' \n  Rename '_includes_olive', '_layouts_olive'`);
        } else {
          throw new Error(`No default directory found. Please create one of the following: ${uniqueDirectories.join(', ')}`);
        }
      }
      
      return foundDirectories;
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("DIRECTORY SEARCH FAILED")} - ${error.message}`);
      process.exit(1);
    }
  }
    
  // ---------------------------------------------
  // 디렉토리 설정 : 감시 폴더, 변환 결과 폴더
  // ---------------------------------------------
  
  configureDirectories(watchDirs) {
    try {
      // 여러 디렉토리를 감시 폴더로 설정
      this.watchDirs = Array.isArray(watchDirs) ? watchDirs : [watchDirs];
      
      // 각 감시 폴더에 대한 출력 폴더 설정 (대소문자 무시)
      this.outputDirs = this.watchDirs.map(dir => {
        let outputDir = dir;
        
        if (outputDir.startsWith('olive_')) {
          outputDir = dir.substring(6);
        } else if (outputDir.endsWith('_olive')) {
          outputDir = dir.substring(0, dir.length - 6);
        } else if (outputDir.endsWith('_')) {
          outputDir = dir.substring(0, dir.length - 1);
        } else if (outputDir.startsWith('_')) {
          outputDir = dir.substring(1);
        }
        return outputDir;
      });
      
      // 감시 폴더와 출력 폴더가 같으면 안전하지 않음
      if (this.watchDirs.length !== this.outputDirs.length) {
        console.error(`  🫒  ${this.highlightError("DIRECTORY CONFIGURATION FAILED")} - Number of watch directories and output directories do not match`);
        process.exit(1);
      }
      for (let i = 0; i < this.watchDirs.length; i++) {
        if (this.watchDirs[i] === this.outputDirs[i]) {
          console.error(`  🫒  ${this.highlightError("SAFETY CHECK FAILED")} - Watch directory and output directory cannot be the same for directory: ${this.watchDirs[i]}`);
          process.exit(1);
        }
      }
      
      // 존재하지 않는 감시 디렉토리에 대한 경고
      const nonExistentWatchDirs = this.watchDirs.filter(dir => !fs.existsSync(dir));
      if (nonExistentWatchDirs.length > 0) {
        console.warn(`  🫒  WARNING: The following watch directories do not exist: ${this.highlightFile(nonExistentWatchDirs.join(', '))}`);
        // console.warn(`  🫒  These directories will be skipped during file watching.`);
      }
      
      // 유효한 감시 폴더가 있는지 확인
      const validWatchDirs = this.watchDirs.filter(dir => fs.existsSync(dir));
      if (validWatchDirs.length === 0) {
        throw new Error('No valid watch directories found. Please create at least one default directory.');
      }

      // 존재하지 않는 출력 폴더들을 자동으로 생성
      for (const outputDir of this.outputDirs) {
        if (!fs.existsSync(outputDir)) {
          try {
            fs.mkdirSync(outputDir, { recursive: true });
            // console.log(`  🫒  Created output directory: ${this.highlightInfo(outputDir)}`);
          } catch (error) {
            console.error(`  🫒  ${this.highlightError("OUTPUT DIRECTORY CREATION FAILED")} - Failed to create output directory ${outputDir}: ${error.message}`);
            process.exit(1);
          }
        }
      }
      
      // 첫 번째 출력 폴더를 메인 서빙 폴더로 설정
      this.serveRoot = this.outputDirs[0];      
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("DIRECTORY SETUP FAILED")} - ${error.message}`);
      process.exit(1);
    }
  }





  // ---------------------------------------------
  // 서버 관련 함수 (간소화)
  // ---------------------------------------------

  async startServer() {
    try {    
      // WebServer 클래스를 사용하여 정적 파일 서빙 서버 시작
      this.webServer.serveRoot = this.serveRoot;
      this.webServer.port = this.port;
      await this.webServer.start();
      
      // 서버 인스턴스 참조 설정
      this.server = this.webServer.server;
      this.port = this.webServer.port;
      
      // 포트가 변경되었는지 확인하고 로깅
      if (this.port !== this.webServer.port) {
        console.log(`  🫒  Server started on port ${this.port} (original port was busy)`);
      }

    } catch (error) {
      console.error(`  🫒  ${this.highlightError("WEB SERVER FAILED")} - ${error.message}`);
      process.exit(1);
    }
  }
  


  // ---------------------------------------------
  // 웹소켓 관련 함수 (livereload) - 최적화된 보안 적용
  // ---------------------------------------------

  async startWebSocketServer(port = null) {
    try {
      // SecureStaticWebSocketServer 클래스를 사용하여 WebSocket 서버 시작
      // console.log('  🫒  Starting WebSocket server...');
      // console.log('  🫒  Server instance:', this.server ? 'Available' : 'Not available');
      // console.log('  🫒  WebSocket server instance:', this.webSocketServer ? 'Available' : 'Not available');
      
      await this.webSocketServer.start(this.server);
      // console.log('  🫒  WebSocket server started successfully');
      
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("WEBSOCKET SERVER FAILED")} - ${error.message}`);
      process.exit(1);
    }
  }

  attachLivereloadScript(content, port = null) {
    try {
      // WebServer 클래스의 injectLivereloadScript 메서드 사용
      const targetPort = port || this.port;
      return this.webServer.injectLivereloadScript(content, targetPort);
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("LIVERELOAD SCRIPT")} FAILED - ${error.message}`);
      return content;
    }
  }

  // ---------------------------------------------
  // 정리 작업
  // ---------------------------------------------
  
  cleanup() {
    try {
      // WebServer와 WebSocketServer 클래스의 cleanup 메서드 호출
      this.webServer.cleanup();
      this.webSocketServer.cleanup();
      
      // Watcher의 cleanup 메서드 호출
      if (this.watcher) {
        this.watcher.cleanup();
      }
      
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("SHUTDOWN FAILED")} - ${error.message}`);
    }
  }

  // ---------------------------------------------
  // 상태 로깅
  // ---------------------------------------------
  
  logStatus() {
      
    console.log(`\n  ${this.highlightFade("------------------------------------------------------------")}`);
    console.log(`\n  🫒  ${this.highlightSuccess("Olive CSS")} is running at http://localhost:${this.highlightInfo(this.port)}\n`);

    for (let i = 0; i < this.watchDirs.length; i++) {
      console.log(`  🫒  ${this.highlightSuccess(this.watchDirs[i].padEnd(16))} → ${this.highlightFile(this.outputDirs[i])}${this.outputDirs[i] == this.serveRoot ? " (serving)" : ""}`);
    }
    
    console.log(`\n  ${this.highlightFade("------------------------------------------------------------")}`);
  }

  // ---------------------------------------------
  // 프로세스 종료 처리
  // ---------------------------------------------
  
  setupProcessHandlers() {
    process.on('SIGINT', () => {
      // console.log('\n  🫒  Shutting down...');
      this.cleanup();
      console.log('\n  🫒  Good bye!\n');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n  🫒  Shutting down...');
      this.cleanup();
      process.exit(0);
    });
  }
}

// ---------------------------------------------
// Export functions for testing and reuse
// ---------------------------------------------

export {
  ValidationFactory,
  OliveCSS
};

// 함수들을 export하여 다른 파일에서 사용할 수 있도록 함
export const startWebSocketServer = OliveCSS.prototype.startWebSocketServer;
export const attachLivereloadScript = OliveCSS.prototype.attachLivereloadScript;
export const logStatus = OliveCSS.prototype.logStatus;

// ---------------------------------------------
// CLI 진입점 : main() 함수 호출
// ---------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (path.resolve(__filename) === path.resolve(__dirname, 'cli.js')) {  
  const oliveCSS = new OliveCSS();
  oliveCSS.start();
}