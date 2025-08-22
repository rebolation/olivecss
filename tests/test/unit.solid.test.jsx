import { render, screen } from '@solidjs/testing-library';
import { createSignal, createEffect } from 'solid-js';

describe('SolidJS Components', () => {

  describe('BasicTransformation', () => {
    const BasicTransformation = () => {
      return (
        <div>
          <h1 data-testid="basic-heading">Hello OliveCSS!</h1> {/* background: olive; */} {/* text-white */}
        </div>
      );
    }
    it('renders with class and style transformations', () => {
      render(() => <BasicTransformation />);
      const heading = screen.getByTestId('basic-heading');
      expect(heading).toHaveStyle({ 'background': 'olive' });
      expect(heading).toHaveClass('text-white');
    });
  });

  describe('MergeWithExisting', () => {
    const MergeWithExisting = () => {
      return (
        <div>
          <div data-testid="merge-class-element" class="existing-class">
            {/* btn-primary */}
          </div>
          <div data-testid="merge-style-element" style={{ "font-size": "16px" }}>
            {/* margin-top: 10px; */}
          </div>
        </div>
      );
    }
    it('merges with existing class', () => {
      render(() => <MergeWithExisting />);
      const classElement = screen.getByTestId('merge-class-element');
      expect(classElement).toHaveClass('existing-class');
      expect(classElement).toHaveClass('btn-primary');
    });

    it('merges with existing style', () => {
      render(() => <MergeWithExisting />);
      const styleElement = screen.getByTestId('merge-style-element');
      expect(styleElement).toBeDefined();
      expect(styleElement).toHaveStyle({ 'font-size': '16px', 'margin-top': '10px' });
      // expect(styleElement.style.fontSize).toBe('16px');
      // console.log(styleElement.style);
      // console.log(styleElement.style.margin);
      // expect(styleElement.style.marginTop).toBe('10px');
    });
  });

  describe('MultipleComments', () => {
    const MultipleComments = () => {
      return (
        <div>
          <div data-testid="multiple-class-element">
            {/* btn-primary */}
            {/* text-center */}
            {/* mt-4 */}
          </div>
          <div data-testid="multiple-style-element">
            {/* color: red; */}
            {/* margin-top: 10px; */}
            {/* padding: 20px; */}
          </div>
        </div>
      );
    }
    it('handles multiple class comments', () => {
      render(() => <MultipleComments />);
      const classElement = screen.getByTestId('multiple-class-element');
      expect(classElement).toHaveClass('btn-primary');
      expect(classElement).toHaveClass('text-center');
      expect(classElement).toHaveClass('mt-4');
    });

    it('handles multiple style comments', () => {
      render(() => <MultipleComments />);
      const styleElement = screen.getByTestId('multiple-style-element');
      expect(styleElement).toBeDefined();
      expect(styleElement).toHaveStyle({
        'color': 'rgb(255, 0, 0)',
        'margin-top': '10px',
        'padding': '20px'
      });
    });
  });

  describe('ClassAndStyle', () => {
    const ClassAndStyle = () => {
      return (
        <div data-testid="class-style-element">
          {/* btn-primary */}
          {/* color: red; margin-top: 10px; */}
        </div>
      );
    }
    it('applies both class and style simultaneously', () => {
      render(() => <ClassAndStyle />);
      const element = screen.getByTestId('class-style-element');
      expect(element).toHaveClass('btn-primary');
      expect(element).toHaveStyle({
        'color': 'rgb(255, 0, 0)',
        'margin-top': '10px'
      });
    });
  });

  describe('FragmentTest', () => {
    const FragmentTest = () => {
      return (
        <>
          <div data-testid="fragment-div-element">
            {/* btn-primary */}
          </div>
          <span data-testid="fragment-span-element">
            {/* text-red */}
          </span>
        </>
      );
    }
    it('handles JSX Fragment with class transformations', () => {
      render(() => <FragmentTest />);
      const divElement = screen.getByTestId('fragment-div-element');
      const spanElement = screen.getByTestId('fragment-span-element');
      expect(divElement).toHaveClass('btn-primary');
      expect(spanElement).toHaveClass('text-red');
    });
  });

  describe('NestedStructure', () => {
    const NestedStructure = () => {
      return (
        <div>
          <header data-testid="nested-header-element">
            {/* header-class */}
          </header>
          <main data-testid="nested-main-element">
            {/* main-content */}
          </main>
        </div>
      );
    }
    it('handles nested JSX structure with class transformations', () => {
      render(() => <NestedStructure />);
      const header = screen.getByTestId('nested-header-element');
      const main = screen.getByTestId('nested-main-element');
      expect(header).toHaveClass('header-class');
      expect(main).toHaveClass('main-content');
    });
  });

  describe('ComplexStyles', () => {
    const ComplexStyles = () => {
      return (
        <div data-testid="complex-styles-element">
          {/* background-color: #f0f0f0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); */}
        </div>
      );
    }
    it('handles complex style properties', () => {
      render(() => <ComplexStyles />);
      const element = screen.getByTestId('complex-styles-element');
      expect(element).toBeDefined();
      expect(element).toHaveStyle({
        'background-color': 'rgb(240, 240, 240)',
        'border-radius': '8px',
        'box-shadow': '0 2px 4px rgba(0,0,0,0.1)'
      });
    });
  });

  describe('ConditionalRendering', () => {
    const ConditionalRendering = (props) => {
      const { isVisible, isActive, isError } = props;
      return (
        <div>
          {isVisible && (
            <div data-testid="conditional-visible-element">
              {/* visible-content */}
            </div>
          )}
          {isActive ? (
            <div data-testid="conditional-active-element">
              {/* active-state */}
            </div>
          ) : (
            <div data-testid="conditional-inactive-element">
              {/* inactive-state */}
            </div>
          )}
          {isError && (
            <div data-testid="conditional-error-element">
              {/* color: red; background-color: #fee; */}
            </div>
          )}
        </div>
      );
    }
    it('renders conditional content with class when isVisible is true', () => {
      render(() => <ConditionalRendering isVisible={true} isActive={false} isError={false} />);
      const visibleElement = screen.getByTestId('conditional-visible-element');
      expect(visibleElement).toHaveClass('visible-content');
    });

    it('renders active state with class when isActive is true', () => {
      render(() => <ConditionalRendering isVisible={false} isActive={true} isError={false} />);
      const activeElement = screen.getByTestId('conditional-active-element');
      expect(activeElement).toHaveClass('active-state');
    });

    it('renders inactive state with class when isActive is false', () => {
      render(() => <ConditionalRendering isVisible={false} isActive={false} isError={false} />);
      const inactiveElement = screen.getByTestId('conditional-inactive-element');
      expect(inactiveElement).toHaveClass('inactive-state');
    });

    it('renders error state with style when isError is true', () => {
      render(() => <ConditionalRendering isVisible={false} isActive={false} isError={true} />);
      const errorElement = screen.getByTestId('conditional-error-element');
      expect(errorElement).toBeDefined();
      expect(errorElement).toHaveStyle({
        'color': 'rgb(255, 0, 0)',
        'background-color': 'rgb(255, 238, 238)'
      });
    });
  });

  describe('ArrayRendering', () => {
    const ArrayRendering = (props) => {
      const { items, colors, users } = props;
      return (
        <div>
          {items?.map((item, index) => (
            <div key={index} data-testid={`array-item-${index}`}>
              {/* list-item */}
            </div>
          ))}
          {colors?.map((color, index) => (
            <div key={index} data-testid={`array-color-${index}`}>
              {/* background-color: red; */}
            </div>
          ))}
          {users?.map(({ id, name, role }) => (
            <div key={id} data-testid={`array-user-${id}`}>
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

    it('renders list items with class', () => {
      render(() => <ArrayRendering items={mockItems} colors={[]} users={[]} />);
      const listElement1 = screen.getByTestId('array-item-0');
      const listElement2 = screen.getByTestId('array-item-1');
      expect(listElement1).toHaveClass('list-item');
      expect(listElement2).toHaveClass('list-item');
    });

    it('renders colored elements with style', () => {
      render(() => <ArrayRendering items={[]} colors={mockColors} users={[]} />);
      const coloredElement1 = screen.getByTestId('array-color-0');
      const coloredElement2 = screen.getByTestId('array-color-1');
      expect(coloredElement1).toHaveStyle({ 'background-color': 'rgb(255, 0, 0)' });
      expect(coloredElement2).toHaveStyle({ 'background-color': 'rgb(255, 0, 0)' });
    });

    it('renders user cards with class', () => {
      render(() => <ArrayRendering items={[]} colors={[]} users={mockUsers} />);
      const userElement1 = screen.getByTestId('array-user-1');
      const userElement2 = screen.getByTestId('array-user-2');
      expect(userElement1).toHaveClass('user-card');
      expect(userElement2).toHaveClass('user-card');
    });
  });

  describe('FilterAndMap', () => {
    const FilterAndMap = (props) => {
      const { items } = props;
      return (
        <div>
          {items
            ?.filter(item => item.active)
            .map((item, index) => (
              <div key={index} data-testid={`filter-item-${index}`}>
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

    it('renders only active items with class', () => {
      render(() => <FilterAndMap items={mockItems} />);
      const activeElement1 = screen.getByTestId('filter-item-0');
      const activeElement2 = screen.getByTestId('filter-item-1');
      expect(activeElement1).toHaveClass('active-item');
      expect(activeElement2).toHaveClass('active-item');
    });
  });

  describe('NestedConditional', () => {
    const NestedConditional = (props) => {
      const { isLoggedIn, isAdmin } = props;
      return (
        <div>
          {isLoggedIn ? (
            <div>
              {isAdmin ? (
                <div data-testid="nested-admin-element">
                  {/* admin-panel */}
                </div>
              ) : (
                <div data-testid="nested-user-element">
                  {/* user-panel */}
                </div>
              )}
            </div>
          ) : (
            <div data-testid="nested-login-element">
              {/* login-form */}
            </div>
          )}
        </div>
      );
    }
    it('renders admin panel when logged in and is admin', () => {
      render(() => <NestedConditional isLoggedIn={true} isAdmin={true} />);
      const adminElement = screen.getByTestId('nested-admin-element');
      expect(adminElement).toHaveClass('admin-panel');
    });

    it('renders user panel when logged in but not admin', () => {
      render(() => <NestedConditional isLoggedIn={true} isAdmin={false} />);
      const userElement = screen.getByTestId('nested-user-element');
      expect(userElement).toHaveClass('user-panel');
    });

    it('renders login form when not logged in', () => {
      render(() => <NestedConditional isLoggedIn={false} isAdmin={false} />);
      const loginElement = screen.getByTestId('nested-login-element');
      expect(loginElement).toHaveClass('login-form');
    });
  });

  describe('ConditionalWithExistingStyle', () => {
    const ConditionalWithExistingStyle = (props) => {
      const { isHighlighted } = props;
      return (
        <div data-testid="conditional-parent-element" style={{ 'font-size': "16px" }}>
          {isHighlighted ? (
            <div data-testid="conditional-highlighted-element">
              {/* highlighted-text */}
            </div>
          ) : (
            <div data-testid="conditional-normal-element">
              {/* normal-text */}
            </div>
          )}
        </div>
      );
    }
    it('renders highlighted text with class when isHighlighted is true', () => {
      render(() => <ConditionalWithExistingStyle isHighlighted={true} />);
      const highlightedElement = screen.getByTestId('conditional-highlighted-element');
      expect(highlightedElement).toHaveClass('highlighted-text');
    });

    it('renders normal text with class when isHighlighted is false', () => {
      render(() => <ConditionalWithExistingStyle isHighlighted={false} />);
      const normalElement = screen.getByTestId('conditional-normal-element');
      expect(normalElement).toHaveClass('normal-text');
    });

    it('maintains existing style on parent element', () => {
      render(() => <ConditionalWithExistingStyle isHighlighted={true} />);
      const parentElement = screen.getByTestId('conditional-parent-element');
      expect(parentElement).toHaveStyle({ 'font-size': '16px' });
    });
  });

  describe('ConditionalWithMultipleComments', () => {
    const ConditionalWithMultipleComments = (props) => {
      const { showDetails } = props;
      return (
        <div>
          {showDetails && (
            <div data-testid="conditional-detail-element">
              {/* detail-container */}
              {/* padding: 20px; margin-top: 10px; */}
            </div>
          )}
        </div>
      );
    }
    it('renders detail container with class and style when showDetails is true', () => {
      render(() => <ConditionalWithMultipleComments showDetails={true} />);
      const detailElement = screen.getByTestId('conditional-detail-element');
      expect(detailElement).toHaveClass('detail-container');
      expect(detailElement).toHaveStyle({
        'padding': '20px',
        'margin-top': '10px'
      });
    });

    it('does not render detail container when showDetails is false', () => {
      render(() => <ConditionalWithMultipleComments showDetails={false} />);
      const detailElement = screen.queryByTestId('conditional-detail-element');
      expect(detailElement).toBeNull();
    });
  });

  describe('SolidJS Specific Features', () => {
    describe('SignalBasedRendering', () => {
      const SignalBasedRendering = () => {
        const [count, setCount] = createSignal(0);
        const [isVisible, setIsVisible] = createSignal(true);
        
        return (
          <div>
            <div data-testid="signal-counter-element">
              {/* counter-display */}
            </div>
            {isVisible() && (
              <div data-testid="signal-visible-element">
                {/* visible-content */}
              </div>
            )}
          </div>
        );
      }
      
      it('renders with signal-based conditional content', () => {
        render(() => <SignalBasedRendering />);
        const visibleElement = screen.getByTestId('signal-visible-element');
        expect(visibleElement).toHaveClass('visible-content');
      });
    });

    describe('EffectBasedTransformation', () => {
      const EffectBasedTransformation = () => {
        const [theme, setTheme] = createSignal('light');
        
        createEffect(() => {
          // 테마에 따른 스타일 적용
        });
        
        return (
          <div data-testid="effect-theme-element">
            {/* theme-container */}
            {/* background-color: white; */}
          </div>
        );
      }
      
      it('renders with effect-based transformations', () => {
        render(() => <EffectBasedTransformation />);
        const themeElement = screen.getByTestId('effect-theme-element');
        expect(themeElement).toHaveClass('theme-container');
        expect(themeElement).toHaveStyle({ 'background-color': 'rgb(255, 255, 255)' });
      });
    });

    describe('MemoizedComponents', () => {
      const MemoizedComponent = () => {
        return (
                  <div data-testid="memoized-element">
          {/* memoized-content */}
          {/* border: 1px solid #ccc; */}
        </div>
        );
      }
      
      it('renders memoized component with transformations', () => {
        render(() => <MemoizedComponent />);
        const memoizedElement = screen.getByTestId('memoized-element');
        expect(memoizedElement).toHaveClass('memoized-content');
        expect(memoizedElement).toHaveStyle({ 'border': '1px solid rgb(204, 204, 204)' });
      });
    });
  });

});
