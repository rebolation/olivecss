// ========================================
// 파일 감시 및 처리 클래스
// ========================================

import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs';
import { ColorUtility } from './cli-utils.js';

export class Watcher {
  constructor(watchDirs, outputDirs, baseDir, isJekyllMode = false) {
    this.watchDirs = watchDirs;
    this.outputDirs = outputDirs;
    this.baseDir = baseDir;
    this.isJekyllMode = isJekyllMode;
    this.oliveHTML = null;
    
    // Jekyll 모드일 때 실행할 콜백 함수
    this.jekyllBuildCompleteCallback = null;
    
    // 초기 로딩 상태 관리
    this.isInitialLoading = true;
    this.initialLoadingTimeout = null;
    this.initialLoadingDelay = 2000; // 2초 후 초기 로딩 완료로 간주
    
    // 색상 유틸리티 인스턴스 생성
    this.colorUtility = new ColorUtility();
    // ColorUtility 클래스의 메서드들을 위임받아 사용
    this.highlight = this.colorUtility.highlight.bind(this.colorUtility);
    this.highlightFile = this.colorUtility.highlightFile.bind(this.colorUtility);
    this.highlightSuccess = this.colorUtility.highlightSuccess.bind(this.colorUtility);
    this.highlightInfo = this.colorUtility.highlightInfo.bind(this.colorUtility);
    this.highlightError = this.colorUtility.highlightError.bind(this.colorUtility);       
  }

  // OliveHTML 설정
  setOliveHTML(oliveHTML) {
    this.oliveHTML = oliveHTML;
  }

  // Jekyll 빌드 완료 콜백 설정
  setJekyllBuildCompleteCallback(callback) {
    this.jekyllBuildCompleteCallback = callback;
  }

  // 파일 감시 시작
  startFileWatcher() {
    // 존재하는 디렉토리만 필터링
    const existingWatchDirs = this.watchDirs.filter(dir => {
      if (!fs.existsSync(dir)) {
        console.warn(`  🫒  WARNING: Watch directory does not exist: ${dir}`);
        return false;
      }
      return true;
    });

    if (existingWatchDirs.length === 0) {
      throw new Error('  🫒  ERROR: No valid watch directories found. Please create at least one default directory.');
    }

    // console.log(`  🫒  Watching directories: ${existingWatchDirs.join(', ')}`);

    const watcher = chokidar.watch(existingWatchDirs, {
      ignored: (path) => {
        return this.isJekyllMode ? 
          path.startsWith("node_modules") || path.startsWith(".jekyll-cache") || path.startsWith(".sass-cache") || path.startsWith("_site") || 
          path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.svg') || path.endsWith('.ico')               
          :
          path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.svg') || path.endsWith('.ico');
      },
      persistent: true,
      followSymlinks: false,
    });
    
    // 초기 로딩 완료 타이머 설정
    this.initialLoadingTimeout = setTimeout(() => {
      this.isInitialLoading = false;
      // console.log('  🫒  Initial file loading completed. Now watching for changes...');
    }, this.initialLoadingDelay);
    
    watcher.on("add", (filePath) => this.on_add(filePath));
    watcher.on("change", (filePath) => this.on_change(filePath));
    watcher.on("unlink", (filePath) => this.on_unlink(filePath, false));
    watcher.on("error", (error) => {
      console.error(`  🫒  ${this.highlightError("FILE WATCHING FAILED")} - ${error.message}`);
    });
  }

