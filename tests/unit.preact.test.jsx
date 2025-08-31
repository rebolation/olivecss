import { render, screen } from '@testing-library/preact';

describe('Preact Components', () => {

  describe('BasicTransformation', () => {
    let BasicTransformation = () => {
      return (
        <div>
          <h1>Hello OliveCSS!</h1> {/* background: olive; */} {/* text-white */}
        </div>
      );
    }
    it('renders with className and style transformations', () => {
      render(<BasicTransformation />);
      const heading = screen.getByText('Hello OliveCSS!');
      expect(heading).toHaveStyle({ background: 'olive' });
      expect(heading).toHaveClass('text-white');
    });
  });

  describe('MergeWithExisting', () => {
    let MergeWithExisting = () => {
      return (
        <div>
          <div className="existing-class">
            {/* btn-primary */}
          </div>
          <div style={{ fontSize: "16px" }}>
            {/* color: red; margin-top: 10px; */}
          </div>
        </div>
      );
    }
    it('merges with existing className', () => {
      render(<MergeWithExisting />);
      const elements = screen.getAllByText('');
      const classNameElement = elements.find(el => el.className.includes('existing-class'));
      expect(classNameElement).toHaveClass('existing-class');
      expect(classNameElement).toHaveClass('btn-primary');
    });

    it('merges with existing style', () => {
      render(<MergeWithExisting />);
      const elements = screen.getAllByText('');
      const styleElement = elements.find(el => el.style.fontSize === '16px');
      expect(styleElement).toHaveStyle({ 
        fontSize: '16px',
        color: 'rgb(255, 0, 0)',
        marginTop: '10px'
      });
    });
  });

  describe('MultipleComments', () => {
    let MultipleComments = () => {
      return (
        <div>
          <div>
            {/* btn-primary */}
            {/* text-center */}
            {/* mt-4 */}
          </div>
          <div>
            {/* color: red; */}
            {/* margin-top: 10px; */}
            {/* padding: 20px; */}
          </div>
        </div>
      );
    }
    it('handles multiple className comments', () => {
      render(<MultipleComments />);
      const elements = screen.getAllByText('');
      const classNameElement = elements.find(el => el.className.includes('btn-primary'));
      expect(classNameElement).toHaveClass('btn-primary');
      expect(classNameElement).toHaveClass('text-center');
      expect(classNameElement).toHaveClass('mt-4');
    });

    it('handles multiple style comments', () => {
      render(<MultipleComments />);
      const elements = screen.getAllByText('');
      const styleElement = elements.find(el => el.style.color === 'red');
      expect(styleElement).toBeDefined();
      expect(styleElement).toHaveStyle({
        color: 'rgb(255, 0, 0)',
        marginTop: '10px',
        padding: '20px'
      });
    });
  });

  describe('ClassNameAndStyle', () => {
    let ClassNameAndStyle = () => {
      return (
        <div>
          {/* btn-primary */}
          {/* color: red; margin-top: 10px; */}
        </div>
      );
    }
    it('applies both className and style simultaneously', () => {
      render(<ClassNameAndStyle />);
      const elements = screen.getAllByText('');
      const element = elements.find(el => el.className.includes('btn-primary'));
      expect(element).toHaveClass('btn-primary');
      expect(element).toHaveStyle({
        color: 'rgb(255, 0, 0)',
        marginTop: '10px'
      });
    });
  });

  describe('FragmentTest', () => {
    let FragmentTest = () => {
      return (
        <>
          <div>
            {/* btn-primary */}
          </div>
          <span>
            {/* text-red */}
          </span>
        </>
      );
    }
    it('handles JSX Fragment with className transformations', () => {
      render(<FragmentTest />);
      const elements = screen.getAllByText('');
      const divElement = elements.find(el => el.className.includes('btn-primary'));
      const spanElement = elements.find(el => el.className.includes('text-red'));
      expect(divElement).toHaveClass('btn-primary');
      expect(spanElement).toHaveClass('text-red');
    });
  });

  describe('NestedStructure', () => {
    let NestedStructure = () => {
      return (
        <div>
          <header>
            {/* header-class */}
          </header>
          <main>
            {/* main-content */}
          </main>
        </div>
      );
    }
    it('handles nested JSX structure with className transformations', () => {
      render(<NestedStructure />);
      const elements = screen.getAllByText('');
      const header = elements.find(el => el.className.includes('header-class'));
      const main = elements.find(el => el.className.includes('main-content'));
      expect(header).toHaveClass('header-class');
      expect(main).toHaveClass('main-content');
    });
  });

  describe('ComplexStyles', () => {
    let ComplexStyles = () => {
      return (
        <div>
          {/* background-color: #f0f0f0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); */}
        </div>
      );
    }
    it('handles complex style properties', () => {
      render(<ComplexStyles />);
      const elements = screen.getAllByText('');
      const element = elements.find(el => el.style.backgroundColor === 'rgb(240, 240, 240)');
      expect(element).toHaveStyle({
        backgroundColor: 'rgb(240, 240, 240)',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      });
    });
  });

  describe('ConditionalRendering', () => {
    let ConditionalRendering = ({ isVisible, isActive, isError }) => {
      return (
        <div>
          {isVisible && (
            <div>
              {/* visible-content */}
            </div>
          )}
          {isActive ? (
            <div>
              {/* active-state */}
            </div>
          ) : (
            <div>
              {/* inactive-state */}
            </div>
          )}
          {isError && (
            <div>
              {/* color: red; background-color: #fee; */}
            </div>
          )}
        </div>
      );
    }
    it('renders conditional content with className when isVisible is true', () => {
      render(<ConditionalRendering isVisible={true} isActive={false} isError={false} />);
      const elements = screen.getAllByText('');
      const visibleElement = elements.find(el => el.className.includes('visible-content'));
      expect(visibleElement).toHaveClass('visible-content');
    });

    it('renders active state with className when isActive is true', () => {
      render(<ConditionalRendering isVisible={false} isActive={true} isError={false} />);
      const elements = screen.getAllByText('');
      const activeElement = elements.find(el => el.className.includes('active-state'));
      expect(activeElement).toHaveClass('active-state');
    });

    it('renders inactive state with className when isActive is false', () => {
      render(<ConditionalRendering isVisible={false} isActive={false} isError={false} />);
      const elements = screen.getAllByText('');
      const inactiveElement = elements.find(el => el.className.includes('inactive-state'));
      expect(inactiveElement).toHaveClass('inactive-state');
    });

    it('renders error state with style when isError is true', () => {
      render(<ConditionalRendering isVisible={false} isActive={false} isError={true} />);
      const elements = screen.getAllByText('');
      const errorElement = elements.find(el => el.style.color === 'red');
      expect(errorElement).toBeDefined();
      expect(errorElement).toHaveStyle({
        color: 'rgb(255, 0, 0)',
        backgroundColor: 'rgb(255, 238, 238)'
      });
    });
  });

  describe('ArrayRendering', () => {
    let ArrayRendering = ({ items, colors, users }) => {
      return (
        <div>
          {items?.map((item, index) => (
            <div key={index}>
              {/* list-item */}
            </div>
          ))}
          {colors?.map((color, index) => (
            <div key={index}>
              {/* background-color: red; */}
            </div>
          ))}
          {users?.map(({ id, name, role }) => (
            <div key={id}>
              {/* user-card */}
            </div>
          ))}
        </div>
      );
    }
    const mockItems = [{ id: 1 }, { id: 2 }];
    const mockColors = ['red', 'blue'];
    const mockUsers = [
      { id: 1, name: 'John', role: 'admin' },
      { id: 2, name: 'Jane', role: 'user' }
    ];

    it('renders list items with className', () => {
      render(<ArrayRendering items={mockItems} colors={[]} users={[]} />);
      const elements = screen.getAllByText('');
      const listElements = elements.filter(el => el.className.includes('list-item'));
      expect(listElements).toHaveLength(2);
      listElements.forEach(element => {
        expect(element).toHaveClass('list-item');
      });
    });

    it('renders colored elements with style', () => {
      render(<ArrayRendering items={[]} colors={mockColors} users={[]} />);
      const elements = screen.getAllByText('');
      const coloredElements = elements.filter(el => el.style.backgroundColor === 'red');

      expect(coloredElements).toHaveLength(2);
      coloredElements.forEach(element => {
        expect(element).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' });
      });
    });

    it('renders user cards with className', () => {
      render(<ArrayRendering items={[]} colors={[]} users={mockUsers} />);
      const elements = screen.getAllByText('');
      const userElements = elements.filter(el => el.className.includes('user-card'));
      expect(userElements).toHaveLength(2);
      userElements.forEach(element => {
        expect(element).toHaveClass('user-card');
      });
    });
  });

  describe('FilterAndMap', () => {
    let FilterAndMap = ({ items }) => {
      return (
        <div>
          {items
            ?.filter(item => item.active)
            .map((item, index) => (
              <div key={index}>
                {/* active-item */}
              </div>
            ))}
        </div>
      );
    }
    const mockItems = [
      { id: 1, active: true },
      { id: 2, active: false },
      { id: 3, active: true }
    ];

    it('renders only active items with className', () => {
      render(<FilterAndMap items={mockItems} />);
      const elements = screen.getAllByText('');
      const activeElements = elements.filter(el => el.className.includes('active-item'));
      expect(activeElements).toHaveLength(2); // Only 2 items with active: true
      activeElements.forEach(element => {
        expect(element).toHaveClass('active-item');
      });
    });
  });

  describe('NestedConditional', () => {
    let NestedConditional = ({ isLoggedIn, isAdmin }) => {
      return (
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
    }
    it('renders admin panel when logged in and is admin', () => {
      render(<NestedConditional isLoggedIn={true} isAdmin={true} />);
      const elements = screen.getAllByText('');
      const adminElement = elements.find(el => el.className.includes('admin-panel'));
      expect(adminElement).toHaveClass('admin-panel');
    });

    it('renders user panel when logged in but not admin', () => {
      render(<NestedConditional isLoggedIn={true} isAdmin={false} />);
      const elements = screen.getAllByText('');
      const userElement = elements.find(el => el.className.includes('user-panel'));
      expect(userElement).toHaveClass('user-panel');
    });

    it('renders login form when not logged in', () => {
      render(<NestedConditional isLoggedIn={false} isAdmin={false} />);
      const elements = screen.getAllByText('');
      const loginElement = elements.find(el => el.className.includes('login-form'));
      expect(loginElement).toHaveClass('login-form');
    });
  });

  describe('ConditionalWithExistingStyle', () => {
    let ConditionalWithExistingStyle = ({ isHighlighted }) => {
      return (
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
    }
    it('renders highlighted text with className when isHighlighted is true', () => {
      render(<ConditionalWithExistingStyle isHighlighted={true} />);
      const elements = screen.getAllByText('');
      const highlightedElement = elements.find(el => el.className.includes('highlighted-text'));
      expect(highlightedElement).toHaveClass('highlighted-text');
    });

    it('renders normal text with className when isHighlighted is false', () => {
      render(<ConditionalWithExistingStyle isHighlighted={false} />);
      const elements = screen.getAllByText('');
      const normalElement = elements.find(el => el.className.includes('normal-text'));
      expect(normalElement).toHaveClass('normal-text');
    });

    it('maintains existing style on parent element', () => {
      render(<ConditionalWithExistingStyle isHighlighted={true} />);
      const elements = screen.getAllByText('');
      const highlightedElement = elements.find(el => el.className.includes('highlighted-text'));
      const parentElement = highlightedElement.parentElement;
      expect(parentElement).toHaveStyle({ fontSize: '16px' });
    });
  });

  describe('ConditionalWithMultipleComments', () => {
    let ConditionalWithMultipleComments = ({ showDetails }) => {
      return (
        <div>
          {showDetails && (
            <div>
              {/* detail-container */}
              {/* padding: 20px; margin-top: 10px; */}
            </div>
          )}
        </div>
      );
    }
    it('renders detail container with className and style when showDetails is true', () => {
      render(<ConditionalWithMultipleComments showDetails={true} />);
      const elements = screen.getAllByText('');
      const detailElement = elements.find(el => el.className.includes('detail-container'));
      expect(detailElement).toHaveClass('detail-container');
      expect(detailElement).toHaveStyle({
        padding: '20px',
        marginTop: '10px'
      });
    });

    it('does not render detail container when showDetails is false', () => {
      render(<ConditionalWithMultipleComments showDetails={false} />);
      const elements = screen.getAllByText('');
      const detailElement = elements.find(el => el.className.includes('detail-container'));
      expect(detailElement).toBeUndefined();
    });
  });

});
