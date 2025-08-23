import { describe, it, expect } from 'vitest';
import { fixture, html, defineCE } from '@open-wc/testing';
import { LitElement } from 'lit';

describe('Lit Components with OliveCSS', () => {
  describe('BasicTransformation', () => {
    it('renders correctly', async () => {
      // 1. Define the custom element and get a unique, valid tag name
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <h1>Hello OliveCSS!</h1> <!-- background: olive; --> <!-- text-white -->
            </div>
          `;
        }
      });
      
      // 2. Use the unique tag name as a static string in the fixture
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const heading = element.shadowRoot.querySelector('h1');
      expect(heading).toHaveTextContent('Hello OliveCSS!');
       
      expect(heading).toHaveStyle({ background: 'olive' });
      expect(heading).toHaveClass('text-white');
    });
  });

  describe('ClassTransformation', () => {
    it('applies class from comments', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <button>Click me</button> <!-- btn-primary -->
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const button = element.shadowRoot.querySelector('button');
      expect(button).toHaveTextContent('Click me');
       
      expect(button).toHaveClass('btn-primary');
    });
  });

  describe('StyleTransformation', () => {
    it('applies style from comments', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <span>Styled text</span> <!-- color: red; margin-top: 10px; -->
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const span = element.shadowRoot.querySelector('span');
      expect(span).toHaveTextContent('Styled text');
       
      expect(span).toHaveStyle({ 
        color: 'rgb(255, 0, 0)', 
        marginTop: '10px' 
      });
    });
  });

  describe('MultipleComments', () => {
    it('handles multiple consecutive comments', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <div>
                <!-- btn-primary -->
                <!-- text-center -->
                <!-- mt-4 -->
                Multiple classes
              </div>
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const div = element.shadowRoot.querySelector('div > div');
      expect(div).toHaveTextContent('Multiple classes');
       
      expect(div).toHaveClass('btn-primary');
      expect(div).toHaveClass('text-center');
      expect(div).toHaveClass('mt-4');
    });
  });

  describe('MixedComments', () => {
    it('handles both class and style comments', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <div>
                <!-- btn-primary -->
                <!-- color: red; margin-top: 10px; -->
                Mixed styling
              </div>
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const div = element.shadowRoot.querySelector('div > div');
      expect(div).toHaveTextContent('Mixed styling');
       
      expect(div).toHaveClass('btn-primary');
      expect(div).toHaveStyle({ 
        color: 'rgb(255, 0, 0)', 
        marginTop: '10px' 
      });
    });
  });

  describe('NestedElements', () => {
    it('applies transformations to nested elements', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div> <!-- container -->
              <header> <!-- bg-gray-100 -->
                <h1>Title</h1> <!-- text-xl -->
              </header>
              <main> <!-- p-4 -->
                <p>Content</p> <!-- text-gray-700 -->
              </main>
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const container = element.shadowRoot.querySelector('div');
      const header = element.shadowRoot.querySelector('header');
      const title = element.shadowRoot.querySelector('h1');
      const main = element.shadowRoot.querySelector('main');
      const content = element.shadowRoot.querySelector('p');
      
      expect(title).toHaveTextContent('Title');
      expect(content).toHaveTextContent('Content');
      
       
      expect(container).toHaveClass('container');
      expect(header).toHaveClass('bg-gray-100');
      expect(title).toHaveClass('text-xl');
      expect(main).toHaveClass('p-4');
      expect(content).toHaveClass('text-gray-700');
    });
  });

  describe('DynamicContent', () => {
    it('works with dynamic content', async () => {
      const tagName = defineCE(class extends LitElement {
        static properties = {
          items: { type: Array }
        };

        constructor() {
          super();
          this.items = ['Item 1', 'Item 2', 'Item 3'];
        }

        render() {
          return html`
            <div>
              ${this.items.map((item, index) => html`
                <div class="item">
                  <!-- list-item -->
                  <!-- margin-bottom: 10px; -->
                  ${item}
                </div>
              `)}
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const items = element.shadowRoot.querySelectorAll('.item');
      expect(items).toHaveLength(3);
      expect(items[0]).toHaveTextContent('Item 1');
      expect(items[1]).toHaveTextContent('Item 2');
      expect(items[2]).toHaveTextContent('Item 3');
      
       
      items.forEach(item => {
        expect(item).toHaveClass('list-item');
        expect(item).toHaveStyle({ marginBottom: '10px' });
      });
    });
  });

  describe('ConditionalRendering', () => {
    it('works with conditional content', async () => {
      const tagName = defineCE(class extends LitElement {
        static properties = {
          isVisible: { type: Boolean }
        };

        constructor() {
          super();
          this.isVisible = true;
        }

        render() {
          return html`
            <div>
              ${this.isVisible ? html`
                <div id="conditional">
                  <!-- visible-content -->
                  Conditional content
                </div>
              ` : ''}
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const conditional = element.shadowRoot.querySelector('#conditional');
      expect(conditional).toHaveTextContent('Conditional content');
       
      expect(conditional).toHaveClass('visible-content');
    });
  });

  describe('EventHandling', () => {
    it('maintains event handlers with comments', async () => {
      const tagName = defineCE(class extends LitElement {
        static properties = {
          clickCount: { type: Number }
        };

        constructor() {
          super();
          this.clickCount = 0;
        }

        handleClick() {
          this.clickCount++;
        }

        render() {
          return html`
            <div>
              <button id="styled-button" @click=${this.handleClick}>
                <!-- btn-primary -->
                <!-- background-color: #007bff; color: white; -->
                Click me
              </button>
              <span id="click-count">${this.clickCount}</span>
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const button = element.shadowRoot.querySelector('#styled-button');
      const clickCount = element.shadowRoot.querySelector('#click-count');
      
      expect(button).toHaveTextContent('Click me');
      expect(clickCount).toHaveTextContent('0');
       
      expect(button).toHaveClass('btn-primary');
      expect(button).toHaveStyle({ 
        backgroundColor: 'rgb(0, 123, 255)', 
        color: 'rgb(255, 255, 255)' 
      });
    });
  });

  describe('ComplexStyles', () => {
    it('handles complex style properties', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <div id="complex-style">
                <!-- background-color: #f0f0f0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); -->
                Complex styling
              </div>
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const complexElement = element.shadowRoot.querySelector('#complex-style');
      expect(complexElement).toHaveTextContent('Complex styling');
       
      expect(complexElement).toHaveStyle({
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      });
    });
  });

  // Additional 15 test cases
  describe('FormElements', () => {
    it('handles form input styling', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <input type="text" placeholder="Enter text" /> <!-- border: 1px solid #ccc; padding: 8px; -->
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const input = element.shadowRoot.querySelector('input');
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('placeholder', 'Enter text');
       
      expect(input).toHaveStyle({ 
        border: '1px solid rgb(204, 204, 204)', 
        padding: '8px' 
      });
    });
  });

  describe('ListElements', () => {
    it('handles list styling', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <ul>
                <li>Item 1</li> <!-- list-item -->
                <li>Item 2</li> <!-- list-item -->
                <li>Item 3</li> <!-- list-item -->
              </ul>
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const listItems = element.shadowRoot.querySelectorAll('li');
      expect(listItems).toHaveLength(3);
      expect(listItems[0]).toHaveTextContent('Item 1');
       
      listItems.forEach(item => {
        expect(item).toHaveClass('list-item');
      });
    });
  });

  describe('TableElements', () => {
    it('handles table styling', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Header 1</th> <!-- table-header -->
                    <th>Header 2</th> <!-- table-header -->
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Data 1</td> <!-- table-cell -->
                    <td>Data 2</td> <!-- table-cell -->
                  </tr>
                </tbody>
              </table>
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const headers = element.shadowRoot.querySelectorAll('th');
      const cells = element.shadowRoot.querySelectorAll('td');
      
      expect(headers).toHaveLength(2);
      expect(cells).toHaveLength(2);
       
      headers.forEach(header => {
        expect(header).toHaveClass('table-header');
      });
      cells.forEach(cell => {
        expect(cell).toHaveClass('table-cell');
      });
    });
  });

  describe('ImageElements', () => {
    it('handles image styling', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <img src="test.jpg" alt="Test image" /> <!-- max-width: 100%; height: auto; -->
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const img = element.shadowRoot.querySelector('img');
      expect(img).toHaveAttribute('src', 'test.jpg');
      expect(img).toHaveAttribute('alt', 'Test image');
       
      expect(img).toHaveStyle({ 
        maxWidth: '100%', 
        height: 'auto' 
      });
    });
  });

  describe('LinkElements', () => {
    it('handles link styling', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <a href="https://example.com">Link text</a> <!-- color: blue; text-decoration: underline; -->
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const link = element.shadowRoot.querySelector('a');
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveTextContent('Link text');
       
      expect(link).toHaveStyle({ 
        color: 'rgb(0, 0, 255)', 
        textDecoration: 'underline' 
      });
    });
  });

  describe('ParagraphElements', () => {
    it('handles paragraph styling', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <p>This is a paragraph with styling</p> <!-- line-height: 1.6; margin-bottom: 1rem; -->
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const paragraph = element.shadowRoot.querySelector('p');
      expect(paragraph).toHaveTextContent('This is a paragraph with styling');
       
      expect(paragraph).toHaveStyle({ 
        lineHeight: '1.6', 
        marginBottom: '1rem' 
      });
    });
  });

  describe('SectionElements', () => {
    it('handles section styling', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <section>
                <h2>Section Title</h2> <!-- section-title -->
                <p>Section content</p> <!-- section-content -->
              </section>
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const title = element.shadowRoot.querySelector('h2');
      const content = element.shadowRoot.querySelector('p');
      
      expect(title).toHaveTextContent('Section Title');
      expect(content).toHaveTextContent('Section content');
       
      expect(title).toHaveClass('section-title');
      expect(content).toHaveClass('section-content');
    });
  });

  describe('ArticleElements', () => {
    it('handles article styling', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <article>
                <h3>Article Title</h3> <!-- article-title -->
                <p>Article content goes here</p> <!-- article-content -->
              </article>
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const title = element.shadowRoot.querySelector('h3');
      const content = element.shadowRoot.querySelector('p');
      
      expect(title).toHaveTextContent('Article Title');
      expect(content).toHaveTextContent('Article content goes here');
       
      expect(title).toHaveClass('article-title');
      expect(content).toHaveClass('article-content');
    });
  });

  describe('AsideElements', () => {
    it('handles aside styling', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <aside>
                <h4>Sidebar</h4> <!-- sidebar-title -->
                <ul>
                  <li>Sidebar item 1</li> <!-- sidebar-item -->
                  <li>Sidebar item 2</li> <!-- sidebar-item -->
                </ul>
              </aside>
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const title = element.shadowRoot.querySelector('h4');
      const items = element.shadowRoot.querySelectorAll('li');
      
      expect(title).toHaveTextContent('Sidebar');
      expect(items).toHaveLength(2);
       
      expect(title).toHaveClass('sidebar-title');
      items.forEach(item => {
        expect(item).toHaveClass('sidebar-item');
      });
    });
  });

  describe('FooterElements', () => {
    it('handles footer styling', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <footer>
                <p>Footer content</p> <!-- footer-text -->
                <nav>
                  <a href="/about">About</a> <!-- footer-link -->
                  <a href="/contact">Contact</a> <!-- footer-link -->
                </nav>
              </footer>
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const text = element.shadowRoot.querySelector('p');
      const links = element.shadowRoot.querySelectorAll('a');
      
      expect(text).toHaveTextContent('Footer content');
      expect(links).toHaveLength(2);
       
      expect(text).toHaveClass('footer-text');
      links.forEach(link => {
        expect(link).toHaveClass('footer-link');
      });
    });
  });

  describe('NavigationElements', () => {
    it('handles navigation styling', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <nav>
                <a href="/home">Home</a> <!-- nav-link -->
                <a href="/products">Products</a> <!-- nav-link -->
                <a href="/services">Services</a> <!-- nav-link -->
              </nav>
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const links = element.shadowRoot.querySelectorAll('a');
      
      expect(links).toHaveLength(3);
      expect(links[0]).toHaveTextContent('Home');
       
      links.forEach(link => {
        expect(link).toHaveClass('nav-link');
      });
    });
  });

  describe('BlockquoteElements', () => {
    it('handles blockquote styling', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <blockquote>
                <p>This is a quote</p> <!-- quote-text -->
                <cite>Author Name</cite> <!-- quote-author -->
              </blockquote>
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const blockquote = element.shadowRoot.querySelector('blockquote');
      const quote = element.shadowRoot.querySelector('p');
      const author = element.shadowRoot.querySelector('cite');
      
      expect(quote).toHaveTextContent('This is a quote');
      expect(author).toHaveTextContent('Author Name');
       
      expect(quote).toHaveClass('quote-text');
      expect(author).toHaveClass('quote-author');
    });
  });

  describe('CodeElements', () => {
    it('handles code styling', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <code id="inline">console.log('Hello World');</code> <!-- code-inline -->
              <code id="block">function example() {
return 'Hello World';
}</code> <!-- code-block -->
              <pre>
                <code id="pre">function example() {
                  return 'Hello World';
                </code> <!-- code-pre -->
              </pre>
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const inlineCode = element.shadowRoot.querySelector('code#inline');
      const blockCode = element.shadowRoot.querySelector('code#block');
      const preCode = element.shadowRoot.querySelector('code#pre');
      
      expect(inlineCode).toHaveClass('code-inline');
      expect(blockCode).toHaveClass('code-block');
      expect(preCode).not.toHaveClass('code-pre');
    });
  });

  describe('TimeElements', () => {
    it('handles time styling', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <time datetime="2024-01-01">January 1, 2024</time> <!-- date-time -->
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const time = element.shadowRoot.querySelector('time');
      expect(time).toHaveAttribute('datetime', '2024-01-01');
      expect(time).toHaveTextContent('January 1, 2024');
       
      expect(time).toHaveClass('date-time');
    });
  });

  describe('MarkElements', () => {
    it('handles mark styling', async () => {
      const tagName = defineCE(class extends LitElement {
        render() {
          return html`
            <div>
              <p>This text contains <mark>highlighted</mark> <!-- highlighted-text --> content</p> 
            </div>
          `;
        }
      });
      
      const element = await fixture(`<${tagName}></${tagName}>`);
      
      const mark = element.shadowRoot.querySelector('mark');
      expect(mark).toHaveTextContent('highlighted');
       
      expect(mark).toHaveClass('highlighted-text');
    });
  });
});