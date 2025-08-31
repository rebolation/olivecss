import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test, describe, it, beforeAll } from 'vitest';
import AstroTestComponent from './TestComponent.astro';
import { JSDOM } from 'jsdom';

// 스타일 속성에서 공백을 제거하는 헬퍼 함수
function normalizeStyle(style) {
  if (!style) return '';
  return style.replace(/\s+/g, '');
}

describe('Astro Components', () => {
  let container;

  beforeAll(async () => {
    container = await AstroContainer.create();
  });

  describe('Basic Transformation', () => {
    it('renders basic component with class and style transformations', async () => {
      const result = await container.renderToString(AstroTestComponent, {
        slots: {
          default: 'Card content',
        },
      });

      const dom = new JSDOM(result);
      const document = dom.window.document;

      const el = document.querySelector('#basic_test');
      expect(el.classList.contains('astro')).toBe(true);
      expect(el.classList.contains('relative')).toBe(true);
      expect(el.classList.contains('min-h-screen')).toBe(true);
      expect(el.classList.contains('text-center')).toBe(true);
      expect(el.classList.contains('mx-0')).toBe(true);
      expect(el.classList.contains('px-0')).toBe(true);
      expect(el.classList.contains('flex')).toBe(true);
      expect(el.classList.contains('flex-col')).toBe(true);
      expect(result).toContain("Hello Astro!");
    });
  });

  describe('Class Transformation', () => {
    it('transforms class comments to class attribute', async () => {
      const result = await container.renderToString(AstroTestComponent);
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#transforms_class_comments_to_class_attribute');
      expect(element.classList.contains('btn-primary')).toBe(true);
    });

    it('merges multiple class comments', async () => {
      const result = await container.renderToString(AstroTestComponent);
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#merges_multiple_class_comments');
      expect(element.classList.contains('btn-primary')).toBe(true);
      expect(element.classList.contains('text-center')).toBe(true);
      expect(element.classList.contains('mt-4')).toBe(true);
    });

    it('merges with existing class', async () => {
      const result = await container.renderToString(AstroTestComponent);
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#merges_with_existing_class');
      expect(element.classList.contains('existing-class')).toBe(true);
      expect(element.classList.contains('btn-primary')).toBe(true);
    });
  });

  describe('Style Transformation', () => {
    it('transforms style comments to style attribute', async () => {
      const result = await container.renderToString(AstroTestComponent);
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#transforms_style_comments_to_style_attribute');
      const style = element.getAttribute('style');
      expect(normalizeStyle(style)).toContain('color:red');
      expect(normalizeStyle(style)).toContain('margin-top:10px');
    });

    it('merges multiple style comments', async () => {
      const result = await container.renderToString(AstroTestComponent);
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#merges_multiple_style_comments');
      const style = element.getAttribute('style');
      expect(normalizeStyle(style)).toContain('color:red');
      expect(normalizeStyle(style)).toContain('margin-top:10px');
      expect(normalizeStyle(style)).toContain('padding:20px');
    });

    it('merges with existing style', async () => {
      const result = await container.renderToString(AstroTestComponent);
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#merges_with_existing_style');
      const style = element.getAttribute('style');
      expect(normalizeStyle(style)).toContain('font-size:16px');
      expect(normalizeStyle(style)).toContain('color:red');
      expect(normalizeStyle(style)).toContain('margin-top:10px');
    });

    it('handles complex style properties', async () => {
      const result = await container.renderToString(AstroTestComponent);
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#handles_complex_style_properties');
      const style = element.getAttribute('style');
      expect(normalizeStyle(style)).toContain('background-color:#f0f0f0');
      expect(normalizeStyle(style)).toContain('border-radius:8px');
      expect(normalizeStyle(style)).toContain('box-shadow:02px4pxrgba(0,0,0,0.1)');
    });
  });

  describe('Conditional Rendering', () => {
    it('renders conditional content with class when condition is true', async () => {
      const result = await container.renderToString(AstroTestComponent, {
        props: { isVisible: true }
      });
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#renders_conditional_content_with_class_when_condition_is_true');
      expect(element).toBeDefined();
      expect(element.classList.contains('visible-content')).toBe(true);
    });

    it('does not render conditional content when condition is false', async () => {
      const result = await container.renderToString(AstroTestComponent, {
        props: { isVisible: false }
      });
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#renders_conditional_content_with_class_when_condition_is_true');
      expect(element).toBeNull();
    });

    it('renders conditional content with style when condition is true', async () => {
      const result = await container.renderToString(AstroTestComponent, {
        props: { isError: true }
      });
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#renders_conditional_content_with_style_when_condition_is_true');
      expect(element).toBeDefined();
      const style = element.getAttribute('style');
      expect(normalizeStyle(style)).toContain('color:red');
      expect(normalizeStyle(style)).toContain('background-color:#fee');
    });

    it('does not render conditional content with style when condition is false', async () => {
      const result = await container.renderToString(AstroTestComponent, {
        props: { isError: false }
      });
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#renders_conditional_content_with_style_when_condition_is_true');
      expect(element).toBeNull();
    });

    it('renders active state when isActive is true', async () => {
      const result = await container.renderToString(AstroTestComponent, {
        props: { isActive: true }
      });
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#renders_active_state_when_isActive_is_true');
      expect(element).toBeDefined();
      expect(element.classList.contains('active-state')).toBe(true);
    });

    it('renders inactive state when isActive is false', async () => {
      const result = await container.renderToString(AstroTestComponent, {
        props: { isActive: false }
      });
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#renders_inactive_state_when_isActive_is_false');
      expect(element).toBeDefined();
      expect(element.classList.contains('inactive-state')).toBe(true);
    });
  });

  describe('List Rendering', () => {
    it('renders list items with class', async () => {
      const mockItems = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const result = await container.renderToString(AstroTestComponent, {
        props: { items: mockItems }
      });
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element0 = document.querySelector('#renders_list_items_with_class_0');
      const element1 = document.querySelector('#renders_list_items_with_class_1');
      const element2 = document.querySelector('#renders_list_items_with_class_2');
      
      expect(element0).toBeDefined();
      expect(element1).toBeDefined();
      expect(element2).toBeDefined();
      expect(element0.classList.contains('list-item')).toBe(true);
      expect(element1.classList.contains('list-item')).toBe(true);
      expect(element2.classList.contains('list-item')).toBe(true);
    });

    it('renders list items with style', async () => {
      const mockColors = ['red', 'blue', 'green'];
      const result = await container.renderToString(AstroTestComponent, {
        props: { colors: mockColors }
      });
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element0 = document.querySelector('#renders_list_items_with_style_0');
      const element1 = document.querySelector('#renders_list_items_with_style_1');
      const element2 = document.querySelector('#renders_list_items_with_style_2');
      
      expect(element0).toBeDefined();
      expect(element1).toBeDefined();
      expect(element2).toBeDefined();
      expect(normalizeStyle(element0.getAttribute('style'))).toContain('background-color:red');
      expect(normalizeStyle(element1.getAttribute('style'))).toContain('background-color:red');
      expect(normalizeStyle(element2.getAttribute('style'))).toContain('background-color:red');
    });

    it('renders filtered list items', async () => {
      const mockItems = [
        { id: 1, active: true },
        { id: 2, active: false },
        { id: 3, active: true }
      ];
      const result = await container.renderToString(AstroTestComponent, {
        props: { items: mockItems }
      });
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element0 = document.querySelector('#renders_filtered_list_items_0');
      const element1 = document.querySelector('#renders_filtered_list_items_1');
      const element2 = document.querySelector('#renders_filtered_list_items_2');
      
      expect(element0).toBeDefined();
      expect(element1).toBeDefined();
      expect(element2).toBeNull(); // Should not exist as only 2 items are active
      expect(element0.classList.contains('active-item')).toBe(true);
      expect(element1.classList.contains('active-item')).toBe(true);
    });
  });

  describe('Nested Conditional Rendering', () => {
    it('renders admin panel when logged in and admin', async () => {
      const result = await container.renderToString(AstroTestComponent, {
        props: { isLoggedIn: true, isAdmin: true }
      });
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#renders_admin_panel_when_logged_in_and_admin');
      expect(element).toBeDefined();
      expect(element.classList.contains('admin-panel')).toBe(true);
    });

    it('renders user panel when logged in but not admin', async () => {
      const result = await container.renderToString(AstroTestComponent, {
        props: { isLoggedIn: true, isAdmin: false }
      });
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#renders_user_panel_when_logged_in_but_not_admin');
      expect(element).toBeDefined();
      expect(element.classList.contains('user-panel')).toBe(true);
    });

    it('renders login form when not logged in', async () => {
      const result = await container.renderToString(AstroTestComponent, {
        props: { isLoggedIn: false }
      });
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#renders_login_form_when_not_logged_in');
      expect(element).toBeDefined();
      expect(element.classList.contains('login-form')).toBe(true);
    });
  });

  describe('Combined Class and Style', () => {
    it('applies both class and style simultaneously', async () => {
      const result = await container.renderToString(AstroTestComponent);
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#applies_both_class_and_style_simultaneously');
      expect(element.classList.contains('btn-primary')).toBe(true);
      const style = element.getAttribute('style');
      expect(normalizeStyle(style)).toContain('color:red');
      expect(normalizeStyle(style)).toContain('margin-top:10px');
    });

    it('applies conditional class with existing style', async () => {
      const result = await container.renderToString(AstroTestComponent, {
        props: { isHighlighted: true }
      });
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#applies_conditional_class_with_existing_style_highlighted');
      const highlightedElement = element.querySelector('div');
      expect(highlightedElement).toBeDefined();
      expect(highlightedElement.classList.contains('highlighted-text')).toBe(true);
    });

    it('applies multiple comments in conditional rendering', async () => {
      const result = await container.renderToString(AstroTestComponent, {
        props: { showDetails: true }
      });
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#applies_multiple_comments_in_conditional_rendering');
      expect(element).toBeDefined();
      expect(element.classList.contains('detail-container')).toBe(true);
      const style = element.getAttribute('style');
      expect(normalizeStyle(style)).toContain('padding:20px');
      expect(normalizeStyle(style)).toContain('margin-top:10px');
    });
  });

  describe('Edge Cases', () => {
    it('ignores empty comments', async () => {
      const result = await container.renderToString(AstroTestComponent);
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#ignores_empty_comments');
      expect(element.classList.contains('btn-primary')).toBe(true);
    });

    it('renders elements without comments unchanged', async () => {
      const result = await container.renderToString(AstroTestComponent);
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#renders_elements_without_comments_unchanged');
      const spanElement = element.querySelector('span');
      expect(spanElement.textContent).toBe('Hello World');
      // No comments, so span should not have class or style added
      expect(spanElement.classList.length).toBe(0);
    });

    it('handles array destructuring in each blocks', async () => {
      const mockUsers = [
        { id: 1, name: 'John', role: 'admin' },
        { id: 2, name: 'Jane', role: 'user' }
      ];
      const result = await container.renderToString(AstroTestComponent, {
        props: { users: mockUsers }
      });
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element1 = document.querySelector('#handles_array_destructuring_in_each_blocks_1');
      const element2 = document.querySelector('#handles_array_destructuring_in_each_blocks_2');
      
      expect(element1).toBeDefined();
      expect(element2).toBeDefined();
      expect(element1.classList.contains('user-card')).toBe(true);
      expect(element2.classList.contains('user-card')).toBe(true);
    });
  });

  describe('Nested Structure', () => {
    it('applies class to nested elements', async () => {
      const result = await container.renderToString(AstroTestComponent);
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const headerElement = document.querySelector('#applies_class_to_nested_header');
      const mainElement = document.querySelector('#applies_class_to_nested_main');
      
      expect(headerElement).toBeDefined();
      expect(mainElement).toBeDefined();
      expect(headerElement.classList.contains('header-class')).toBe(true);
      expect(mainElement.classList.contains('main-content')).toBe(true);
    });
  });

  describe('Multiple Comments on Same Element', () => {
    it('handles multiple class comments on same element', async () => {
      const result = await container.renderToString(AstroTestComponent);
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#merges_multiple_class_comments');
      expect(element.classList.contains('btn-primary')).toBe(true);
      expect(element.classList.contains('text-center')).toBe(true);
      expect(element.classList.contains('mt-4')).toBe(true);
    });

    it('handles multiple style comments on same element', async () => {
      const result = await container.renderToString(AstroTestComponent);
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#merges_multiple_style_comments');
      const style = element.getAttribute('style');
      expect(normalizeStyle(style)).toContain('color:red');
      expect(normalizeStyle(style)).toContain('margin-top:10px');
      expect(normalizeStyle(style)).toContain('padding:20px');
    });
  });

  describe('Complex Conditional Logic', () => {
    it('handles nested ternary operators', async () => {
      const result = await container.renderToString(AstroTestComponent, {
        props: { isLoggedIn: true, isAdmin: true }
      });
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      // Should render admin panel, not user panel or login form
      const adminElement = document.querySelector('#renders_admin_panel_when_logged_in_and_admin');
      const userElement = document.querySelector('#renders_user_panel_when_logged_in_but_not_admin');
      const loginElement = document.querySelector('#renders_login_form_when_not_logged_in');
      
      expect(adminElement).toBeDefined();
      expect(userElement).toBeNull();
      expect(loginElement).toBeNull();
    });

    it('handles multiple conditional states', async () => {
      const result = await container.renderToString(AstroTestComponent, {
        props: { isVisible: true, isActive: true, isError: true }
      });
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const visibleElement = document.querySelector('#renders_conditional_content_with_class_when_condition_is_true');
      const activeElement = document.querySelector('#renders_active_state_when_isActive_is_true');
      const errorElement = document.querySelector('#renders_conditional_content_with_style_when_condition_is_true');
      
      expect(visibleElement).toBeDefined();
      expect(activeElement).toBeDefined();
      expect(errorElement).toBeDefined();
    });
  });

  describe('Array Operations', () => {
    it('handles filter and map operations', async () => {
      const mockItems = [
        { id: 1, active: true },
        { id: 2, active: false },
        { id: 3, active: true },
        { id: 4, active: false }
      ];
      const result = await container.renderToString(AstroTestComponent, {
        props: { items: mockItems }
      });
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      // Should only render 2 active items
      const element0 = document.querySelector('#renders_filtered_list_items_0');
      const element1 = document.querySelector('#renders_filtered_list_items_1');
      const element2 = document.querySelector('#renders_filtered_list_items_2');
      
      expect(element0).toBeDefined();
      expect(element1).toBeDefined();
      expect(element2).toBeNull(); // Should not exist as only 2 items are active
    });

    it('handles array destructuring with object properties', async () => {
      const mockUsers = [
        { id: 1, name: 'John', role: 'admin' },
        { id: 2, name: 'Jane', role: 'user' },
        { id: 3, name: 'Bob', role: 'moderator' }
      ];
      const result = await container.renderToString(AstroTestComponent, {
        props: { users: mockUsers }
      });
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element1 = document.querySelector('#handles_array_destructuring_in_each_blocks_1');
      const element2 = document.querySelector('#handles_array_destructuring_in_each_blocks_2');
      const element3 = document.querySelector('#handles_array_destructuring_in_each_blocks_3');
      
      expect(element1).toBeDefined();
      expect(element2).toBeDefined();
      expect(element3).toBeDefined();
      expect(element1.classList.contains('user-card')).toBe(true);
      expect(element2.classList.contains('user-card')).toBe(true);
      expect(element3.classList.contains('user-card')).toBe(true);
    });
  });

  describe('Fragment and Component Tests', () => {
    it('handles fragment-like structures', async () => {
      const result = await container.renderToString(AstroTestComponent);
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      // Check that multiple root-level elements are rendered
      const rootElements = document.body.children;
      expect(rootElements.length).toBeGreaterThan(1);
    });

    it('preserves component structure', async () => {
      const result = await container.renderToString(AstroTestComponent);
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      // Check that the basic structure is preserved
      const basicTest = document.querySelector('#basic_test');
      expect(basicTest.querySelector('p')).toBeDefined();
    });
  });

  describe('Style Property Variations', () => {
    it('handles different color formats', async () => {
      const result = await container.renderToString(AstroTestComponent);
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#transforms_style_comments_to_style_attribute');
      const style = element.getAttribute('style');
      expect(normalizeStyle(style)).toContain('color:red');
    });

    it('handles spacing in style properties', async () => {
      const result = await container.renderToString(AstroTestComponent);
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#merges_multiple_style_comments');
      const style = element.getAttribute('style');
      expect(normalizeStyle(style)).toContain('margin-top:10px');
      expect(normalizeStyle(style)).toContain('padding:20px');
    });
  });

  describe('Class Name Variations', () => {
    it('handles utility classes', async () => {
      const result = await container.renderToString(AstroTestComponent);
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#merges_multiple_class_comments');
      expect(element.classList.contains('btn-primary')).toBe(true);
      expect(element.classList.contains('text-center')).toBe(true);
      expect(element.classList.contains('mt-4')).toBe(true);
    });

    it('handles custom class names', async () => {
      const result = await container.renderToString(AstroTestComponent);
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      const element = document.querySelector('#transforms_class_comments_to_class_attribute');
      expect(element.classList.contains('btn-primary')).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('combines all transformation types', async () => {
      const result = await container.renderToString(AstroTestComponent, {
        props: { isVisible: true, isActive: true, showDetails: true }
      });
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      // Check class transformations
      const classElement = document.querySelector('#transforms_class_comments_to_class_attribute');
      expect(classElement.classList.contains('btn-primary')).toBe(true);
      
      // Check style transformations
      const styleElement = document.querySelector('#transforms_style_comments_to_style_attribute');
      const style = styleElement.getAttribute('style');
      expect(normalizeStyle(style)).toContain('color:red');
      
      // Check conditional rendering
      const conditionalElement = document.querySelector('#renders_conditional_content_with_class_when_condition_is_true');
      expect(conditionalElement).toBeDefined();
    });

    it('maintains HTML structure integrity', async () => {
      const result = await container.renderToString(AstroTestComponent);
      const dom = new JSDOM(result);
      const document = dom.window.document;
      
      // Check that all expected elements are present
      const expectedIds = [
        'basic_test',
        'transforms_class_comments_to_class_attribute',
        'merges_multiple_class_comments',
        'merges_with_existing_class',
        'transforms_style_comments_to_style_attribute',
        'merges_multiple_style_comments',
        'merges_with_existing_style',
        'handles_complex_style_properties'
      ];
      
      expectedIds.forEach(id => {
        const element = document.querySelector(`#${id}`);
        expect(element).toBeDefined();
      });
    });
  });
});

