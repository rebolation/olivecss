
<p align="center">
  <a href="https://rebolation.github.io/olivecss.pages" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/rebolation/olivecss/HEAD/.github/logo-dark.png">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/rebolation/olivecss/HEAD/.github/logo-light.png">
      <img alt="Olive CSS" src="https://raw.githubusercontent.com/rebolation/olivecss/HEAD/.github/logo-light.png" width="550" style="max-width: 100%;">
    </picture>
  </a>
</p>

<p align="center">
  A lightweight package that transforms comments into CSS classes and inline styles.
</p>

---


```html
<div>🫒</div> <!-- this_is_a_delicious_olive -->
```
...results in the following:
```html
<div class="this_is_a_delicious_olive">🫒</div>
```

[Demo](https://rebolation.github.io/olivecss.pages) (created with OliveCSS)



## Overview

Use **comments** to add CSS, making your HTML **cleaner** and **easier to read**.

OliveCSS automatically converts your comments into `className`/`class` attributes and `style` properties, keeping your code tidy and maintainable across modern frameworks.



## Features

- **Automatic conversion** of CSS comments into `className`/`class` and inline `style`
- **Supports major frameworks**: React, Vue, Svelte, Astro, Solid, Preact, and Lit
- **Easy to integrate** into any project



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



## Usage (with Vite)

OliveCSS integrates seamlessly with popular frameworks using a minimal setup. The example configurations are shown below. 

That's all you need; no extra configuration is needed in your components.

#### 🫒 React / Preact / Solid + Tailwind

```bash
npm install --save-dev olivecss
```

```js
// vite.config.js
// import preact from "@preact/preset-vite";
// import solid from 'vite-plugin-solid'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; 
import tailwind from "@tailwindcss/vite";
import olivecss from "olivecss";

export default defineConfig({
  plugins: [
    react({ // preact({  solid ({
      babel: {
        plugins: [[ olivecss ]], // plugins: [[ olivecss, { framework: 'solid' } ]],
      },
    }),
    tailwind(),
  ],
});
```

#### 🫒 Vue + Tailwind
```bash
npm install --save-dev olivecss node-html-parser
```

```js
// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwind from "@tailwindcss/vite";
import { OliveVue } from "olivecss";

const oliveVue = await OliveVue();

export default defineConfig({
  plugins: [
    oliveVue,
    vue(),
    tailwind(),
  ],
});

```

#### 🫒 Svelte + Tailwind
```bash
npm install --save-dev olivecss
```

```js
// vite.config.js
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwind from "@tailwindcss/vite";
import { OliveSvelte } from 'olivecss';

const oliveSvelte = await OliveSvelte();

export default defineConfig({
  plugins: [
    svelte({
      preprocess: [ oliveSvelte ],
    }),
    tailwind(),
  ],
});
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

#### 🫒 Astro + React + Vue + Svelte + Tailwind
```bash
npm install @astrojs/react @astrojs/svelte @astrojs/vue @vitejs/plugin-vue
npm install olivecss magic-string node-html-parser
```

```js
// astro.config.mjs
// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import vue from "@astrojs/vue";
import vueVite from "@vitejs/plugin-vue";
import svelte from "@astrojs/svelte";
import oliveJSX, { OliveAstro, OliveVue, OliveSvelte } from 'olivecss'; // prod

const oliveAstro = await OliveAstro();
const oliveVue = await OliveVue();
const oliveSvelte = await OliveSvelte();

export default defineConfig({
  integrations: [
    react({
      babel: {
        plugins: [[ oliveJSX ]],
      },
    }), 
    vue(), 
    svelte({
      preprocess: [ oliveSvelte ],
    }),
  ],
  vite: {
    plugins: [
      oliveVue,
      oliveAstro,
      tailwindcss(),
    ],
  },
});
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

#### 🫒 Lit + Tailwind
```bash
npm install --save-dev olivecss @babel/parser @babel/traverse magic-string node-html-parser
```

```js
import { defineConfig } from "vite";
import tailwind from "@tailwindcss/vite";
import { OliveLit } from "olivecss";

const oliveLit = await OliveLit();

export default defineConfig({
  plugins: [
    oliveLit,
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
├── olive-jsx.js                # for JSX(React/Preact/Solid) integration
├── olive-vue.js                # for Vue integration
├── olive-svelte.js             # for Svelte integration
├── olive-astro.js              # for Astro integration
└── olive-lit.js                # for Lit integration

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
npm run test.unit.svelte        # Run unit tests for Svelte
...

npm run watch                   # Watch and rerun all tests
npm run watch.unit              # Watch and rerun all unit tests
npm run watch.unit.react        # Watch and rerun unit tests for React
npm run watch.unit.vue          # Watch and rerun unit tests for Vue
npm run watch.unit.svelte       # Watch and rerun unit tests for Svelte
...
```



## Dependencies
Depending on your usage environment, this project may depend on the following packages:

- [magic-string](https://www.npmjs.com/package/magic-string) — MIT License
- [@babel/traverse](https://www.npmjs.com/package/@babel/traverse) — MIT License
- [@babel/parser](https://www.npmjs.com/package/@babel/parser) — MIT License
- [@vue/compiler-sfc](https://www.npmjs.com/package/@vue/compiler-sfc) — MIT License
- [svelte/compiler](https://www.npmjs.com/package/svelte) — MIT License
- [node-html-parser](https://www.npmjs.com/package/node-html-parser) — MIT License



## Changelog
See 🫒 [CHANGELOG.md](CHANGELOG.md) file for details.



## License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright © 2025 Mun Jaehyeon