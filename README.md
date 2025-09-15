
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
  // a styling tool
</p>



```html
<div>olivecss</div> <!-- olive_is_delicious text-4xl -->
```
...results in the following:
```html
<div class="olive_is_delicious text-4xl">olivecss</div>
```

[Demo](https://rebolation.github.io/olivecss.pages) (created with Olive CSS)



## Overview
OliveCSS is an innovative tool that uses comments to simplify styling.
It automatically converts class names or style declarations written within comments into actual class or style attributes during the build process.
This approach keeps your codebase cleaner and makes maintenance easier.



## Features

- **Supports major frameworks**: React, Vue, Svelte, Astro, Solid, Preact, and Lit.
- **Provides a CLI tool**: HTML, Jekyll



## How it works

🫒 **1. You write comments**

Write your CSS rules in comments next to the elements you want to style in your components. This way, classes and styles are removed (moved into comments) from elements, giving you cleaner HTML tags.

🫒 **2. Olive CSS converts**

Olive CSS parses your code and automatically converts detected CSS comments into the appropriate `className/class` attributes and inline `style` properties.

🫒 **3. You get clean code**

Your HTML, JSX, Vue, or Svelte code now contains proper classes and styles, without manually editing attributes or creating separate CSS files.



## React Example

```jsx
export default function App() {
  return (
    <div>
      <h1>Hello Olive CSS!</h1> {/* text-xl font-bold */} {/* color: olive; */}
    </div>
  );
}
```
would become:
```jsx
...
      <h1 className="text-xl font-bold" style={{ color: "olive" }}>Hello Olive CSS!</h1>
...
```



## 🫒 CLI tool Basic Example

The `demo/cli/basic/` directory shows a simple HTML example using Olive CSS CLI.

#### Features:
- Simple HTML structure with Olive CSS comments
- Auto-detection of source directory (`src_olive`)
- Live reload web server
- Tailwind CSS support (CDN)

#### Usage:
1. Navigate to the `basic/` directory
2. Run `olive` command
3. Open `http://localhost:3000` in your browser
4. Edit files in `src_olive/` directory and see changes in real-time

#### Directory Structure:
```
demo/cli/basic/
└── src_olive/          # Source directory (watched by Olive CSS)
    ├── index.html      # Main HTML file with Olive CSS comments
    └── ...
```



## 🫒 CLI tool Jekyll Example

The `demo/cli/jekyll/` directory demonstrates how to integrate Olive CSS with Jekyll static site generator.

#### Features:
- Jekyll site with Olive CSS integration
- Custom layouts and includes
- Blog post support
- SASS support
- Tailwind CSS support (CDN)


#### Usage:
1. Navigate to the `jekyll/` directory
2. Run `olive jekyll` to watch Olive CSS files *(ruby, bundle, jekyll, and minima is needed)*
3. Open `http://localhost:3000` in your browser
4. Edit files in `olive__layouts/`, `olive__includes/`, `olive__posts/`, `olive__sass/` directories and see changes in real-time

#### Directory Structure:
```
demo/cli/jekyll/
├── olive__layouts/     # Custom layouts from minima (watched by Olive CSS)
├── olive__includes/    # Custom includes from minima (watched by Olive CSS)
├── olive__posts/       # Blog posts (watched by Olive CSS)
├── olive__sass/        # SASS files from minima (watched by Olive CSS)
├── _site/              # Generated Jekyll site
└── ...
```

#### How it works:
- Olive CSS watches files in `olive__*` directories
- Jekyll processes the Olive CSS output and generates the final site
- Both tools work together to provide live reload and static site generation



## Usage: CLI tool

```bash
npm install -g olivecss
```
#### Basic mode
```bash
olive [directories]
```
`olive` monitors directories with specific prefixes or suffixes, performs real-time transformation, and saves the results to directories with those prefixes or suffixes removed.

- prefix : `olive_` or `_`
- suffixes : `_olive` or `_`

If no directory argument is given, `olive` will auto-detect default directory in your project root.

- default directory : `src` with prefixes or suffixes (e.g., `olive_src`)

A web server with built-in live reload functionality runs at: http://localhost:3000

#### Jekyll mode
```bash
olive jekyll
```
`olive` monitors the `_includes`, `_layouts`, `_posts`, and `_sass` directories with specified prefixes or suffixes (e.g., `olive__includes`), and works alongside the Jekyll server to serve the transformed output to the browser.
Similarly, a web server with built-in live reload functionality runs at: http://localhost:3000.

To customize the Jekyll Minima theme, run `bundle info --path minima` to get the path of the theme, then copy `_includes`, `_layouts`, and `_sass` from that location and rename them as needed
```bash
bundle info --path minima
```



## Usage: Plugins

Olive CSS integrates seamlessly with popular frameworks using a minimal setup. The example configurations are shown below. 

That's all you need; no extra configuration is needed in your components.

#### 🫒 React + Tailwind

```bash
npm install --save-dev olivecss
```

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

#### 🫒 Preact + Tailwind

```bash
npm install --save-dev olivecss
```

```js
// vite.config.js
import preact from "@preact/preset-vite";
...
  plugins: [
    preact({
      babel: {
        plugins: [[ olivecss ]],
...
```

#### 🫒 Solid + Tailwind

```bash
npm install --save-dev olivecss
```

```js
// vite.config.js
import solid from 'vite-plugin-solid'
...
  plugins: [
    solid ({
      babel: {
        plugins: [[ olivecss, { framework: 'solid' } ]],
...
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
import oliveJSX, { OliveAstro, OliveVue, OliveSvelte } from 'olivecss';

const oliveAstro = await OliveAstro();
const oliveVue = await OliveVue();
const oliveSvelte = await OliveSvelte();

export default defineConfig({
  integrations: [
    oliveAstro,
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
├── cli                         # Cli tool for HTML
│   ├── cli.js                  # Main entry point (Basic mode)
│   ├── cli-jekyll.js           # Jekyll mode
│   ├── cli-utils.js            # Color utility
│   ├── cli-validators.js       # Validators for security
│   ├── cli-watcher.js          # Watcher (feat. chokidar)
│   ├── cli-webserver.js        # Webserver (feat. sirv)
│   └── cli-websocektserver.js  # WebsocketServer
├── olivecss.js                 # Main entry point exporting all plugin modules
├── olive-jsx.js                # JSX(React/Preact/Solid) Babel plugin
├── olive-vue.js                # Vue Vite plugin
├── olive-svelte.js             # Svelte preprocess plugin
├── olive-astro.js              # Astro Vite plugin and Astro integration
├── olive-lit.js                # Lit Vite plugin
└── olive-html.js               # HTML converter

demo/                           # Demo projects
tests/                          # Test files
```

#### Notes
- `cli.js` is the central entry point for `olive` command.
- `olivecss.js` is the central entry point for all plugins and preprocessors.
- Each framework-specific file contains the corresponding plugin or preprocessor implementation.
- `demo/` and `tests/` help you verify and experiment with OliveCSS features.

#### Running Tests
```bash
npm run test                    # Run all tests
npm run test.unit               # Run all unit tests
npm run test.unit.react         # Run unit tests for React
npm run test.unit.vue           # Run unit tests for Vue
npm run test.unit.svelte        # Run unit tests for Svelte
npm run test.unit.astro         # Run unit tests for Astro
...

npm run watch                   # Watch and rerun all tests
npm run watch.unit              # Watch and rerun all unit tests
npm run watch.unit.react        # Watch and rerun unit tests for React
npm run watch.unit.vue          # Watch and rerun unit tests for Vue
npm run watch.unit.svelte       # Watch and rerun unit tests for Svelte
npm run watch.unit.astro        # Watch and rerun unit tests for Astro
...
```



## Dependencies
Depending on your usage environment, this project may depend on the following packages:

- [magic-string](https://www.npmjs.com/package/magic-string) - MIT License
- [@babel/traverse](https://www.npmjs.com/package/@babel/traverse) - MIT License
- [@babel/parser](https://www.npmjs.com/package/@babel/parser) - MIT License
- [@vue/compiler-sfc](https://www.npmjs.com/package/@vue/compiler-sfc) - MIT License
- [svelte/compiler](https://www.npmjs.com/package/svelte) - MIT License
- [node-html-parser](https://www.npmjs.com/package/node-html-parser) - MIT License

Olive CSS CLI tool for HTML depend on the following packages:
- [chokidar](https://www.npmjs.com/package/chokidar) - MIT License
- [sirv](https://www.npmjs.com/package/sirv) - MIT License
- [ws](https://www.npmjs.com/package/ws) - MIT License


## Changelog
See 🫒 [CHANGELOG.md](CHANGELOG.md) file for details.



## License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright © 2025 Mun Jaehyeon