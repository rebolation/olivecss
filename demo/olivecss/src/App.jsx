import { useEffect, useState } from "react";
import OliveCSSDemo from './OliveCSSDemo.jsx'
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css"; 
import "prismjs/components/prism-jsx"; // JSX 지원 추가

function App() {
    const _code1 = `<p>🫒</p> <!-- this_is_a_delicious_olive -->`
    const _code2 = `<p class="this_is_not_a_delicious_olive">🫒</p>`    
    const _code3 = `
export default function App() {
    return (
    <div>
        <h1>Hello OliveCSS!</h1> {/* text-5xl font-bold text-green-600 */}
    </div>
    )
}`;


      const [code1, setCode1] = useState("");
      const [code2, setCode2] = useState("");
      const [code3, setCode3] = useState("");

      useEffect(() => {
        setCode1(Prism.highlight(_code1, Prism.languages.html, "html"));
      }, [code1]);

      useEffect(() => {
        setCode2(Prism.highlight(_code2, Prism.languages.html, "html"));
      }, [code2]);

      useEffect(() => {
        setCode3(Prism.highlight(_code3, Prism.languages.jsx, "jsx"));
      }, [code3]);

  return (
    <div> {/*  bg-gradient-to-r from-lime-500 via-emerald-600 to-lime-500  */}

        {/* // 고정 상단바 */}
        <header> {/* fixed top-0 left-0 right-0 bg-white shadow z-50 */}
            <div> {/* max-w-7xl mx-auto px-6 py-4 flex items-center justify-between */}
            <h1> 🫒 OliveCSS </h1> {/* text-xl font-bold text-green-600 */}
            <nav> {/* space-x-6 */}
                <a href="#">Home</a> {/* text-gray-700 hover:text-green-600 */}
                <a href="https://github.com/rebolation/olivecss">GitHub</a> {/* text-gray-700 hover:text-green-600 */}
            </nav>
            </div>
            
        </header>

        {/* // 메인 영역 */}
        <main> {/* flex-1 pt-15 */}

            {/* // Hero 섹션 */}
            <section> {/* relative text-center px-30 py-30 overflow-hidden */}
                <div></div> {/* absolute inset-0 max-w-5xl lg:mx-auto mx-8 my-12 rounded-4xl border-3 border-dashed border-white */}
                <div> {/* relative z-10 space-y-6 text-white */}
                <h2>For Readable HTML</h2> {/* text-4xl md:text-6xl font-extrabold */}
                <div> {/* bg-slate-800 max-w-xl mx-auto rounded-lg p-8 flex flex-col gap-4*/}
                    <p><code className="language-jsx" dangerouslySetInnerHTML={{ __html: code1 }} /></p>
                    <p>VS</p>
                    <p><code className="language-jsx" dangerouslySetInnerHTML={{ __html: code2 }} /></p>
                </div>
                <p> {/* text-lg max-w-2xl mx-auto text-justify */}
                    A lightweight package that transforms comments into CSS classes and inline styles. Build cleaner styles without extra config — just add comments and OliveCSS transforms them into real CSS classes and styles.
                </p>
                <div> {/* flex justify-center space-x-4 */}
                    <a href="#">npm i -D olivecss</a> {/* bg-white text-green-600 font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-100 transition */}
                </div>
                </div>
            </section>

            {/* //   */}
            <div> {/* max-w-5xl mx-auto space-y-3 bg-gray-100 p-3 mb-12 rounded-xl */}
                {/* // OliveCSS 예제 섹션  */}
                <section>
                    <div> {/* bg-gray-900 text-gray-100 rounded-t-2xl shadow overflow-hidden */}
                        <div>Example.jsx</div> {/* bg-gray-800 px-4 py-2 text-sm text-green-400 font-mono */}
                        <pre> {/* p-6 overflow-x-auto text-sm leading-relaxed */}
                            <code className="language-jsx" dangerouslySetInnerHTML={{ __html: code3 }} /> {/* font-mono */}
                        </pre>
                    </div>

                    {/* // 미리보기 영역  */}
                    <div> {/* flex justify-center */}
                        <div> {/* bg-white rounded-b-2xl shadow-lg py-8 px-6 text-center w-full */}
                            <h1>Hello OliveCSS!</h1> {/* text-5xl font-bold text-green-600 */}
                            <div> {/* mt-8 border-2 border-dashed border-gray-400 rounded-lg p-4 relative group cursor-pointer */}
                                <span>How it works</span> {/* text-md block group-hover:opacity-0 transition-opacity duration-300 */}
                                <span>At build time, OliveCSS parses your code and automatically converts detected CSS comments into class and styles.</span> {/* absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2 text-lg text-gray-700 */}
                            </div>
                        </div>
                    </div>
                </section>

                {/* // 2컬럼: 특징  */}
                <section> {/* grid grid-cols-1 md:grid-cols-2 gap-3 */}
                    <div> {/* bg-white rounded-2xl shadow p-6 hover:shadow-lg hover:-translate-y-1 transition */}
                        <h3>Comment-based Syntax</h3> {/* text-xl font-semibold mb-2 */}
                        <p>OliveCSS lets you write CSS utilities directly in comments inside your HTML, JSX, or Svelte files. Simple and intuitive — no need for heavy configuration.</p> {/* text-gray-600 mb-4 */}
                        <a href="https://github.com/rebolation/olivecss">GitHub →</a> {/* text-green-600 font-medium hover:underline */}
                    </div>
                    <div> {/* bg-white rounded-2xl shadow p-6 hover:shadow-lg hover:-translate-y-1 transition */}
                        <h3>Zero Runtime Overhead</h3> {/* text-xl font-semibold mb-2 */}
                        <p>OliveCSS transforms your source code at build time. That means no runtime cost, smaller bundles, and faster rendering.</p> {/* text-gray-600 mb-4 */}
                        <a href="https://github.com/rebolation/olivecss">GitHub →</a> {/* text-green-600 font-medium hover:underline */}
                    </div>
                </section>

                {/* // 3컬럼: 장점  */}
                <section> {/* grid grid-cols-1 md:grid-cols-3 gap-3 */}
                    <div> {/* bg-white rounded-2xl shadow p-6 hover:shadow-lg hover:-translate-y-1 transition */}
                        <h3>Framework Agnostic</h3> {/* text-xl font-semibold mb-2 */}
                        <p>Works with React, Vue, Svelte, SolidJS, and more. Just install and use.</p> {/* text-gray-600 mb-4 */}
                        <a href="https://github.com/rebolation/olivecss">GitHub →</a> {/* text-green-600 font-medium hover:underline */}
                    </div>
                    <div> {/* bg-white rounded-2xl shadow p-6 hover:shadow-lg hover:-translate-y-1 transition */}
                        <h3>Lightweight & Fast</h3> {/* text-xl font-semibold mb-2 */}
                        <p>Tiny package size with blazing fast transformation — optimized for developer productivity.</p> {/* text-gray-600 mb-4 */}
                        <a href="https://github.com/rebolation/olivecss">GitHub →</a> {/* text-green-600 font-medium hover:underline */}
                    </div>
                    <div> {/* bg-white rounded-2xl shadow p-6 hover:shadow-lg hover:-translate-y-1 transition */}
                        <h3>Open Source</h3> {/* text-xl font-semibold mb-2 */}
                        <p>Free, open source, and community-driven. Contribute and shape the future of CSS utilities.</p> {/* text-gray-600 mb-4 */}
                        <a href="https://github.com/rebolation/olivecss">GitHub →</a> {/* text-green-600 font-medium hover:underline */}
                    </div>
                </section>
            </div>
        </main>

        {/* // 푸터  */}
        <footer>
            <div> {/* bg-gradient-to-r from-lime-400 via-emerald-500 to-lime-400 text-white */}
                <div> {/* max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 */}
                    <div>
                        <h4>Source</h4> {/* text-lg font-semibold mb-3 */}
                        <ul> {/* space-y-2 text-sm */}
                            <li>
                                <a href="https://github.com/rebolation/olivecss">GitHub</a> {/* hover:underline */}
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4>Connect</h4> {/* text-lg font-semibold mb-3 */}
                        <ul> {/* space-y-2 text-sm */}
                            <li>
                                <a href="mailto:rebolation@naver.com">Email</a> {/* hover:underline */}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div>© 2025 Mun Jaehyeon. All rights reserved.</div> {/* bg-gray-900 text-gray-400 text-center py-4 text-sm */}
        </footer>

    </div>
  )
}

export default App
