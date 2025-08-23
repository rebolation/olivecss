function App() {
  const text = {
    title: 'SolidJS + 🫒 OliveCSS 🫒',
    subtitle: '{/* background: olive; */}',
    features: [
      'comment → INLINE-STYLE',
      'comment → CLASS',
      'comment → COMMENT',
    ],
    featureIcon: '👉',
  };
  
  const { title, subtitle, features, featureIcon } = text;

  return (
    <div> {/* text-center flex items-center justify-center min-h-screen p-8 */}
      <div>
        <header> {/* bg-white p-12 min-w-lg rounded-3xl shadow-2xl */}
          <h1>{title}</h1> {/* text-xl text-lime-700 font-bold p-3 */}
          <p>{subtitle}</p> {/* text-white text-3xl font-bold py-2 rounded-lg leading-snug */} {/* background: olive; */}
          <div> {/* text-lime-700 my-8 */}
            <h2>Key Features:</h2> {/* text-2xl font-bold text-slate-700 mb-6 */}
            <ul> {/* text-left px-8 */} {/* bg-gray-100 px-4 py-2 mb-5 rounded-lg */}
              {features.map((feature, index) => (
                <li key={index}> {/* text-lg py-1 max-w-[260px] mx-auto */}
                  <span>{featureIcon}</span>{/* mr-2 */}{feature}
                </li>
              ))}
            </ul>
          </div>
          <h2>Example:</h2> {/* text-2xl font-bold text-slate-700 mb-6 */}
          <div> {/* bg-gray-100 px-4 py-2 mb-5 rounded-lg */}
            <p>{`{/* background-color: olive; color:white; */}`}</p> {/* background-color: olive; color:white; */} {/* rounded-sm */}
            <p>style="background-color: olive; color:white;"</p> {/* mb-5 */}
            <p>{`{/* bg-lime-700 text-white */}`}</p> {/* bg-lime-700 text-white*/}
            <p>className="bg-lime-700 text-white"</p> {/* mb-5 rounded-sm */}
            <p>{`{/* // double-slash for a comment */}`}</p> {/* bg-lime-900 text-white */}
            <p>{`{/* double-slash for a comment */}`}</p> {/* // double-slash for a comment */}
          </div>
        </header>
      </div>
      <div> {/* fixed top-4 left-4 */}
        <a aria-label="GitHub repository" href="https://github.com/rebolation/olivecss">
          <svg viewBox="0 0 20 20"> {/* size-6 fill-gray-800 */} 
            <path d="M10 0C4.475 0 0 4.475 0 10a9.994 9.994 0 006.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.287-.6-1.175-1.025-1.412-.35-.188-.85-.65-.013-.663.788-.013 1.35.725 1.538 1.025.9 1.512 2.337 1.087 2.912.825.088-.65.35-1.088.638-1.338-2.225-.25-4.55-1.112-4.55-4.937 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.274.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 012.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0020 10c0-5.525-4.475-10-10-10z"></path>
          </svg>
        </a>
      </div> 
    </div>
  )
}

export default App
