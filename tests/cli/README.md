# 🫒 OliveCSS CLI 보안 테스트

이 폴더는 OliveCSS CLI의 보안 기능을 테스트하기 위한 테스트 스위트입니다.

## 📁 파일 구조

```
tests/cli/
├── cli-path-traversal.test.js  # 경로 우회 공격 테스트
├── vitest.config.js            # vitest 설정
├── vitest.setup.js             # 테스트 환경 설정
├── package.json                # 테스트 의존성
└── README.md                   # 이 파일
```

## 🎯 테스트 목적

OliveCSS CLI가 다음과 같은 보안 공격을 효과적으로 차단하는지 검증합니다:

- **Path Traversal 공격** (`../../../etc/passwd`)
- **URL 인코딩 우회** (`%2e%2e%2f`)
- **더블 인코딩 우회** (`%252e%252e%252f`)
- **Null Byte 공격** (`.env%00`)
- **대소문자 변형** (`.ENV`, `.Env`)
- **유니코드 문자 우회** (`.ｅｎｖ`)
- **숨겨진 파일 접근** (`.env`, `.gitignore`)
- **시스템 파일 접근** (`/etc/passwd`, `/windows/system32/...`)

## 🚀 테스트 실행

### 기본 테스트 실행
```bash
cd tests/cli
npm test
```

### 보안 테스트만 실행
```bash
npm run test:security
```

### 실시간 감시 모드
```bash
npm run test:watch
```

### 커버리지 리포트
```bash
npm run test:coverage
```

### UI 모드
```bash
npm run test:ui
```

## 🔧 테스트 환경

### 요구사항
- Node.js 18+
- npm 또는 yarn
- OliveCSS CLI (`src/cli.js`)

### 설치
```bash
cd tests/cli
npm install
```

## 📊 테스트 결과

테스트는 다음을 검증합니다:

1. **공격 차단**: 모든 악의적인 요청이 적절히 차단됨
2. **정상 접근**: 합법적인 웹 파일에 대한 접근 허용
3. **에러 처리**: 민감한 정보 노출 없이 적절한 에러 응답
4. **CLI 검증**: CLI 인자 검증 및 서버 실행 상태 확인

## 🚨 보안 테스트 시나리오

### 기본 Path Traversal
- `../../../etc/passwd` → 403/404 응답
- `..\\..\\..\\windows\\system32\\...` → 403/404 응답

### URL 인코딩 우회
- `%2e%2e%2fpackage.json` → 403/404 응답
- `%252e%252e%252fpackage.json` → 403/404 응답

### 특수 문자 조합
- `.env%00.txt` → 403/404 응답
- `.ｅｎｖ.bak` → 403/404 응답

### 파일 접근 제어
- `.env`, `.gitignore` → 403/404 응답
- `package.json`, `src/cli.js` → 403/404 응답

## ✅ 예상 결과

모든 보안 테스트가 통과해야 합니다:

- **공격 차단**: 100% 성공
- **정상 접근**: 100% 성공
- **에러 처리**: 100% 성공
- **CLI 검증**: 100% 성공

## 🔍 문제 해결

### 테스트 실패 시
1. CLI 서버가 정상적으로 시작되었는지 확인
2. 포트 3000이 사용 가능한지 확인
3. 테스트 출력 디렉토리 권한 확인

### 디버깅
```bash
# 상세 로그와 함께 테스트 실행
npm run test:security -- --reporter=verbose

# 특정 테스트만 실행
npm run test:security -- --run cli-path-traversal.test.js
```

## 📝 참고사항

- 테스트는 실제 CLI 서버를 실행하여 수행됩니다
- 포트 3000을 사용하므로 다른 서비스와 충돌하지 않도록 주의하세요
- 테스트 완료 후 자동으로 서버가 종료되고 정리됩니다


