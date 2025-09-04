// 🫒 OliveCSS CLI 테스트 설정
// vitest 전역 설정 및 테스트 환경 준비

import { beforeAll, afterAll } from 'vitest';

// 테스트 환경 설정
beforeAll(() => {
  console.log('🫒 OliveCSS CLI 보안 테스트 시작');
  console.log('📁 테스트 환경: tests/cli');
  console.log('🎯 테스트 대상: Path Traversal 공격 방지');
});

afterAll(() => {
  console.log('🫒 OliveCSS CLI 보안 테스트 완료');
});

// 전역 테스트 설정
global.testTimeout = 30000;
global.hookTimeout = 30000;

// 테스트 환경 변수
process.env.NODE_ENV = 'test';
process.env.TEST_MODE = 'true';

// 콘솔 출력 정리
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  // 테스트 중에는 CLI 출력을 억제
  if (process.env.SUPPRESS_CLI_OUTPUT === 'true') {
    console.log = () => {};
    console.error = () => {};
  }
});

afterAll(() => {
  // 원래 콘솔 함수 복원
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});


