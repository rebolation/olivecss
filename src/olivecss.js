/**
 * OliveCSS - Integrated Plugin
 * 
 * Plugin that converts comments to class/style in JSX, Svelte, and Vue
 */

// JSX Plugin
import OliveJSX from './olive-jsx.js';
export default OliveJSX; // Default export

// Vue Plugin
export { OliveVue } from './olive-vue.js'; // Named export

// Svelte Plugin
export { OliveSvelte } from './olive-svelte.js'; // Named export

// Astro Plugin
export { OliveAstro } from './olive-astro.js'; // Named export

// Lit Plugin
export { OliveLit } from './olive-lit.js'; // Named export