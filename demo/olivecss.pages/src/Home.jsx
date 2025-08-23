import { useState } from 'react'
import OliveCSSDemo from './OliveCSSDemo.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <div> {/* min-h-screen bg-gradient-to-br from-blue-500 to-indigo-500 p-8 */}
        <div> {/* max-w-4xl mx-auto */}
          
          <header> {/* bg-white rounded-lg text-center p-6 mb-12 */}
            <h1> {/* text-4xl font-bold text-gray-800 mb-4 */}
              🫒 OliveCSS React Demo
            </h1>
            <p> {/* text-lg text-gray-600 */}
              주석을 CSS 클래스로 변환하는 OliveCSS 플러그인 데모
            </p>
          </header>

          <div> {/* grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 */}
            
            <div> {/* bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow */}
              <div> {/* flex items-center mb-4 */}
                <div> {/* w-3 h-3 bg-green-500 rounded-full mr-3 */}
                </div>
                <h3> {/* text-lg font-semibold text-gray-800 */}
                  기본 스타일링
                </h3>
              </div>
              
              <p> {/* text-gray-600 mb-4 */}
                주석을 통해 Tailwind CSS 클래스를 적용할 수 있습니다.
              </p>
              
              <button 
                onClick={() => setCount(count + 1)}
              > {/* bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors */}
                클릭 횟수: {count}
              </button>
            </div>

            <div> {/* bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow */}
              <div> {/* flex items-center mb-4 */}
                <div> {/* w-3 h-3 bg-purple-500 rounded-full mr-3 */}
                </div>
                <h3> {/* text-lg font-semibold text-gray-800 */}
                  반응형 디자인
                </h3>
              </div>
              
              <p> {/* text-gray-600 mb-4 */}
                다양한 화면 크기에 대응하는 반응형 레이아웃입니다.
              </p>
              
              <div> {/* bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 rounded-md text-center */}
                <span> {/* block sm:hidden */}
                  모바일
                </span>
                <span> {/* hidden sm:block md:hidden */}
                  태블릿
                </span>
                <span> {/* hidden md:block */}
                  데스크톱
                </span>
              </div>
            </div>

            <div> {/* bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow */}
              <div> {/* flex items-center mb-4 */}
                <div> {/* w-3 h-3 bg-orange-500 rounded-full mr-3 */}
                </div>
                <h3> {/* text-lg font-semibold text-gray-800 */}
                  애니메이션
                </h3>
              </div>
              
              <p> {/* text-gray-600 mb-4 */}
                CSS 트랜지션과 애니메이션 효과를 확인해보세요.
              </p>
              
              <div> {/* bg-orange-500 text-white p-4 rounded-md text-center transform hover:scale-105 transition-transform duration-200 */}
                호버해보세요!
              </div>
            </div>
          </div>

          <div> {/* bg-white rounded-lg shadow-lg p-8 */}
            <h2> {/* text-2xl font-bold text-gray-800 mb-6 */}
              OliveCSS 기능
            </h2>
            
            <div> {/* space-y-4 */}
              <div> {/* flex items-start space-x-4 */}
                <div> {/* w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1 */}
                </div>
                <div>
                  <h3> {/* font-semibold text-gray-800 mb-2 */}
                    주석 기반 스타일링
                  </h3>
                  <p> {/* text-gray-600 */}
                    JSX 주석을 통해 CSS 클래스를 정의하고 적용할 수 있습니다.
                  </p>
                </div>
              </div>
              
              <div> {/* flex items-start space-x-4 */}
                <div> {/* w-6 h-6 bg-green-500 rounded-full flex-shrink-0 mt-1 */}
                </div>
                <div>
                  <h3> {/* font-semibold text-gray-800 mb-2 */}
                    Tailwind CSS 통합
                  </h3>
                  <p> {/* text-gray-600 */}
                    Tailwind CSS와 완벽하게 통합되어 유틸리티 클래스를 활용할 수 있습니다.
                  </p>
                </div>
              </div>
              
              <div> {/* flex items-start space-x-4 */}
                <div> {/* w-6 h-6 bg-purple-500 rounded-full flex-shrink-0 mt-1 */}
                </div>
                <div>
                  <h3> {/* font-semibold text-gray-800 mb-2 */}
                    개발자 경험 향상
                  </h3>
                  <p> {/* text-gray-600 */}
                    코드와 스타일을 분리하면서도 직관적인 개발 경험을 제공합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div> {/* bg-white rounded-lg shadow-lg p-8 mt-8 */}
            <OliveCSSDemo />
          </div>

          <footer> {/* text-center mt-12 text-gray-500 */}
            <p>OliveCSS - 주석을 CSS로 변환하는 혁신적인 플러그인</p>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default App
