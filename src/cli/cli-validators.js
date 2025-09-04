/*
 *   🫒  OliveCSS 최적화된 보안 아키텍처
 * 
 * 통합된 검증 시스템:
 * 1. BaseValidator - 모든 검증 클래스의 기본 클래스
 * 2. SecureArgumentValidator - 실행 인자 검증 (경로 순회 공격 방지)
 * 3. WebServerSecurityValidator - 웹서버 보안 검증
 * 4. ProxyServerSecurityValidator - 프록시 서버 보안 검증
 * 5. WebSocketSecurityValidator - WebSocket 보안 검증
 */

// ========================================
// 보안 설정 클래스
// ========================================
class SecurityConfig {
  constructor() {
    this.validation = {
      maxArgs: 10,
      maxArgStrLength: 100
    };

    // 허용된 폴더명 패턴 (경로 순회 공격 방지, 대소문자 무시)
    this.allowedArgPatterns = [
      /^jekyll$/i,
      /^_[a-zA-Z0-9._\-=+~!@#$%^&\s]*$/i,
      /^[a-zA-Z0-9._\-=+~!@#$%^&\s]*_$/i,
      /^olive_[a-zA-Z0-9._\-=+~!@#$%^&\s]*$/i,
      /^[a-zA-Z0-9._\-=+~!@#$%^&\s]*_olive$/i
    ];
    
    this.websocket = {
      maxConnections: 20,
      allowedOrigins: ['localhost', '127.0.0.1', '::1', '[::1]']
    };
  }
}

const securityConfig = new SecurityConfig();

// ========================================
// 공통 검증 기본 클래스
// ========================================
class BaseValidator {
  constructor(config = null) {
    this.config = config;
  }

  // 공통 경로 검증 (경로 순회 공격 방지)
  validatePath(url, maxLength = 2048) {
    try {
      if (!url || typeof url !== 'string') {
        return { valid: false, reason: 'Invalid URL' };
      }

      // 경로 순회 공격 방지
      if (url.includes('..') || url.includes('//')) {
        return { valid: false, reason: 'Path traversal attempt' };
      }

      // URL 길이 제한
      if (url.length > maxLength) {
        return { valid: false, reason: 'URL too long' };
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, reason: 'Path validation error' };
    }
  }

  // 공통 HTTP 메서드 검증
  validateMethod(method, allowedMethods = ['GET', 'HEAD']) {
    try {
      if (!allowedMethods.includes(method)) {
        return { valid: false, reason: `Method ${method} not allowed` };
      }
      return { valid: true };
    } catch (error) {
      return { valid: false, reason: 'Method validation error' };
    }
  }

  // 공통 요청 크기 검증
  validateRequestSize(req, maxSize = 10 * 1024 * 1024) {
    try {
      const contentLength = parseInt(req.headers['content-length'] || '0');
      
      if (contentLength > maxSize) {
        return { valid: false, reason: 'Request too large' };
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, reason: 'Size validation error' };
    }
  }

  // 공통 IP 주소 검증
  validateIP(ip, allowedPatterns = ['localhost', '127.0.0.1', '::1', '[::1]']) {
    try {
      if (!ip || typeof ip !== 'string') {
        return false;
      }
      
      return allowedPatterns.includes(ip);
    } catch (error) {
      return false;
    }
  }
}

// ========================================
// 입력 인수 보안 검증 클래스
// ========================================
export class SecureArgumentValidator extends BaseValidator {
  constructor(config = securityConfig) {
    super(config);
  }

  validateArguments(args) {
    try {
      if (!Array.isArray(args)) {
        throw new Error('Arguments must be an array');
      }

      if (args.length > this.config.validation.maxArgs) {
        throw new Error(`Too many arguments: ${args.length} > ${this.config.validation.maxArgs}`);
      }

      const validatedArgs = [];
      
      for (const arg of args) {
        if (typeof arg !== 'string') {
          throw new Error(`Invalid argument type: ${typeof arg}`);
        }

        if (arg.length > this.config.validation.maxArgStrLength) {
          throw new Error(`Argument too long: ${arg.length} > ${this.config.validation.maxArgStrLength}`);
        }

        const validationResult = this.validateArgument(arg);
        if (validationResult.valid) {
          validatedArgs.push(arg);
        } else {
          throw new Error(`FOLDER RULE VIOLATION - Directory name must follow one of these patterns:`);
          // throw new Error(`FOLDER_RULE_VIOLATION: ${arg} - ${validationResult.reason}`);
        }
      }

      return validatedArgs;
    } catch (error) {
      throw error;
    }
  }

  validateArgument(arg) {
    try {
      if (!arg || typeof arg !== 'string') {
        return { valid: false, reason: 'Invalid argument type' };
      }

      // 허용된 패턴 중 하나와 일치하는지 확인 (대소문자 무시)
      for (const pattern of this.config.allowedArgPatterns) {
        if (pattern.test(arg)) {
          return { valid: true };
        }
      }

      // 절대 경로 검사: 프로젝트 루트의 하위 폴더라면 허용
      if (arg.includes('..')) {
        return { valid: false, reason: 'Path traversal attempt' };
      }
      
      return { valid: false, reason: 'Does not match allowed folder name patterns' };
    } catch (error) {
      console.error(`  🫒  ${this.highlightError("ARGUMENT VALIDATION FAILED")} - Argument validation error: ${error.message}`);
      return { valid: false, reason: 'Validation error' };
    }
  }

  isArgumentValid(arg) {
    return this.validateArgument(arg).valid;
  }
}

// ========================================
// 웹서버 보안 검증 클래스
// ========================================
export class WebServerSecurityValidator extends BaseValidator {
  constructor(config = securityConfig) {
    super(config);
  }

  validateStaticFileRequest(req) {
    try {
      // 경로 검증
      const pathValidation = this.validatePath(req.url);
      if (!pathValidation.valid) {
        return { allowed: false, reason: pathValidation.reason };
      }

      // HTTP 메서드 검증
      const methodValidation = this.validateMethod(req.method, ['GET', 'HEAD']);
      if (!methodValidation.valid) {
        return { allowed: false, reason: methodValidation.reason };
      }

      return { allowed: true, reason: 'Request allowed' };
    } catch (error) {
      console.error(`  🫒  STATIC FILE VALIDATION FAILED - ${error.message}`);
      return { allowed: false, reason: `Validation error: ${error.message}` };
    }
  }
}

// ========================================
// 프록시 서버 보안 검증 클래스
// ========================================
export class ProxyServerSecurityValidator extends BaseValidator {
  constructor(config = securityConfig) {
    super(config);
  }

  validateProxyRequest(req) {
    try {
      // 경로 검증
      const pathValidation = this.validatePath(req.url);
      if (!pathValidation.valid) {
        return { allowed: false, reason: pathValidation.reason };
      }

      // HTTP 메서드 검증
      const methodValidation = this.validateMethod(req.method, ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
      if (!methodValidation.valid) {
        return { allowed: false, reason: methodValidation.reason };
      }

      // 요청 크기 검증
      const sizeValidation = this.validateRequestSize(req);
      if (!sizeValidation.valid) {
        return { allowed: false, reason: sizeValidation.reason };
      }

      return { allowed: true, reason: 'Proxy request allowed' };
    } catch (error) {
      console.error(`  🫒  PROXY VALIDATION FAILED - ${error.message}`);
      return { allowed: false, reason: `Validation error: ${error.message}` };
    }
  }

  filterProxyResponseHeaders(headers) {
    try {
      const safeHeaders = {};
      const allowedHeaders = [
        'content-type', 'content-length', 'cache-control', 'etag',
        'last-modified', 'expires', 'pragma', 'vary'
      ];

      for (const header of allowedHeaders) {
        if (headers[header]) {
          safeHeaders[header] = headers[header];
        }
      }

      return safeHeaders;
    } catch (error) {
      console.error(`  🫒  HEADER FILTERING FAILED - ${error.message}`);
      return {};
    }
  }
}

// ========================================
// WebSocket 보안 검증 클래스
// ========================================
export class WebSocketSecurityValidator extends BaseValidator {
  constructor(config = securityConfig) {
    super(config);
    this.activeConnections = new Map();
  }

  validateConnection(request, clientIP) {
    try {
      if (this.activeConnections.size >= this.config.websocket.maxConnections) {
        return { allowed: false, reason: 'Maximum connections reached' };
      }

      const origin = request.headers.origin;
      if (origin && !this.isAllowedOrigin(origin)) {
        return { allowed: false, reason: 'Origin not allowed' };
      }

      if (!this.validateIP(clientIP)) {
        return { allowed: false, reason: 'Invalid IP address' };
      }

      return { allowed: true, reason: 'Connection allowed' };
    } catch (error) {
      console.error(`  🫒  WEBSOCKET CONNECTION VALIDATION FAILED - ${error.message}`);
      return { allowed: false, reason: `Validation error: ${error.message}` };
    }
  }

  validateMessage(message, clientIP) {
    try {
      // "reload", "ping", "pong" 메시지만 허용
      if (message !== 'reload' && message !== 'ping' && message !== 'pong') {
        return { allowed: false, reason: 'Only "reload", "ping", and "pong" messages are allowed' };
      }

      if (!this.activeConnections.has(clientIP)) {
        return { allowed: false, reason: 'Connection not active' };
      }

      return { allowed: true, reason: 'Message allowed' };
    } catch (error) {
      console.error(`  🫒  WEBSOCKET MESSAGE VALIDATION FAILED - ${error.message}`);
      return { allowed: false, reason: `Validation error: ${error.message}` };
    }
  }

  isAllowedOrigin(origin) {
    try {
      const url = new URL(origin);
      return this.config.websocket.allowedOrigins.includes(url.hostname);
    } catch (error) {
      return false;
    }
  }

  registerConnection(clientIP, connection) {
    try {
      this.activeConnections.set(clientIP, connection);
    } catch (error) {
      console.error(`  🫒  CONNECTION REGISTRATION FAILED - ${error.message}`);
    }
  }

  unregisterConnection(clientIP) {
    try {
      this.activeConnections.delete(clientIP);
    } catch (error) {
      console.error(`  🫒  CONNECTION UNREGISTRATION FAILED - ${error.message}`);
    }
  }

  getStats() {
    return {
      activeConnections: this.activeConnections.size,
      maxConnections: this.config.websocket.maxConnections
    };
  }
}

// ========================================
// 통합 검증 팩토리 클래스
// ========================================
export class ValidationFactory {
  static createValidator(type, config = securityConfig) {
    switch (type) {
      case 'argument':
        return new SecureArgumentValidator(config);
      case 'webserver':
        return new WebServerSecurityValidator(config);
      case 'proxy':
        return new ProxyServerSecurityValidator(config);
      case 'websocket':
        return new WebSocketSecurityValidator(config);
      default:
        throw new Error(`Unknown validator type: ${type}`);
    }
  }

  static createAllValidators(config = securityConfig) {
    return {
      argument: new SecureArgumentValidator(config),
      webserver: new WebServerSecurityValidator(config),
      proxy: new ProxyServerSecurityValidator(config),
      websocket: new WebSocketSecurityValidator(config)
    };
  }
}


