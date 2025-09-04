import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';
import http from 'http';
import path from 'path';
import fs from 'fs';

// 🫒 OliveCSS Web Security Tests
// CLI 서버의 웹 보안 취약점을 테스트하는 통합 테스트

describe('OliveCSS Web Security Tests', () => {
  let cliProcess = null;
  let projectRoot = null;
  let serverPort = null;
  let serverUrl = null;

  beforeAll(async () => {
    // 프로젝트 루트 경로 계산
    projectRoot = path.resolve(__dirname, '../../');
    console.log("Project Root:", projectRoot);

    // 테스트용 정적 파일들 생성
    await createTestFiles();

    // CLI 서버 시작
    await startCLIServer();
  });

  afterAll(async () => {
    // CLI 서버 종료
    if (cliProcess) {
      cliProcess.kill('SIGTERM');
      await new Promise(resolve => setTimeout(resolve, 1000));
      cliProcess.kill('SIGKILL');
    }

    // 테스트용 파일들 정리
    await cleanupTestFiles();
  });

  // CLI 서버 시작
  async function startCLIServer() {
    return new Promise((resolve, reject) => {
      const cliPath = path.join(projectRoot, 'src', 'cli', 'cli.js');
      const workingDir = path.join(projectRoot, 'tests', 'cli');

      console.log("Starting CLI server...");
      console.log("CLI Path:", cliPath);
      console.log("Working Directory:", workingDir);

      cliProcess = spawn('node', [cliPath, '_src'], {
        cwd: workingDir,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      cliProcess.setMaxListeners(20);

      let isResolved = false;
      const timeout = setTimeout(() => {
        if (!isResolved) {
          reject(new Error('CLI server startup timeout'));
        }
      }, 10000);

      cliProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log('CLI stdout:', output);

        // 서버 시작 메시지 감지
        const cleanOutput = output.replace(/\u001b\[[0-9;]*m/g, '');
        const portMatch = cleanOutput.match(/http:\/\/localhost:(\d+)/);

        if (portMatch && !isResolved) {
          serverPort = parseInt(portMatch[1]);
          serverUrl = `http://localhost:${serverPort}`;
          console.log(`CLI server started on port ${serverPort}`);

          isResolved = true;
          clearTimeout(timeout);
          resolve();
        }
      });

      cliProcess.stderr.on('data', (data) => {
        console.log('CLI stderr:', data.toString());
      });

      cliProcess.on('error', (error) => {
        if (!isResolved) {
          clearTimeout(timeout);
          reject(error);
        }
      });

      cliProcess.on('exit', (code) => {
        if (!isResolved) {
          clearTimeout(timeout);
          reject(new Error(`CLI process exited with code ${code}`));
        }
      });
    });
  }

  // HTTP 요청 헬퍼 함수
  function makeRequest(path, options = {}) {
    return new Promise((resolve, reject) => {
      if (!serverUrl) {
        reject(new Error('Server not started'));
        return;
      }

      const url = new URL(path, serverUrl);

      const req = http.request(url, {
        method: options.method || 'GET',
        headers: options.headers || {},
        timeout: 5000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            url: path
          });
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (options.body) {
        req.write(options.body);
      }
      req.end();
    });
  }

  // 실제 존재하는 파일들 찾기
  function findExistingFiles() {
    const files = [];

    try {
      const items = fs.readdirSync('.');
      for (const item of items) {
        if (item.startsWith('.') && item !== '.git') {
          files.push(item);
        }
      }
    } catch (error) {
      console.log('Directory read error:', error.message);
    }

    return files;
  }

  // 테스트용 정적 파일들 생성
  async function createTestFiles() {
    const testDir = path.join(projectRoot, 'tests', 'cli', '_src');
    const outputDir = path.join(projectRoot, 'tests', 'cli', 'src');

    try {
      // _src 디렉토리 생성
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }

      // src 디렉토리 생성
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // 테스트용 HTML 파일 생성
      const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>테스트 페이지</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>🫒 OliveCSS 테스트 페이지</h1>
    <p>이 페이지는 보안 테스트를 위한 정상적인 HTML 파일입니다.</p>
    <script src="script.js"></script>
</body>
</html>`;

      fs.writeFileSync(path.join(testDir, 'index.html'), htmlContent);
      fs.writeFileSync(path.join(outputDir, 'index.html'), htmlContent);

      // 테스트용 CSS 파일 생성
      const cssContent = `/* 테스트용 CSS 파일 */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
}

h1 {
    color: #333;
    text-align: center;
}

p {
    color: #666;
    line-height: 1.6;
}`;

      fs.writeFileSync(path.join(testDir, 'style.css'), cssContent);
      fs.writeFileSync(path.join(outputDir, 'style.css'), cssContent);

      // 테스트용 JavaScript 파일 생성
      const jsContent = `// 테스트용 JavaScript 파일
console.log('🫒 OliveCSS 테스트 스크립트 로드됨');

document.addEventListener('DOMContentLoaded', function() {
    console.log('페이지 로드 완료');

    // 간단한 기능 테스트
    const h1 = document.querySelector('h1');
    if (h1) {
        h1.style.color = '#0066cc';
    }
});`;

      fs.writeFileSync(path.join(testDir, 'script.js'), jsContent);
      fs.writeFileSync(path.join(outputDir, 'script.js'), jsContent);

      // 테스트용 이미지 파일 (텍스트로 대체)
      const imageContent = `# 테스트용 이미지 파일 (텍스트 형식)
# 이 파일은 이미지 파일을 시뮬레이션합니다.
# 실제 프로덕션에서는 실제 이미지 파일이 사용됩니다.`;

      fs.writeFileSync(path.join(testDir, 'test-image.txt'), imageContent);
      fs.writeFileSync(path.join(outputDir, 'test-image.txt'), imageContent);

      // 테스트용 JSON 파일
      const jsonContent = JSON.stringify({
        name: "OliveCSS Test",
        version: "1.0.0",
        description: "테스트용 JSON 파일",
        features: ["HTML", "CSS", "JavaScript"],
        timestamp: new Date().toISOString()
      }, null, 2);

      fs.writeFileSync(path.join(testDir, 'data.json'), jsonContent);
      fs.writeFileSync(path.join(outputDir, 'data.json'), jsonContent);

      console.log("✅ 테스트용 정적 파일들 생성 완료");
      console.log("📁 테스트 디렉토리:", testDir);
      console.log("📁 출력 디렉토리:", outputDir);

    } catch (error) {
      console.log("❌ 테스트 파일 생성 중 오류:", error.message);
    }
  }

  // 테스트용 파일들 정리
  async function cleanupTestFiles() {
    try {
      const testDir = path.join(projectRoot, 'tests', 'cli', '_src');
      const outputDir = path.join(projectRoot, 'tests', 'cli', 'src');

      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }

      if (fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, { recursive: true, force: true });
      }

      console.log("🧹 테스트용 파일들 정리 완료");
    } catch (error) {
      console.log("❌ 테스트 파일 정리 중 오류:", error.message);
    }
  }


  // 정상적인 파일 접근 테스트
  describe('Legitimate File Access', () => {
    it('should serve static files correctly', async () => {
      // 정상적인 정적 파일들에 대한 접근 테스트
      const staticFiles = [
        '/index.html',      // HTML 파일
        '/style.css',       // CSS 파일
        '/script.js',       // JavaScript 파일
        '/data.json',       // JSON 파일
        '/test-image.txt'   // 텍스트 파일
      ];

      for (const file of staticFiles) {
        const result = await makeRequest(file);

        // 정상적인 파일은 200 상태 코드로 응답해야 함
        expect(result.statusCode).toBe(200);

        // 파일 내용이 비어있지 않아야 함
        expect(result.body.length).toBeGreaterThan(0);

        // Content-Type 헤더가 적절하게 설정되어야 함
        if (file.endsWith('.html')) {
          expect(result.headers['content-type']).toMatch(/text\/html/);
        } else if (file.endsWith('.css')) {
          expect(result.headers['content-type']).toMatch(/text\/css/);
        } else if (file.endsWith('.js')) {
          // text/javascript 또는 application/javascript 모두 허용
          expect(result.headers['content-type']).toMatch(/(text|application)\/javascript/);
        } else if (file.endsWith('.json')) {
          expect(result.headers['content-type']).toMatch(/application\/json/);
        } else if (file.endsWith('.txt')) {
          expect(result.headers['content-type']).toMatch(/text\/plain/);
        }
      }
    });

    it('should serve root path correctly', async () => {
      // 루트 경로 (/) 접근 테스트
      const result = await makeRequest('/');

      // 루트 경로는 200 상태 코드로 응답해야 함
      expect(result.statusCode).toBe(200);

      // HTML 내용이 포함되어야 함
      expect(result.body).toContain('<!DOCTYPE html>');
      expect(result.body).toContain('🫒 OliveCSS 테스트 페이지');

      // Content-Type이 text/html이어야 함
      expect(result.headers['content-type']).toMatch(/text\/html/);
    });

    it('should handle file content correctly', async () => {
      // HTML 파일 내용 검증
      const htmlResult = await makeRequest('/index.html');
      expect(htmlResult.statusCode).toBe(200);
      expect(htmlResult.body).toContain('<title>테스트 페이지</title>');
      expect(htmlResult.body).toContain('<link rel="stylesheet" href="style.css">');
      expect(htmlResult.body).toContain('<script src="script.js"></script>');

      // CSS 파일 내용 검증
      const cssResult = await makeRequest('/style.css');
      expect(cssResult.statusCode).toBe(200);
      expect(cssResult.body).toContain('body {');
      expect(cssResult.body).toContain('font-family: Arial, sans-serif;');
      expect(cssResult.body).toContain('background-color: #f0f0f0;');

      // JavaScript 파일 내용 검증
      const jsResult = await makeRequest('/script.js');
      expect(jsResult.statusCode).toBe(200);
      expect(jsResult.body).toContain('console.log');
      expect(jsResult.body).toContain('🫒 OliveCSS 테스트 스크립트');
      expect(jsResult.body).toContain('DOMContentLoaded');

      // JSON 파일 내용 검증
      const jsonResult = await makeRequest('/data.json');
      expect(jsonResult.statusCode).toBe(200);
      const jsonData = JSON.parse(jsonResult.body);
      expect(jsonData.name).toBe('OliveCSS Test');
      expect(jsonData.version).toBe('1.0.0');
      expect(jsonData.features).toContain('HTML');
      expect(jsonData.features).toContain('CSS');
      expect(jsonData.features).toContain('JavaScript');
    });

    it('should handle non-existent files correctly', async () => {
      // 존재하지 않는 파일들에 대한 접근 테스트
      const nonExistentFiles = [
        '/nonexistent.html',
        '/missing.css',
        '/not-found.js',
        '/invalid.json'
      ];

      for (const file of nonExistentFiles) {
        const result = await makeRequest(file);

        // 존재하지 않는 파일은 404 상태 코드로 응답해야 함
        expect(result.statusCode).toBe(404);

        // 에러 응답이 너무 상세하지 않아야 함 (보안상)
        if (result.body.length > 0) {
          expect(result.body.length).toBeLessThan(200);
        }
      }
    });

    it('should serve files with correct headers', async () => {
      // 파일 헤더 검증
      const result = await makeRequest('/index.html');

      expect(result.statusCode).toBe(200);

      // 기본적인 HTTP 헤더들이 설정되어야 함
      expect(result.headers).toBeDefined();
      expect(result.headers['content-type']).toBeDefined();

      // Content-Type이 올바르게 설정되어야 함
      expect(result.headers['content-type']).toMatch(/text\/html/);

      // Content-Length가 설정되어야 함 (선택사항)
      if (result.headers['content-length']) {
        expect(parseInt(result.headers['content-length'])).toBeGreaterThan(0);
      }
    });
  });

  describe('Basic Path Traversal Attacks', () => {
    it('should block basic path traversal attempts', async () => {
      const attacks = [
        '/../../../etc/passwd',
        '/..\\..\\..\\windows\\system32\\drivers\\etc\\hosts',
        '/etc/passwd',
        '/C:\\windows\\system32\\drivers\\etc\\hosts',
        '/var/log/auth.log',
        '/proc/version'
      ];

      for (const attackPath of attacks) {
        const result = await makeRequest(attackPath);

        // 보안상 차단되어야 함 (403, 404, 또는 500)
        expect([403, 404, 500]).toContain(result.statusCode);

        // 민감한 정보가 노출되지 않아야 함
        if (result.statusCode === 500) {
          expect(result.body).not.toContain('process.cwd');
          expect(result.body).not.toContain('__dirname');
          expect(result.body).not.toContain('__filename');
        }
      }
    });

    it('should block invalid directory sequences', async () => {
      const sequences = [
        '/...',                    // 잘못된 상위 디렉토리
        '/....'                    // 잘못된 상위 디렉토리
      ];

      for (const sequence of sequences) {
        const result = await makeRequest(sequence);
        console.log(`🔍 Testing ${sequence}: ${result.statusCode} (${result.body.length} bytes)`);

        // 잘못된 디렉토리 시퀀스는 차단되어야 함
        expect([403, 404, 500]).toContain(result.statusCode);
      }
    });

    it('should handle multi-level directory references appropriately', async () => {
      // 다단계 디렉토리 참조는 서버 설정에 따라 다르게 처리될 수 있음
      const multiLevelPaths = [
        '/../..',                  // 이중 상위 디렉토리 (Unix)
        '/../../..'                // 삼중 상위 디렉토리 (Unix)
      ];

      for (const path of multiLevelPaths) {
        const result = await makeRequest(path);
        console.log(`🔍 Testing multi-level path ${path}: ${result.statusCode} (${result.body.length} bytes)`);

        // 다단계 경로는 서버 설정에 따라 다르게 처리될 수 있음
        // 200 (정상 응답), 404 (파일 없음), 또는 500 (서버 오류) 모두 허용
        expect([200, 404, 500]).toContain(result.statusCode);

        if (result.statusCode === 200) {
          console.log(`ℹ️  Info: ${path} returned 200 status code (may be treated as valid path)`);
        }
      }
    });

    it('should handle Windows path separators appropriately', async () => {
      // Windows 경로 구분자는 URL에서 다르게 처리될 수 있음
      const windowsPaths = [
        '/..\\..',                 // 이중 상위 디렉토리 (Windows)
        '/..\\..\\..'              // 삼중 상위 디렉토리 (Windows)
      ];

      for (const path of windowsPaths) {
        const result = await makeRequest(path);
        console.log(`🔍 Testing Windows path ${path}: ${result.statusCode} (${result.body.length} bytes)`);

        // Windows 경로는 서버 설정에 따라 다르게 처리될 수 있음
        // 200 (정상 응답), 404 (파일 없음), 또는 500 (서버 오류) 모두 허용
        expect([200, 404, 500]).toContain(result.statusCode);

        if (result.statusCode === 200) {
          console.log(`ℹ️  Info: ${path} returned 200 status code (may be treated as valid path)`);
        }
      }
    });

    it('should handle single directory references appropriately', async () => {
      // 단일 디렉토리 참조는 서버 설정에 따라 다르게 처리될 수 있음
      const singleRefs = [
        '/..',                     // 단순 상위 디렉토리
        '/.',                      // 현재 디렉토리
        '/..\\',                   // Windows 경로 구분자
        '/../'                     // Unix 경로 구분자
      ];

      for (const ref of singleRefs) {
        const result = await makeRequest(ref);
        // 200 (정상 응답), 404 (파일 없음), 또는 500 (서버 오류) 모두 허용
        expect([200, 404, 500]).toContain(result.statusCode);
      }
    });
  });

  describe('Advanced Encoding Attacks', () => {
    it('should block URL encoded path traversal', async () => {
      const encodedAttacks = [
        '/%2e%2e%2f%2e%2e%2fetc%2fpasswd',
        '/%2e%2e%5c%2e%2e%5cwindows%5csystem32',
        '/%252e%252e%252fpackage.json',
        '/%252e%252e%252f%252e%252e%252f.env'
      ];

      for (const attack of encodedAttacks) {
        const result = await makeRequest(attack);
        expect([403, 404, 500]).toContain(result.statusCode);
      }
    });

    it('should block mixed encoding attacks', async () => {
      const mixedAttacks = [
        '/test%2f..%2fpackage.json',
        '/src%2f..%2f.env',
        '/web%5c..%5c.gitignore',
        '/assets%2f..%2f%2e%2e%2fconfig'
      ];

      for (const attack of mixedAttacks) {
        const result = await makeRequest(attack);
        expect([403, 404, 500]).toContain(result.statusCode);
      }
    });

    it('should block double encoding attacks', async () => {
      const doubleEncodedAttacks = [
        '/%252e%252e%252fpackage.json',
        '/%252e%252e%252f%252e%252e%252f.env',
        '/%252e%252e%255c%252e%252e%255cwindows'
      ];

      for (const attack of doubleEncodedAttacks) {
        const result = await makeRequest(attack);
        expect([403, 404, 500]).toContain(result.statusCode);
      }
    });
  });

  describe('File Access Control', () => {
    it('should block access to hidden files', async () => {
      const hiddenFiles = [
        '/.env',
        '/.gitignore',
        '/.git/config',
        '/.npmrc',
        '/.yarnrc',
        '/.babelrc'
      ];

      for (const file of hiddenFiles) {
        const result = await makeRequest(file);
        expect([403, 404, 500]).toContain(result.statusCode);
      }
    });

    it('should block access to system files', async () => {
      const systemFiles = [
        '/etc/passwd',
        '/etc/shadow',
        '/windows/system32/drivers/etc/hosts',
        '/proc/version',
        '/sys/class/net'
      ];

      for (const file of systemFiles) {
        const result = await makeRequest(file);
        expect([403, 404, 500]).toContain(result.statusCode);
      }
    });

    it('should block access to source code files', async () => {
      const sourceFiles = [
        '/src/cli/cli.js',
        '/src/olivecss.js',
        '/package.json',
        '/package-lock.json',
        '/README.md'
      ];

      for (const file of sourceFiles) {
        const result = await makeRequest(file);
        expect([403, 404, 500]).toContain(result.statusCode);
      }
    });
  });

  describe('Source Map Exposure', () => {
    it('should block access to source map files', async () => {
      const sourceMapFiles = [
        '/main.js.map',
        '/bundle.js.map',
        '/app.js.map',
        '/index.js.map'
      ];

      for (const file of sourceMapFiles) {
        const result = await makeRequest(file);
        expect([403, 404, 500]).toContain(result.statusCode);
      }
    });
  });

  describe('Special Character Attacks', () => {
    it('should block null byte attacks', async () => {
      const nullByteAttacks = [
        '/.env%00',
        '/src%00',
        '/web%00',
        '/config%00.txt'
      ];

      for (const attack of nullByteAttacks) {
        const result = await makeRequest(attack);
        expect([403, 404, 500]).toContain(result.statusCode);
      }
    });

    it('should block unicode normalization attacks', async () => {
      const unicodeAttacks = [
        '/.ｅｎｖ',        // 전각 문자
        '/ｓｒｃ',         // 전각 문자
        '/ｗｅｂ',         // 전각 문자
        '/ｃｏｎｆｉｇ'    // 전각 문자
      ];

      for (const attack of unicodeAttacks) {
        const result = await makeRequest(attack);
        expect([403, 404, 500]).toContain(result.statusCode);
      }
    });

    it('should block special character attacks', async () => {
      const specialCharAttacks = [
        '/ .env',          // 앞에 공백
        '/.env ',          // 뒤에 공백
        '/.env%20',        // URL 인코딩 공백
        '/%20.env',        // URL 인코딩 공백
        '/.env\t',         // 탭 문자
        '/.env\n',         // 개행 문자
        '/.env\r'          // 캐리지 리턴
      ];

      for (const attack of specialCharAttacks) {
        const result = await makeRequest(attack);
        expect([403, 404, 500]).toContain(result.statusCode);
      }
    });
  });

  describe('Case Manipulation Attacks', () => {
    it('should block case variation attacks', async () => {
      const caseVariationAttacks = [
        '/.ENV',
        '/.Env',
        '/.env.bak',
        '/.env.backup',
        '/.env.old',
        '/.env.tmp'
      ];

      for (const attack of caseVariationAttacks) {
        const result = await makeRequest(attack);
        expect([403, 404, 500]).toContain(result.statusCode);
      }
    });
  });

  describe('Real File Based Attacks', () => {
    it('should block path traversal through real files', async () => {
      const realFileAttacks = [
        '/page/../package.json',
        '/page/../../package.json',
        '/page/../../../package.json',
        '/src/../package.json',
        '/src/../../package.json'
      ];

      for (const attack of realFileAttacks) {
        const result = await makeRequest(attack);
        expect([403, 404, 500]).toContain(result.statusCode);
      }
    });

    it('should block extension bypass attempts', async () => {
      const extensionBypassAttacks = [
        '/page/about.html/../package.json',
        '/page/about.html/../../package.json',
        '/src/index.js/../package.json'
      ];

      for (const attack of extensionBypassAttacks) {
        const result = await makeRequest(attack);
        expect([403, 404, 500]).toContain(result.statusCode);
      }
    });

    it('should block access to project root files from src directory', async () => {
      // tests/cli/src에서 상위 폴더의 프로젝트 루트 파일들에 접근 시도
      const projectRootFileAttacks = [
        '/../README.md',                    // tests/cli/README.md
        '/../../README.md',                 // tests/README.md
        '/../../../README.md',              // 프로젝트 루트 README.md
        '/../package.json',                 // tests/cli/package.json
        '/../../package.json',              // tests/package.json
        '/../../../package.json',           // 프로젝트 루트 package.json
        '/../src/cli/cli.js',                   // tests/cli/src/cli.js
        '/../../src/cli/cli.js',                // tests/src/cli.js
        '/../../../src/cli/cli.js',             // 프로젝트 루트 src/cli.js
        '/../.gitignore',                   // tests/cli/.gitignore
        '/../../.gitignore',                // tests/.gitignore
        '/../../../.gitignore'              // 프로젝트 루트 .gitignore
      ];

      for (const attack of projectRootFileAttacks) {
        const result = await makeRequest(attack);
        console.log(`🔍 Testing project root access ${attack}: ${result.statusCode} (${result.body.length} bytes)`);

        // 프로젝트 루트 파일들은 보안상 차단되어야 함
        expect([403, 404, 500]).toContain(result.statusCode);

        // 만약 200 응답이 나온다면 보안 경고
        if (result.statusCode === 200) {
          console.log(`⚠️  SECURITY WARNING: ${attack} returned 200 - possible path traversal vulnerability!`);
          console.log(`   Response preview: ${result.body.substring(0, 100)}...`);
        }
      }
    });

    it('should block access to sibling directory files', async () => {
      // tests/cli/src에서 형제 디렉토리 파일들에 접근 시도
      const siblingDirectoryAttacks = [
        '/../_src/index.html',              // tests/cli/_src/index.html
        '/../_src/style.css',               // tests/cli/_src/style.css
        '/../_src/script.js',               // tests/cli/_src/script.js
        '/../_src/data.json',               // tests/cli/_src/data.json
        '/../_src/test-image.txt'           // tests/cli/_src/test-image.txt
      ];

      for (const attack of siblingDirectoryAttacks) {
        const result = await makeRequest(attack);
        console.log(`🔍 Testing sibling directory access ${attack}: ${result.statusCode} (${result.body.length} bytes)`);

        // 형제 디렉토리 파일들은 보안상 차단되어야 함
        expect([403, 404, 500]).toContain(result.statusCode);

        // 만약 200 응답이 나온다면 보안 경고
        if (result.statusCode === 200) {
          console.log(`⚠️  SECURITY WARNING: ${attack} returned 200 - possible directory traversal!`);
          console.log(`   Response preview: ${result.body.substring(0, 100)}...`);
        }
      }
    });

    it('should block access to parent test directories', async () => {
      // tests/cli/src에서 상위 테스트 디렉토리들에 접근 시도
      const parentTestDirectoryAttacks = [
        '/../../cli/',                       // tests/cli/ 디렉토리 자체
        '/../../cli/cli.web.test.js',       // tests/cli/cli.web.test.js
        '/../../cli/cli.args.test.js',      // tests/cli/cli.args.test.js
        '/../../cli/package.json',          // tests/cli/package.json
        '/../../cli/node_modules/',         // tests/cli/node_modules/
        '/../../cli/node_modules/vitest/'   // tests/cli/node_modules/vitest/
      ];

      for (const attack of parentTestDirectoryAttacks) {
        const result = await makeRequest(attack);
        console.log(`🔍 Testing parent test directory access ${attack}: ${result.statusCode} (${result.body.length} bytes)`);

        // 상위 테스트 디렉토리들은 보안상 차단되어야 함
        expect([403, 404, 500]).toContain(result.statusCode);

        // 만약 200 응답이 나온다면 보안 경고
        if (result.statusCode === 200) {
          console.log(`⚠️  SECURITY WARNING: ${attack} returned 200 - possible test directory exposure!`);
          console.log(`   Response preview: ${result.body.substring(0, 100)}...`);
        }
      }
    });
  });

  describe('Error Information Disclosure', () => {
    it('should not expose sensitive information in error responses', async () => {
      const testPaths = [
        '/nonexistent.js',
        '/invalid/path/file.txt',
        '/test/../../invalid'
      ];

      for (const testPath of testPaths) {
        const result = await makeRequest(testPath);

        // 에러 응답에서 민감한 정보가 노출되지 않아야 함
        if (result.statusCode === 500) {
          expect(result.body).not.toContain('process.cwd');
          expect(result.body).not.toContain('__dirname');
          expect(result.body).not.toContain('__filename');
          expect(result.body).not.toContain('require.main');
          expect(result.body).not.toContain('module.filename');
          expect(result.body).not.toContain('Error:');
          expect(result.body).not.toContain('at ');
        }
      }
    });

    it('should provide safe error messages', async () => {
      const result = await makeRequest('/invalid');

      if (result.statusCode === 500) {
        // 에러 메시지가 너무 상세하지 않아야 함
        expect(result.body.length).toBeLessThan(500);
      }
    });
  });

  describe('Mixed Attack Vectors', () => {
    it('should block complex combined attacks', async () => {
      const complexAttacks = [
        '/src/..%2fpackage.json',
        '/src%2f..%2f.env',
        '/web%5c..%5c.gitignore',
        '/assets%2f..%2f%2e%2e%2fconfig',
        '/page/about.html/..%2fpackage.json',
        '/src/index.js/..%5c.env'
      ];

      for (const attack of complexAttacks) {
        const result = await makeRequest(attack);
        expect([403, 404, 500]).toContain(result.statusCode);
      }
    });

    it('should block extremely long paths', async () => {
      const longPath = '/' + 'a'.repeat(1000);
      const result = await makeRequest(longPath);
      expect([403, 404, 500]).toContain(result.statusCode);
    });
  });

});