  // 파일 추가 처리 (초기 로딩 시)
  on_add(filePath) {
    try {
      // 파일이 속한 감시 폴더 찾기
      const watchDirIndex = this.findWatchDirIndex(filePath);
      if (watchDirIndex === -1) {
        console.error(`  🫒  ${this.highlightError("WATCH DIRECTORY DETECTION FAILED")} - Could not determine watch directory for file: ${filePath}`);
        return;
      }
      
      const watchDir = this.watchDirs[watchDirIndex];
      const outputDir = this.outputDirs[watchDirIndex];
      
      // watchDir을 outputDir로 교체하여 대상 경로 생성
      const destPath = filePath.replace(watchDir, outputDir);

      // 디렉토리 생성
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      // 파일 복사 및 변환
      fs.copyFileSync(filePath, destPath);
      this.writeFile(destPath, this.oliveConvert(filePath)); // olive-html convert
      
      // 초기 로딩 중이 아닐 때만 UPDATED 로그 출력
      if (!this.isInitialLoading) {
        const highlightedFileName = this.highlightFile(path.basename(destPath));
        console.log(`   🫒  UPDATED: ${highlightedFileName}`);
      }
      
      // Jekyll 모드일 때는 콜백을 통해 빌드 완료 대기 후 Livereload 트리거
      if (this.isJekyllMode && this.jekyllBuildCompleteCallback) {
        this.jekyllBuildCompleteCallback(filePath);
      } else {
        // 일반 모드일 때는 즉시 Livereload 트리거
        this.triggerLivereload();
      }
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("FILE ADDITION FAILED")} - ${error.message}`);
    }
  }

  // 파일 변경 처리 (실시간 감시)
  on_change(filePath) {
    try {
      // 파일이 속한 감시 폴더 찾기
      const watchDirIndex = this.findWatchDirIndex(filePath);
      if (watchDirIndex === -1) {
        console.error(`  🫒  ${this.highlightError("WATCH DIRECTORY DETECTION FAILED")} - Could not determine watch directory for file: ${filePath}`);
        return;
      }
      
      const watchDir = this.watchDirs[watchDirIndex];
      const outputDir = this.outputDirs[watchDirIndex];
      
      // watchDir을 outputDir로 교체하여 대상 경로 생성
      const destPath = filePath.replace(watchDir, outputDir);

      // 디렉토리 생성
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      // 파일 복사 및 변환
      fs.copyFileSync(filePath, destPath);
      this.writeFile(destPath, this.oliveConvert(filePath)); // olive-html convert
      
      // change 이벤트는 항상 UPDATED 로그 출력
      const highlightedFileName = this.highlightFile(path.basename(destPath));
      console.log(`  🫒  UPDATED: ${highlightedFileName}`);
      
      // Jekyll 모드일 때는 콜백을 통해 빌드 완료 대기 후 Livereload 트리거
      if (this.isJekyllMode && this.jekyllBuildCompleteCallback) {
        this.jekyllBuildCompleteCallback(filePath);
      } else {
        // 일반 모드일 때는 즉시 Livereload 트리거
        this.triggerLivereload();
      }
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("FILE CHANGE FAILED")} - ${error.message}`);
    }
  }

  // 파일 삭제 처리
  on_unlink(filePath, createDirIfNotExists = true) {
    try {
      // 파일이 속한 감시 폴더 찾기
      const watchDirIndex = this.findWatchDirIndex(filePath);
      if (watchDirIndex === -1) {
        console.error(`  🫒  ${this.highlightError("WATCH DIRECTORY DETECTION FAILED")} - Could not determine watch directory for file: ${filePath}`);
        return;
      }
      
      const watchDir = this.watchDirs[watchDirIndex];
      const outputDir = this.outputDirs[watchDirIndex];
      
      // watchDir을 outputDir로 교체하여 대상 경로 생성
      const destPath = filePath.replace(watchDir, outputDir);
      
      // 디렉토리 생성 플래그가 true일 때만 디렉토리 생성
      if (createDirIfNotExists) {
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
      }
      
      // 파일 삭제
      if (fs.existsSync(destPath)) {
        fs.unlinkSync(destPath);
      }
      console.log(`  🫒  DELETED: ${destPath}`);
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("FILE DELETION FAILED")} - ${error.message}`);
    }
  }

  // 파일이 속한 감시 폴더의 인덱스 찾기
  findWatchDirIndex(filePath) {
    try {
      // filePath가 어떤 감시 폴더 내부에 있는지 확인
      for (let i = 0; i < this.watchDirs.length; i++) {
        const watchDir = this.watchDirs[i];
        
        // filePath가 watchDir 내부에 있는지 확인
        try {
          const relativePath = path.relative(watchDir, filePath);
          // relativePath가 ..로 시작하지 않으면 해당 watchDir 내부에 있음
          if (relativePath && !relativePath.startsWith('..')) {
            return i;
          }
        } catch (error) {
          // path.relative에서 오류가 발생하면 다음 watchDir 확인
          continue;
        }
      }
      return -1;
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("DIRECTORY SEARCH FAILED")} - ${error.message}`);
      return -1;
    }
  }

  // ---------------------------------------------
  // 간소화된 파일 시스템 작업
  // ---------------------------------------------

  writeFile(filePath, content) {
    try {
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(filePath, content);
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("FILE WRITE FAILED")} for ${filePath}: ${error.message}`);
      throw error;
    }
  }

  readFile(filePath, encoding = 'utf8') {
    try {
      return fs.readFileSync(filePath, encoding);
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("FILE READ FAILED")} for ${filePath}: ${error.message}`);
      throw error;
    }
  }

  // ---------------------------------------------
  // 변환 함수
  // ---------------------------------------------

  oliveConvert(path) {
    try {    
      // .html 파일이 아니면 변환하지 않고 원본 반환
      if (typeof path !== "string" || !path.toLowerCase().endsWith('.html')) {
        return this.readFile(path, 'utf8');
      }
      return this.oliveHTML.convert(this.readFile(path, 'utf8'), path);
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("HTML CONVERSION FAILED")} for ${path}: ${error.message}`);
      // 원본 파일 내용을 반환하여 최소한의 기능 보장
      return this.readFile(path, 'utf8');
    }
  }

  // Livereload 트리거
  triggerLivereload() {
    try {
      if (global.broadcastReload) {
        global.broadcastReload();
      }
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("LIVERELOAD FAILED")} - ${error.message}`);
    }
  }

  // 정리 작업
  cleanup() {
    try {
      if (this.initialLoadingTimeout) {
        clearTimeout(this.initialLoadingTimeout);
        this.initialLoadingTimeout = null;
      }
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("WATCHER CLEANUP FAILED")} - ${error.message}`);
    }
  }
}
