#!/usr/bin/env node

// ========================================
// Olive CSS WebSocket Server 클래스들
// ========================================
import { WebSocketServer as WS } from 'ws';
import { ColorUtility } from './cli-utils.js';

// ---------------------------------------------
// 기본 WebSocketServer 클래스 (추상 클래스 역할)
// ---------------------------------------------

export class WebSocketServer {
  constructor(port = 3000) {
    this.port = port;
    this.wsServer = null;
    this.wsSecurityValidator = null;
    
    // ColorUtility 인스턴스 추가
    this.colorUtility = new ColorUtility();
    this.highlightError = this.colorUtility.highlightError.bind(this.colorUtility);
  }

  // Livereload 트리거 (공통 기능)
  triggerLivereload() {
    try {
      if (this.wsServer && global.broadcastReload) {
        global.broadcastReload();
      }
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("LIVERELOAD FAILED")} - ${error.message}`);
    }
  }

  // WebSocket 서버 정리 (공통 기능)
  cleanup() {
    try {
      if (this.wsServer) {
        this.wsServer.close();
        // console.log('  🫒  WebSocket server stopped');
      }
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("WEBSOCKET CLEANUP FAILED")} - ${error.message}`);
    }
  }
}

// ---------------------------------------------
// 통합된 보안 WebSocket 서버 클래스
// ---------------------------------------------

export class SecureWebSocketServer extends WebSocketServer {
  constructor(port = 3000, validator = null) {
    super(port);
    this.validator = validator;
  }

  // 안전한 브로드캐스트 메소드
  secureBroadcast(wss, message, validator) {
    try {
      if (!wss || !message || !validator) {
        throw new Error('Invalid parameters for secure broadcast');
      }

      const connectedClients = wss.clients.size;
      if (connectedClients === 0) {
        return;
      }

      // 브로드캐스트 메시지 검증: "reload"와 "ping"만 허용
      if (message !== 'reload' && message !== 'ping') {
        console.error(`  🫒  ${this.highlightError("MESSAGE VALIDATION FAILED")} - Only "reload" and "ping" messages are allowed`);
        return;
      }

      wss.clients.forEach((client) => {
        try {
          if (client.readyState === 1) {
            client.send(message);
          }
        } catch (error) {
          // 클라이언트 에러는 조용히 무시
        }
      });
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("BROADCAST FAILED")} - ${error.message}`);
    }
  }

  async start(httpServer) {
    try {
      this.wsServer = new WS({ server: httpServer });

      // 연결 이벤트 처리
      this.wsServer.on('connection', (ws, request) => {
        try {
          const clientIP = request.socket.remoteAddress;
          
          // 보안 검증 (validator가 있는 경우)
          if (this.validator && this.validator.validateConnection) {
            const validation = this.validator.validateConnection(request, clientIP);
            if (!validation.allowed) {
              this.sendSecureErrorResponse(ws, 1008, `Security validation failed: ${validation.reason}`);
              return;
            }
          }

          // validator가 있는 경우 연결 등록
          if (this.validator && this.validator.registerConnection) {
            this.validator.registerConnection(clientIP, ws);
          }

          // 메시지 이벤트 처리
          ws.on('message', (data) => {
            try {
              // 서버측 메시지 검증 강화
              let message = data;
              
              // 허용된 메시지만 처리: 'reload', 'ping', 'pong'
              const allowedMessages = ['reload', 'ping', 'pong'];
              if (!allowedMessages.includes(message)) {
                console.error(`  🫒  ${this.highlightError("SECURITY CHECK FAILED")} - Unauthorized message received: ${message}`);
                this.sendSecureErrorResponse(ws, 1008, 'Unauthorized message');
                return;
              }
              
              // validator 검증 (추가 보안 레이어)
              if (this.validator && this.validator.validateMessage) {
                const messageValidation = this.validator.validateMessage(message, clientIP);
                if (!messageValidation.allowed) {
                  console.error(`  🫒  ${this.highlightError("MESSAGE VALIDATION FAILED")} - ${messageValidation.reason}`);
                  this.sendSecureErrorResponse(ws, 1008, messageValidation.reason);
                  return;
                }
              }
              
              // ping 메시지에 대한 pong 응답
              if (message === 'ping') {
                try {
                  ws.send('pong');
                  // console.log('  🫒  Pong sent to client');
                } catch (error) {
                  // console.error('  🫒  Failed to send pong:', error.message);
                }
              }
              
            } catch (error) {
              console.error(`  🫒  ${this.highlightError("MESSAGE PROCESSING FAILED")} - ${error.message}`);
              this.sendSecureErrorResponse(ws, 1011, 'Message processing error');
            }
          });

          // 연결 종료 이벤트 처리
          ws.on('close', () => {
            try {
              if (this.validator && this.validator.unregisterConnection) {
                this.validator.unregisterConnection(clientIP);
              }
            } catch (error) {
                              console.error(`  🫒  ${this.highlightError("CONNECTION CLOSE FAILED")} - ${error.message}`);
            }
          });

          // 에러 이벤트 처리
          ws.on('error', (error) => {
            try {
              if (this.validator && this.validator.unregisterConnection) {
                this.validator.unregisterConnection(clientIP);
              }
              console.error(`  🫒  WEBSOCKET ERROR - ${error.message}`);
                          } catch (closeError) {
                console.error(`  🫒  ${this.highlightError("ERROR HANDLING FAILED")} - ${closeError.message}`);
              }
          });

        } catch (error) {
          console.error(`  🫒  ${this.highlightError("CONNECTION SETUP FAILED")} - ${error.message}`);
          this.sendSecureErrorResponse(ws, 1011, 'Setup error');
        }
      });

      // WebSocket 서버 에러 이벤트 처리
      this.wsServer.on('error', (error) => {
        console.error(`  🫒  ${this.highlightError("WEBSOCKET SERVER FAILED")} - ${error.message}`);
      });
      
      // Livereload 브로드캐스트 함수 설정
      const broadcastReload = () => {    
        try {
          if (this.wsServer && this.validator) {
            this.secureBroadcast(this.wsServer, "reload", this.validator);
          } else {
            console.error('  🫒  WebSocket server or validator not ready');
          }
        } catch (error) {
          console.error(`  🫒  ${this.highlightError("BROADCAST RELOAD FAILED")} - ${error.message}`);
        }
      };
      
      // global에 broadcastReload 함수 등록
      global.broadcastReload = broadcastReload;
      
      return this.wsServer;
      
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("WEBSOCKET STARTUP FAILED")} - ${error.message}`);
      throw error;
    }
  }

  // 보안 에러 응답 전송
  sendSecureErrorResponse(ws, code, reason) {
    try {
      ws.close(code, reason);
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("ERROR RESPONSE FAILED")} - ${error.message}`);
    }
  }
}
