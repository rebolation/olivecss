/**
 * OliveCSS - Integrated Plugin
 * 
 * Plugin that converts comments to class/style in JSX, Svelte, and Vue
 */

// JSX Plugin
import OliveJSX from './olivecss-jsx.js';
export default OliveJSX; // Default export

// Svelte Plugin
export { OliveSvelte } from './olivecss-svelte.js'; // Named export

// Vue Plugin
export { OliveVue } from './olivecss-vue.js'; // Named export