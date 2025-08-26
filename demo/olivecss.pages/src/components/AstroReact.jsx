import React from 'react';

function OliveReact({ name, theme, features }) {
  const featureIcon = '👉';
  
  return (
    <div> {/* text-center flex items-center justify-center */}
      <div>
        <header> {/* bg-white p-8 min-w-lg rounded-3xl shadow-2xl */}
          <p className={theme}>{name}</p>  {/* text-white text-4xl font-bold py-2 rounded-lg leading-snug */}
          <div> {/* my-8 */}
            <h2>Key Features:</h2> {/* text-2xl font-bold text-slate-700 mb-6 */}
            <ul> {/* text-left px-8 */} {/* bg-gray-100 px-4 py-2 mb-5 rounded-lg */}
              {features.map((feature, index) => (
                <li key={index}> {/* text-lg py-1  max-w-[270px] mx-auto */}
                  <span>{featureIcon}</span>{/* mr-2 */}{feature}
                </li>
              ))}
            </ul>
          </div>
          <h2>Example:</h2> {/* text-2xl font-bold text-slate-700 mb-6 */}
          <div> {/* bg-gray-100 px-4 py-2 mb-5 rounded-lg */}
            <p className={theme}>{`{/* color:white; */}`}</p> {/* color:white; */}
            <p>style="color:white;"</p> {/* mb-5 */}
            <p className={theme}>{`{/* text-white */}`}</p> {/* text-white*/}
            <p>className="text-white"</p> {/* mb-5 rounded-sm */}
            <p className={theme}>{`{/* // double-slash for a comment */}`}</p> {/* text-white */}
            <p>{`{/* double-slash for a comment */}`}</p> {/* // double-slash for a comment */}
          </div>
        </header>
      </div>
    </div>
  );
}

export default OliveReact;
