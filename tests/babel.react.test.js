// const pluginTester = require("babel-plugin-tester");
import olivecss from "../src/olive-jsx.js";
import pluginTesterModule from "babel-plugin-tester/pure";
const pluginTester = pluginTesterModule.pluginTester;

pluginTester({
  plugin: olivecss,
  pluginName: "olivecss-plugin-jsx",
  babelOptions: {
    presets: ["@babel/preset-react"],
  },
  tests: [
    {
      title: "className transformation",
      code: `
        const App = () => (
          <div>
            {/* btn-primary */}
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", {
          className: "btn-primary"
        });
      `,
    },
    {
      title: "style transformation",
      code: `
        const App = () => (
          <div>
            {/* color: red; margin-top: 10px; */}
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", {
          style: {
            color: "red",
            marginTop: "10px"
          }
        });
      `,
    },
    {
      title: "merge with existing className",
      code: `
        const App = () => (
          <div className="existing-class">
            {/* btn-primary */}
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", {
          className: "existing-class btn-primary"
        });
      `,
    },
    {
      title: "merge with existing style",
      code: `
        const App = () => (
          <div style={{ fontSize: "16px" }}>
            {/* color: red; margin-top: 10px; */}
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: "16px",
            color: "red",
            marginTop: "10px"
          }
        });
      `,
    },
    {
      title: "multiple className comments",
      code: `
        const App = () => (
          <div>
            {/* btn-primary */}
            {/* text-center */}
            {/* mt-4 */}
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", {
          className: "btn-primary text-center mt-4"
        });
      `,
    },
    {
      title: "multiple style comments",
      code: `
        const App = () => (
          <div>
            {/* color: red; */}
            {/* margin-top: 10px; */}
            {/* padding: 20px; */}
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", {
          style: {
            color: "red",
            marginTop: "10px",
            padding: "20px"
          }
        });
      `,
    },
    {
      title: "className and style simultaneous processing",
      code: `
        const App = () => (
          <div>
            {/* btn-primary */}
            {/* color: red; margin-top: 10px; */}
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", {
          className: "btn-primary",
          style: {
            color: "red",
            marginTop: "10px"
          }
        });
      `,
    },
    {
      title: "JSX Fragment internal processing",
      code: `
        const App = () => (
          <>
            <div>
              {/* btn-primary */}
            </div>
            <span>
              {/* text-red */}
            </span>
          </>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
          className: "btn-primary"
        }), /*#__PURE__*/React.createElement("span", {
          className: "text-red"
        }));
      `,
    },
    {
      title: "nested JSX structure",
      code: `
        const App = () => (
          <div>
            <header>
              {/* header-class */}
            </header>
            <main>
              {/* main-content */}
            </main>
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("header", {
          className: "header-class"
        }), /*#__PURE__*/React.createElement("main", {
          className: "main-content"
        }));
      `,
    },
    {
      title: "complex style properties",
      code: `
        const App = () => (
          <div>
            {/* background-color: #f0f0f0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); */}
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", {
          style: {
            backgroundColor: "#f0f0f0",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }
        });
      `,
    },
    {
      title: "merge with existing className expression",
      code: `
        const App = () => (
          <div className={isActive ? 'active' : 'inactive'}>
            {/* btn-primary */}
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", {
          className: (isActive ? 'active' : 'inactive') + " " + "btn-primary"
        });
      `,
    },
    {
      title: "ignore empty comments",
      code: `
        const App = () => (
          <div>
            {/* */}
            {/* btn-primary */}
            {/*   */}
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", {
          className: "btn-primary"
        });
      `,
    },
    {
      title: "no transformation when no comments",
      code: `
        const App = () => (
          <div>
            <span>Hello World</span>
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Hello World"));
      `,
    },
    {
      title: "conditional rendering with className",
      code: `
        const App = () => (
          <div>
            {isVisible && (
              <div>
                {/* visible-content */}
              </div>
            )}
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", null, isVisible && /*#__PURE__*/React.createElement("div", {
          className: "visible-content"
        }));
      `,
    },
    {
      title: "conditional rendering with style",
      code: `
        const App = () => (
          <div>
            {isError && (
              <div>
                {/* color: red; background-color: #fee; */}
              </div>
            )}
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", null, isError && /*#__PURE__*/React.createElement("div", {
          style: {
            color: "red",
            backgroundColor: "#fee"
          }
        }));
      `,
    },
    {
      title: "ternary operator with className",
      code: `
        const App = () => (
          <div>
            {isActive ? (
              <div>
                {/* active-state */}
              </div>
            ) : (
              <div>
                {/* inactive-state */}
              </div>
            )}
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", null, isActive ? /*#__PURE__*/React.createElement("div", {
          className: "active-state"
        }) : /*#__PURE__*/React.createElement("div", {
          className: "inactive-state"
        }));
      `,
    },
    {
      title: "map function with className",
      code: `
        const App = () => (
          <div>
            {items.map((item, index) => (
              <div key={index}>
                {/* list-item */}
              </div>
            ))}
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", null, items.map((item, index) => /*#__PURE__*/React.createElement("div", {
          key: index,
          className: "list-item"
        })));
      `,
    },
    {
      title: "map function with style",
      code: `
        const App = () => (
          <div>
            {colors.map((color, index) => (
              <div key={index}>
                {/* background-color: red; */}
              </div>
            ))}
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", null, colors.map((color, index) => /*#__PURE__*/React.createElement("div", {
          key: index,
          style: {
            backgroundColor: "red"
          }
        })));
      `,
    },
    {
      title: "filter and map combination",
      code: `
        const App = () => (
          <div>
            {items
              .filter(item => item.active)
              .map((item, index) => (
                <div key={index}>
                  {/* active-item */}
                </div>
              ))}
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", null, items.filter(item => item.active).map((item, index) => /*#__PURE__*/React.createElement("div", {
          key: index,
          className: "active-item"
        })));
      `,
    },
    {
      title: "nested conditional rendering",
      code: `
        const App = () => (
          <div>
            {isLoggedIn ? (
              <div>
                {isAdmin ? (
                  <div>
                    {/* admin-panel */}
                  </div>
                ) : (
                  <div>
                    {/* user-panel */}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {/* login-form */}
              </div>
            )}
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", null, isLoggedIn ? /*#__PURE__*/React.createElement("div", null, isAdmin ? /*#__PURE__*/React.createElement("div", {
          className: "admin-panel"
        }) : /*#__PURE__*/React.createElement("div", {
          className: "user-panel"
        })) : /*#__PURE__*/React.createElement("div", {
          className: "login-form"
        }));
      `,
    },
    {
      title: "conditional className with existing style",
      code: `
        const App = () => (
          <div style={{ fontSize: "16px" }}>
            {isHighlighted ? (
              <div>
                {/* highlighted-text */}
              </div>
            ) : (
              <div>
                {/* normal-text */}
              </div>
            )}
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: "16px"
          }
        }, isHighlighted ? /*#__PURE__*/React.createElement("div", {
          className: "highlighted-text"
        }) : /*#__PURE__*/React.createElement("div", {
          className: "normal-text"
        }));
      `,
    },
    {
      title: "array destructuring in map",
      code: `
        const App = () => (
          <div>
            {users.map(({ id, name, role }) => (
              <div key={id}>
                {/* user-card */}
              </div>
            ))}
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", null, users.map(({
          id,
          name,
          role
        }) => /*#__PURE__*/React.createElement("div", {
          key: id,
          className: "user-card"
        })));
      `,
    },
    {
      title: "conditional rendering with multiple comments",
      code: `
        const App = () => (
          <div>
            {showDetails && (
              <div>
                {/* detail-container */}
                {/* padding: 20px; margin-top: 10px; */}
              </div>
            )}
          </div>
        );
      `,
      output: `
        const App = () => /*#__PURE__*/React.createElement("div", null, showDetails && /*#__PURE__*/React.createElement("div", {
          className: "detail-container",
          style: {
            padding: "20px",
            marginTop: "10px"
          }
        }));
      `,
    },
  ],
});
