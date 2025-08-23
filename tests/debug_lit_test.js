import { OliveLit } from '../src/olivecss-lit.js';

// 테스트용 소스 코드
const testSource = `
import { LitElement, html } from 'lit';

class TestComponent extends LitElement {
  render() {
    return html\`
      <div>
        <!-- btn-primary -->
        <button>Click me</button>
        
        <!-- color: red; font-size: 16px; -->
        <span>Styled text</span>
      </div>
    \`;
  }
}

customElements.define('test-component', TestComponent);
`;

// 플러그인 인스턴스 생성
const plugin = OliveLit();

// 변환 실행
const result = await plugin.transform(testSource, 'test.js');

console.log('=== 원본 코드 ===');
console.log(testSource);
console.log('\n=== 변환된 코드 ===');
console.log(result.code);
console.log('\n=== 변환 성공 여부 ===');
console.log(result ? '성공' : '실패');
