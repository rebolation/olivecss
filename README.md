# OliveCSS

A powerful Babel plugin and Svelte preprocessor that transforms comments into CSS classes and styles.

## Overview

OliveCSS allows you to write CSS directly in comments within your JSX (React) and Svelte components. The plugin automatically converts these comments into `className`/`class` attributes and `style` properties, making your code cleaner and more maintainable.

## Features

- **React Support**: Transform JSX comments into `className` and `style` attributes
- **Svelte Support**: Transform HTML comments into `class` and `style` attributes
- **Consecutive Comments**: Merge multiple consecutive comments into single attributes
- **Style Detection**: Automatically detect CSS-style comments (containing `:` or `;`)
- **Attribute Merging**: Intelligently merge with existing attributes

## Installation

```bash
npm install -D olivecss
```

## Usage

### JSX (Babel Plugin)

1. **Install the plugin**:
   ```bash
   npm install --save-dev olivecss
   ```

2. **Configure Vite** (`vite.config.js`):
   ```js   
   import olivecss from "olivecss";

   export default defineConfig({
     plugins: [
       react({
         babel: {
           plugins: [
             olivecss,
           ],
         },
       })
     ],
   });
   ```

3. **Use in your JSX**:
   ```jsx
   function MyComponent() {
     return (
       <div>         
         <h1>Hello World</h1> {/* bg-blue-500 text-white */}
         <p>Styled paragraph</p> {/* color: red; font-size: 18px */}
         <button>Click me</button> {/* bg-green-500 /*} {/* color: white; padding: 10px */}
       </div>
     );
   }
   ```

   **Result**:
   ```jsx
   function MyComponent() {
     return (
       <div>
         <h1 className="bg-blue-500 text-white">Hello World</h1>         
         <p style={{ color: "red", fontSize: "18px" }}>Styled paragraph</p>         
         <button className="bg-green-500" style={{ color: "white", padding: "10px" }}>
           Click me
         </button>
       </div>
     );
   }
   ```

### Svelte (Preprocessor)

1. **Install the preprocessor**:
   ```bash
   npm install --save-dev olivecss
   ```

2. **Configure Vite** (`vite.config.js`):
   ```javascript
   import { OliveSvelte } from "olivecss";

   export default defineConfig(async () => {
     const olivecss = await OliveSvelte();
     return {
       plugins: [
         svelte({ preprocess: [olivecss] }),
       ],
     };
   })
   ```

3. **Use in your Svelte components**:
   ```html
   <div>     
     <h1>Hello World</h1> <!-- bg-blue-500 text-white -->
     <p>Styled paragraph</p> <!-- color: red; font-size: 18px -->
     <button>Click me</button> <!-- bg-green-500 --> <!-- color: white; padding: 10px -->
   </div>
   ```

   **Result**:
   ```html
   <div>
     <h1 class="bg-blue-500 text-white">Hello World</h1>     
     <p style="color: red; font-size: 18px">Styled paragraph</p>     
     <button class="bg-green-500" style="color: white; padding: 10px">
       Click me
     </button>
   </div>
   ```

## Comment Syntax

### CSS Classes
Write class names as regular comments:
```jsx
<div>Content</div> {/* bg-blue-500 text-white rounded-lg */}
```

### CSS Styles
Write CSS properties as comments (must contain `:` or `;`):
```jsx
<div>Content</div> {/* color: red; font-size: 18px; */}
```

### Mixed Comments
You can combine both classes and styles:
```jsx
<div>Content</div> {/* bg-blue-500 /*} {/* color: white; padding: 10px */}
```
**Result**:
```jsx
<div className="bg-blue-500" style="color: white; padding: 10px">Content</div>
```

### Consecutive Comments

Multiple consecutive comments are automatically merged:

```jsx
<div>Content</div> {/* bg-blue-500 */} {/* text-white */} {/* rounded-lg */}
```

**Result**:
```jsx
<div className="bg-blue-500 text-white rounded-lg">Content</div>
```

### Normal Comment
You can write a normal comment using double-dash:
```jsx
<div>Content</div> {/* // normal comment */}
```


## Development

### Project Structure
```
src/
├── olivecss.js                 # Main entry point
├── olivecss-plugin-jsx.js      # JSX Babel plugin
└── olivecss-plugin-svelte.js   # Svelte preprocessor

demo/                           # Demo
tests/                          # Test files
```

The project is structured into three main modules:

- **`olivecss.js`**: Main entry point that exports both JSX Babel plugin and Svelte preprocessor
- **`olivecss-plugin-jsx.js`**: JSX-specific Babel plugin implementation
- **`olivecss-plugin-svelte.js`**: Svelte-specific preprocessor implementation

### Running Tests
```bash
cd tests
npx vitest run
npx vitest run babel
npx vitest run babel.react
npx vitest run unit
npx vitest run unit.react
npx vitest run unit.svelte
```

## Changelog
See [CHANGELOG.md](CHANGELOG.md) file for details.
### v0.1.0
- Initial release of **olivecss** 🎉


## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2025 rebolation

### Dependencies

This project depends on the following open-source libraries:

- [svelte/compiler](https://github.com/sveltejs/svelte) — MIT License  
- [magic-string](https://github.com/Rich-Harris/magic-string) — MIT License  

Each dependency retains its own license.  
Their license texts can be found in the respective repositories.