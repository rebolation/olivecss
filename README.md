# 🫒 Olive CSS

A lightweight package that transforms comments...

```html
<div>🫒</div> <!-- this_is_a_delicious_olive -->
```
...into CSS classes and inline styles.
```html
<div class="this_is_a_delicious_olive">🫒</div>
```

The official website built with OliveCSS : [https://rebolation.github.io/olivecss.pages](https://rebolation.github.io/olivecss.pages)



## Overview

Use **comments** to add CSS, making your HTML **cleaner and easier to read**.

OliveCSS automatically converts your comments into `className`/`class` attributes and `style` properties, keeping your code tidy and maintainable across modern frameworks.



## Features

- **Automatic conversion** of CSS comments into `className`/`class` and inline `style`.
- **Supports major frameworks**: React, Solid, Svelte, and Vue.
- **Easy to integrate** into any project.
- **Lightweight**. (it's just an olive)



## How it works

#### 🫒 1. **You write comments**

Write your CSS rules in comments next to the elements you want to style in your components. This way, **classes and styles are removed** (moved into comments) from elements, giving you **cleaner HTML tags**.

#### 🫒 2. **OliveCSS converts**

**At build time**, OliveCSS parses your code and **automatically converts** detected CSS comments into the appropriate `className/class` attributes and inline `style` properties.

#### 🫒 3. **You get clean code**

Your HTML, JSX, Vue, or Svelte code now contains proper classes and styles, without manually editing attributes or creating separate CSS files.



## Example

🫒 You could write:
```jsx
export default function App() {
  return (
    <div>
      <h1>Hello OliveCSS!</h1> {/* text-xl font-bold */} {/* color: olive; */}
    </div>
  );
}
```
which would become:
```jsx
export default function App() {
  return (
    <div>
      <h1 className="text-xl font-bold" style={{ color: "olive" }}>Hello OliveCSS!</h1>
    </div>
  );
}
```

🫒 Alternatively, you could write:
```html
<template>
  <h1>Hello OliveCSS!</h1> <!-- text-xl font-bold --> <!-- color: olive; -->
</template>
```
which would become:
```html
<template>
  <h1 class="text-xl font-bold" style="color: olive;">Hello OliveCSS!</h1>
</template>
```



## Installation

```bash
npm install --save-dev olivecss
```



## Usage (with Vite)

OliveCSS integrates seamlessly with popular frameworks using a minimal setup. The example configurations are shown below. 

That's all you need; no extra configuration is needed in your components.

#### 🫒 React + Tailwind

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import olivecss from "olivecss";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [[ olivecss ]],
      },
    }),
    tailwind(),
  ],
});
```

#### 🫒 Vue + Tailwind

```js
// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwind from "@tailwindcss/vite";
import { OliveVue } from "olivecss";

export default defineConfig({
  plugins: [
    OliveVue(),
    vue(),
    tailwind(),
  ],
});

```

#### 🫒 Preact + Tailwind

```js
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwind from "@tailwindcss/vite";
import olivecss from "olivecss";

export default defineConfig({
  plugins: [
    preact({
      babel: {
        plugins: [[ olivecss ]],
      },
    }),
    tailwind(),
  ],
});

```

#### 🫒 Lit + Tailwind

```js
import { defineConfig } from "vite";
import tailwind from "@tailwindcss/vite";
import { OliveLit } from "olivecss";

export default defineConfig({
  plugins: [
    OliveLit(),
    tailwind(),
  ],
});
```

#### 🫒 Svelte + Tailwind

```js
// vite.config.js
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwind from "@tailwindcss/vite";
import { OliveSvelte } from 'olivecss';

export default defineConfig(async () => {
  const olivecss = await OliveSvelte();
  return {
    plugins: [
      svelte({
        preprocess: [olivecss],
      }),
      tailwind(),
    ],
  };
})
```
```js
// svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: [
    vitePreprocess()
  ],
}

```

#### 🫒 Solid + Tailwind

```js
// vite.config.js
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwind from "@tailwindcss/vite";
import olivecss from "olivecss";

export default defineConfig({
  plugins: [
    solid({
      babel: {
        plugins: [[ olivecss, { framework: 'solid' } ]],
      },
    }),
    tailwind(),
  ],
});
```


## Comment Syntax

#### CSS Classes
Write class names inside regular comments:
```jsx
<div>Content</div> {/* bg-blue-500 text-white rounded-lg */}
```

#### CSS Styles
Write CSS properties inside regular comments:
```jsx
<div>Content</div> {/* color: red; font-size: 18px; */}
```

#### Normal Comment
Write a normal comment using double slashes:
```jsx
<div>Content</div> {/* // normal comment */}
```

#### Mixed Comments
Combine both classes and styles in separate comments:
```jsx
<div>Content</div> {/* bg-blue-500 */} {/* color: white; padding: 10px */}
```
**Result**:
```jsx
<div className="bg-blue-500" style="color: white; padding: 10px">Content</div>
```

#### Consecutive Comments
Multiple consecutive comments are automatically merged:

```jsx
<div>Content</div> {/* bg-blue-500 */} {/* text-white */} {/* rounded-lg */}
```

**Result**:
```jsx
<div className="bg-blue-500 text-white rounded-lg">Content</div>
```



## Development

#### Project Structure
```
src/
├── olivecss.js                 # Main entry point exporting all modules
├── olivecss-jsx.js             # for JSX(React/Preact/Solid) integration
├── olivecss-vue.js             # for Vue integration
├── olivecss-lit.js             # for Lit integration
└── olivecss-svelte.js          # for Svelte integration

demo/                           # Demo
tests/                          # Test files
```

#### Notes
- `olivecss.js` is the central entry point for all plugins and preprocessors.
- Each framework-specific file contains the corresponding plugin or preprocessor implementation.
- `demo/` and `tests/` help you verify and experiment with OliveCSS features.

#### Running Tests
```bash
cd tests
npm install
npm run test                    # Run all tests
npm run test.unit               # Run all unit tests
npm run test.unit.react         # Run unit tests for React
npm run test.unit.vue           # Run unit tests for Vue
npm run test.unit.preact        # Run unit tests for Preact
npm run test.unit.lit           # Run unit tests for lit
npm run test.unit.svelte        # Run unit tests for Svelte
npm run test.unit.solid         # Run unit tests for solid
...

npm run watch                   # Watch and rerun all tests
npm run watch.unit              # Watch and rerun all unit tests
npm run watch.unit.react        # Watch and rerun unit tests for React
...
```



## Dependencies
Depending on your usage environment, this project may depend on the following packages:

- [magic-string](https://www.npmjs.com/package/magic-string) — MIT License
- [@babel/traverse](https://www.npmjs.com/package/@babel/traverse) — MIT License
- [@babel/parser](https://www.npmjs.com/package/@babel/parser) — MIT License
- [@vue/compiler-sfc](https://www.npmjs.com/package/@vue/compiler-sfc) — MIT License
- [@vue/compiler-dom](https://www.npmjs.com/package/@vue/compiler-dom) — MIT License
- [svelte/compiler](https://www.npmjs.com/package/svelte) — MIT License
- [node-html-parser](https://www.npmjs.com/package/node-html-parser) — MIT License



## Changelog
See 🫒 [CHANGELOG.md](CHANGELOG.md) file for details.



## License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright © 2025 Mun Jaehyeon