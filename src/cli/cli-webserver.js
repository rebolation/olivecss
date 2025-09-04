#!/usr/bin/env node

// ========================================
// Olive CSS Web Server 클래스들
// ========================================

import http from "http";
import sirv from "sirv";
import { 
  WebServerSecurityValidator, 
  ProxyServerSecurityValidator
} from "./cli-validators.js";

// ---------------------------------------------
// 기본 WebServer 클래스 (추상 클래스 역할)
// ---------------------------------------------

export class WebServer {
  constructor(port = 3000, baseDir = null) {
    this.port = port;
    this.baseDir = baseDir;
    this.server = null;
    this.serveRoot = null;
    
    // 보안 검증기 초기화
    this.webSecurityValidator = new WebServerSecurityValidator();
    this.proxySecurityValidator = new ProxyServerSecurityValidator();
  }

  // 포트가 사용 중일 때 자동으로 증가시키는 함수
  tryListen(resolve, reject) {
    try {
      this.server.listen(this.port, () => {
        resolve();
      });
      
      this.server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          // 최대 10개 포트까지 시도 (3000-3009)
          if (this.port - 3000 < 10) {
            this.port++;
            this.server.close();
            this.tryListen(resolve, reject);
          } else {
            reject(new Error(`Multiple ports (3000-${this.port}) are in use. Please specify a different port range.`));
          }
        } else {
          reject(err);
        }
      });
    } catch (error) {
      reject(error);
    }
  }

  // Livereload 스크립트 주입
  injectLivereloadScript(content, port) {
    return content.replace(
      "</body>",
      `<script>
        (function() {
          let ws = null;
          let reconnectInterval = null;
          const RECONNECT_INTERVAL = 1000;
          const MAX_RECONNECT_ATTEMPTS = 10;
          let reconnectAttempts = 0;
          const SECURITY_TIMEOUT = 5000;
          let securityTimer = null;
          
          function connect() {
            try {
              // 보안: 로컬호스트만 허용
              const wsUrl = "ws://localhost:${port}";
              if (!wsUrl.includes('localhost') && !wsUrl.includes('127.0.0.1')) {
                console.error("  🫒  SECURITY: Invalid WebSocket URL");
                return;
              }
              
              ws = new WebSocket(wsUrl);
              
              // 보안: 연결 타임아웃 설정
              securityTimer = setTimeout(() => {
                if (ws.readyState === WebSocket.CONNECTING) {
                  console.error("  🫒  SECURITY: Connection timeout");
                  ws.close();
                }
              }, SECURITY_TIMEOUT);
              
              ws.onopen = () => {
                console.log("  🫒  Livereload connected");
                reconnectAttempts = 0;
                if (reconnectInterval) {
                  clearInterval(reconnectInterval);
                  reconnectInterval = null;
                }
                if (securityTimer) {
                  clearTimeout(securityTimer);
                  securityTimer = null;
                }
                
                // 주기적으로 ping 보내기 (30초마다)
                setInterval(() => {
                  if (ws.readyState === WebSocket.OPEN) {
                    ws.send('ping');
                  }
                }, 30000);
              };
              
              ws.onmessage = (e) => {
                try {
                  // 보안: 메시지 검증 - "reload"와 "pong"만 허용
                  if (typeof e.data !== 'string' || (e.data !== 'reload' && e.data !== 'pong')) {
                    console.error("  🫒  SECURITY: Unauthorized message received");
                    ws.close();
                    return;
                  }
                  
                  if (e.data === "reload") {
                    console.log("  🫒  Reloading page...");
                    location.reload();
                  } else if (e.data === "pong") {
                    console.log("  🫒  Pong received - connection alive");
                  }
                } catch (error) {
                  console.error("  🫒  SECURITY: Message handling error:", error.message);
                  ws.close();
                }
              };
              
              ws.onerror = (e) => {
                console.log("  🫒  Livereload error:", e);
                if (securityTimer) {
                  clearTimeout(securityTimer);
                  securityTimer = null;
                }
              };
              
              ws.onclose = () => {
                console.log("  🫒  Livereload disconnected");
                if (reconnectInterval) {
                  clearInterval(reconnectInterval);
                  reconnectInterval = null;
                }
                if (securityTimer) {
                  clearTimeout(securityTimer);
                  securityTimer = null;
                }
                
                // 재연결 시도
                if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                  reconnectAttempts++;
                  reconnectInterval = setTimeout(connect, RECONNECT_INTERVAL);
                }
              };
            } catch (error) {
              console.error("  🫒  Livereload connection error:", error.message);
            }
          }
          
          // 페이지 로드 시 연결 시도
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', connect);
          } else {
            connect();
          }
        })();
      </script>
      </body>`
    );
  }

  // 서버 정리
  cleanup() {
    try {
      if (this.server) {
        this.server.close();
        // console.log('  🫒  Web server stopped');
      }
    } catch (error) {
      console.error('  🫒  Web server cleanup error:', error.message);
    }
  }
}

