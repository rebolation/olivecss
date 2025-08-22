import React, { useState } from 'react'

function OliveCSSDemo() {
  const [isActive, setIsActive] = useState(false)

  return (
    <div>
      <div> {/* space-y-8 */}
        <h2> {/* text-2xl font-bold text-gray-800 mb-6 */}
          OliveCSS 플러그인 데모
        </h2>
        
        <div> {/* bg-white rounded-lg p-6 shadow-md */}
          <h3> {/* text-lg font-semibold mb-4 */}
            예제 1: 기본 클래스 적용
          </h3>
          <div> {/* space-y-4 */}
            <div> {/* bg-red-500 text-white p-4 rounded */}
              이 요소는 주석을 통해 스타일이 적용되었습니다.
            </div>
            
            <div> {/* border-2 border-blue-500 p-3 */}
              테두리가 있는 요소입니다.
            </div>
          </div>
        </div>

        <div> {/* bg-white rounded-lg p-6 shadow-md */}
          <h3> {/* text-lg font-semibold mb-4 */}
            예제 2: 인라인 스타일 적용
          </h3>
          <div> {/* space-y-4 */}
            <div> {/* backgroundColor: 'yellow', padding: '10px' */}
              인라인 스타일이 적용된 요소입니다.
            </div>
            
            <div> {/* color: 'red', fontSize: '18px' */}
              빨간색 텍스트와 큰 폰트 크기입니다.
            </div>
          </div>
        </div>

        <div> {/* bg-white rounded-lg p-6 shadow-md */}
          <h3> {/* text-lg font-semibold mb-4 */}
            예제 3: 동적 클래스와 스타일
          </h3>
          <div> {/* space-y-4 */}
            <button 
              onClick={() => setIsActive(!isActive)}
            > {/* px-4 py-2 rounded transition-all */}
              상태 변경 버튼
            </button>
            
            <div className={`p-4 rounded transition-all ${isActive ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
              상태에 따라 색상이 변경되는 요소입니다.
              현재 상태: {isActive ? '활성' : '비활성'}
            </div>
          </div>
        </div>

        <div> {/* bg-white rounded-lg p-6 shadow-md */}
          <h3> {/* text-lg font-semibold mb-4 */}
            예제 4: 복합 스타일링
          </h3>
          <div> {/* grid grid-cols-1 md:grid-cols-2 gap-4 */}
            <div> {/* bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 rounded-lg shadow-lg */}
              그라데이션 배경과 그림자가 있는 카드입니다.
            </div>
            
            <div> {/* bg-blue-100 border-l-4 border-blue-500 p-4 */}
              왼쪽 테두리가 있는 알림 스타일 카드입니다.
            </div>
          </div>
        </div>

        <div> {/* bg-white rounded-lg p-6 shadow-md */}
          <h3> {/* text-lg font-semibold mb-4 */}
            예제 5: 반응형 스타일링
          </h3>
          <div> {/* space-y-4 */}
            <div> {/* text-sm md:text-base lg:text-lg p-2 md:p-4 */}
              화면 크기에 따라 텍스트 크기와 패딩이 변경되는 요소입니다.
            </div>
            
            <div> {/* hidden md:block bg-yellow-200 p-4 rounded */}
              중간 크기 이상의 화면에서만 보이는 요소입니다.
            </div>
          </div>
        </div>

        <div> {/* bg-gray-900 rounded-lg p-6 text-white */}
          <h3> {/* text-lg font-semibold mb-4 text-green-400 */}
            코드 예제
          </h3>
          <pre> {/* text-sm overflow-x-auto */}
{`// JSX에서 OliveCSS 사용 예제
<div>
  <span>주석이 클래스로 변환됩니다.</span>
  {/* bg-blue-500 text-white p-1 */}
  
  <div>주석이 스타일로 변환됩니다.</div>
  {/* backgroundColor: red; color: white; */}
</div>`}
          </pre>
          <div>
            <span>주석이 클래스로 변환됩니다.</span>
            {/* bg-blue-500 text-white p-1 */}
            
            <div>주석이 스타일로 변환됩니다.</div>
            {/* backgroundColor: red; color: white; */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OliveCSSDemo