// ---------------------------------------------
// 보안이 적용된 웹서버 클래스 (WebServer 상속) - 공통 기능만
// ---------------------------------------------

export class SecureWebServer extends WebServer {
  constructor(port = 3000, baseDir = null, validator = null) {
    super(port, baseDir);
    this.validator = validator;
  }

  // 공통 보안 응답 헤더 설정
  setSecureResponseHeaders(res) {
    try {
      // 보안 관련 헤더 설정
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      
      // 개발 환경에서는 CORS 허용 (로컬 개발용)
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("SECURITY HEADERS FAILED")} - ${error.message}`);
    }
  }

  // 공통 보안 에러 응답
  sendSecureErrorResponse(res, statusCode, message) {
    try {
      this.setSecureResponseHeaders(res);
      res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
      res.end(message);
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("ERROR RESPONSE FAILED")} - ${error.message}`);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  }
}

// ---------------------------------------------
// 보안이 적용된 정적 파일 서버 클래스
// ---------------------------------------------

export class SecureStaticWebServer extends SecureWebServer {
  constructor(port = 3000, baseDir = null, validator = null) {
    super(port, baseDir, validator);
  }

  // 보안이 적용된 정적 파일 서버 시작 (상속을 통해 보안 기능 자동 적용)
  async start() {
    try {
      const httpModule = await import('http');
      const http = httpModule.default;
      const sirvModule = await import('sirv');
      const sirv = sirvModule.default;
      const fsModule = await import('fs');
      const fs = fsModule.default;
      const pathModule = await import('path');
      const path = pathModule.default;

      const serve = sirv(this.serveRoot || this.baseDir, {
        // dev: true,
        dev: false,
        etag: true,
        maxAge: 0,
        // 404 에러 처리를 위한 설정 추가
        onNoMatch: (req, res) => {
          // 존재하지 않는 파일에 대해 404 응답
          this.sendSecureErrorResponse(res, 404, 'File Not Found');
        }
      });

      this.server = http.createServer(async (req, res) => {
        try {
          // HTTP 메서드 검증만 수행 (정적 파일 서빙용)
          const methodValidation = this.webSecurityValidator.validateMethod(req.method, ['GET', 'HEAD']);
          if (!methodValidation.valid) {
            this.sendSecureErrorResponse(res, 405, `Method Not Allowed: ${methodValidation.reason}`);
            return;
          }

          // HTML 파일인 경우에만 경로 검증 수행 (Livereload 스크립트 주입을 위해)
          if (req.url === "/" || req.url.endsWith(".html")) {
            const pathValidation = this.webSecurityValidator.validatePath(req.url);
            if (!pathValidation.valid) {
              this.sendSecureErrorResponse(res, 403, `Access Forbidden: ${pathValidation.reason}`);
              return;
            }
          }

          // validator 검증은 HTML 파일에만 적용
          if (req.url === "/" || req.url.endsWith(".html")) {
            if (this.validator) {
              const validation = this.validator.validateStaticFileRequest(req);
              if (!validation.allowed) {
                this.sendSecureErrorResponse(res, 403, `Access Forbidden: ${validation.reason}`);
                return;
              }
            }
          }

          // HTML 파일인 경우 Livereload 스크립트 주입
          if (req.url === "/" || req.url.endsWith(".html")) {
            try {
              let urlPath = req.url.startsWith('/') ? req.url.substring(1) : req.url;
              if (req.url === "/") urlPath = "index.html";
              
              const filePath = path.join(this.serveRoot || this.baseDir, urlPath);
              
              // 파일 존재 여부 확인
              if (!fs.existsSync(filePath)) {
                this.sendSecureErrorResponse(res, 404, 'File Not Found');
                return;
              }
              
              // 파일 읽기
              const html = fs.readFileSync(filePath, "utf-8");
              
              // Livereload 스크립트 주입
              let modifiedHtml = html;
              if (!html.includes("  🫒  Livereload")) {
                modifiedHtml = this.injectLivereloadScript(html, this.port);
              }

              // 보안 헤더 설정
              this.setSecureResponseHeaders(res);
              res.setHeader("Content-Type", "text/html; charset=utf-8");
              res.end(modifiedHtml);
              return;
            } catch (e) {
              // HTML 파일 처리 실패 시 sirv로 fallback
              console.error(`  🫒  ${this.highlightError("HTML PROCESSING FAILED")} - ${e.message}`);
            }
          }

          // HTML이 아닌 파일이나 fallback의 경우 sirv로 처리
          serve(req, res);
        } catch (error) {
          console.error(`  🫒  ${this.highlightError("REQUEST PROCESSING ERROR")} - ${error.message}`);
          this.sendSecureErrorResponse(res, 500, 'Internal Server Error');
        }
      });

      // tryListen을 사용하여 포트 처리
      return new Promise((resolve, reject) => {
        this.tryListen(resolve, reject);
      });
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("STATIC WEB SERVER FAILED")} - ${error.message}`);
      throw error;
    }
  }
}

// ---------------------------------------------
// 보안이 적용된 프록시 서버 클래스
// ---------------------------------------------

export class SecureProxyWebServer extends SecureWebServer {
  constructor(port = 3000, baseDir = null, validator = null) {
    super(port, baseDir, validator);
    this.targetHost = 'localhost';
    this.targetPort = 4000;
  }

  // 보안 프록시 요청 전달 (프록시 전용 기능)
  async forwardSecureRequest(req, targetHost, targetPort, http) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: targetHost,
        port: targetPort,
        path: req.url,
        method: req.method,
        headers: this.filterSafeHeaders(req.headers)
      };

      const proxyReq = http.request(options, (proxyRes) => {
        const chunks = [];
        proxyRes.on('data', (chunk) => chunks.push(chunk));
        proxyRes.on('end', () => {
          const body = Buffer.concat(chunks);
          resolve({
            status: proxyRes.statusCode,
            headers: proxyRes.headers,
            body: body
          });
        });
      });

      proxyReq.on('error', reject);
      
      // 요청 본문 전달
      if (req.body) {
        proxyReq.write(req.body);
      }
      
      proxyReq.end();
    });
  }

  // 안전한 헤더만 필터링 (프록시 전용 기능) - olive cli 운영에 필요한 헤더만 허용
  filterSafeHeaders(headers) {
    const safeHeaders = {};
    // olive cli 운영에 실제로 필요한 헤더만 허용 (보안 강화)
    const allowedHeaders = [
      'accept', 'accept-encoding', 'accept-language', 'cache-control',
      'connection', 'content-length', 'content-type',
      'if-modified-since', 'if-none-match'
      // 'host' 헤더 제거: 호스트 헤더 조작 공격 방지
      // 'user-agent' 헤더 제거: 불필요한 정보 노출 방지
    ];
    
    for (const [key, value] of Object.entries(headers)) {
      if (allowedHeaders.includes(key.toLowerCase())) {
        safeHeaders[key] = value;
      }
    }
    
    return safeHeaders;
  }

  // 보안이 적용된 프록시 서버 시작 (상속을 통해 보안 기능 자동 적용)
  async start() {
    try {
      const httpModule = await import('http');
      const http = httpModule.default;

      this.server = http.createServer(async (req, res) => {
        try {
          // 공통 보안 검증 (상속을 통해 자동 적용)
          const pathValidation = this.proxySecurityValidator.validatePath(req.url);
          if (!pathValidation.valid) {
            this.sendSecureErrorResponse(res, 403, `Access Forbidden: ${pathValidation.reason}`);
            return;
          }

          const methodValidation = this.proxySecurityValidator.validateMethod(req.method, ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
          if (!methodValidation.valid) {
            this.sendSecureErrorResponse(res, 405, `Method Not Allowed: ${methodValidation.reason}`);
            return;
          }

          const sizeValidation = this.proxySecurityValidator.validateRequestSize(req);
          if (!sizeValidation.valid) {
            this.sendSecureErrorResponse(res, 413, `Request Too Large: ${sizeValidation.reason}`);
            return;
          }

          // 추가 보안 검증 (validator가 있는 경우)
          if (this.validator) {
            const validation = this.validator.validateProxyRequest(req);
            if (!validation.allowed) {
              this.sendSecureErrorResponse(res, 403, `Access Forbidden: ${validation.reason}`);
              return;
            }
          }

          // 프록시 요청 전달
          const proxyResponse = await this.forwardSecureRequest(req, this.targetHost, this.targetPort, http);
          
          // HTML 응답인 경우 Livereload 스크립트 주입
          let responseBody = proxyResponse.body;
          if (proxyResponse.headers['content-type'] && proxyResponse.headers['content-type'].includes('text/html')) {
            const htmlContent = responseBody.toString();
            if (!htmlContent.includes('  🫒  Livereload')) {
              responseBody = this.injectLivereloadScript(htmlContent, this.port);
              
              // Content-Length 헤더 업데이트
              if (proxyResponse.headers['content-length']) {
                proxyResponse.headers['content-length'] = Buffer.byteLength(responseBody, 'utf8');
              }
            }
          }
          
          // 응답 헤더 필터링
          const safeHeaders = this.validator ? this.validator.filterProxyResponseHeaders(proxyResponse.headers) : proxyResponse.headers;
          
          // 보안 헤더 설정
          this.setSecureResponseHeaders(res);
          res.writeHead(proxyResponse.status, safeHeaders);
          res.end(responseBody);
        } catch (error) {
          this.sendSecureErrorResponse(res, 500, 'Proxy Error');
        }
      });

      // tryListen을 사용하여 포트 처리
      return new Promise((resolve, reject) => {
        this.tryListen(resolve, reject);
      });
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("PROXY SERVER FAILED")} - ${error.message}`);
      throw error;
    }
  }
}




