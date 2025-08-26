/**
 * OliveCSS Vue Plugin
 *
 * Vite plugin that converts Vue template comments to class/style attributes
 * Supports Vue 3 templates with expression preservation
 */

let vueParse = null;
let parseHTML = null;
let MagicString = null;

async function loadVueDeps() {
  if (!vueParse) {
    const vueCompilerSfc = await import("@vue/compiler-sfc");
    vueParse = vueCompilerSfc.parse;
  }
  if (!parseHTML) {
    const parseHTMLModule = await import("node-html-parser");
    parseHTML = parseHTMLModule.parse;
  }
  if (!MagicString) {
    const magicStringModule = await import("magic-string");
    MagicString = magicStringModule.default;
  }
}

export async function OliveVue() {
  await loadVueDeps();

  return {
    name: "vite-plugin-olivecss-vue",
    enforce: "pre", // Ensure this runs before other transformations
    
    transform(code, id) {
      if (!id.endsWith(".vue")) return null;

      const { descriptor } = vueParse(code);
      if (!descriptor.template) return null;

      const template = descriptor.template.content;
      const s = new MagicString(code);

      // Parse template with HTML parser
      const root = parseHTML(template, { comment: true, locationInfo: true });
      
      // Use recursive function to find comments in all nodes
      const commentNodes = [];
      function findComments(node) {
          if (!node) return;
          if (node.nodeType === 8) {
              commentNodes.push(node);
          }
          if (node.childNodes) {
              node.childNodes.forEach(child => findComments(child));
          }
      }
      findComments(root);
      
      // Process comments in reverse order to avoid offset issues
      commentNodes.reverse().forEach(commentNode => {
        const commentText = commentNode.rawText.trim();
        if (!commentText || commentText.startsWith("//")) return;
        
        // Find target element for comment application
        const targetElement = findTargetElement(commentNode);
        
        if (targetElement) {
          // Collect and merge consecutive comments
          const consecutiveComments = collectConsecutiveComments(commentNode);
          const merged = mergeComments(consecutiveComments);

          // Remove consecutive comments
          consecutiveComments.forEach(c => c.remove());

          // Apply class and style attributes
          if (merged.class) {
            insertAttr(s, targetElement, 'class', merged.class);
          }
          if (merged.style) {
            insertAttr(s, targetElement, 'style', merged.style);
          }
        }
      });

      // Get transformed template
      const transformedTemplate = root.toString();
      
      // Replace original template with transformed template
      const templateStart = descriptor.template.loc.start.offset;
      const templateEnd = descriptor.template.loc.end.offset;
      
      s.overwrite(templateStart, templateEnd, transformedTemplate);

      return {
        code: s.toString(),
        map: s.generateMap({ hires: true, source: id }),
      };
    },
  };
}

/**
 * Determine if comment is a style (key: value format only)
 */
function isStyleString(str) {
  return /^[a-zA-Z-]+\s*:/.test(str);
}

/**
 * Find target element for comment application
 * Same logic as Lit: Check previous siblings of comment node in reverse order
 */
function findTargetElement(commentNode) {
  const parent = commentNode.parentNode;
  if (!parent || !parent.childNodes) return null;

  const siblings = parent.childNodes;
  const index = siblings.indexOf(commentNode);

  // Check previous siblings in reverse order to find first element node
  for (let i = index - 1; i >= 0; i--) {
    const sibling = siblings[i];
    if (sibling.nodeType === 1) return sibling; // Element node
    if (sibling.nodeType === 3 && sibling.textContent.trim() === "") continue; // Text node (whitespace only)
    if (sibling.nodeType === 8) continue; // Comment node
    break;
  }

  // Return parent if it's an element node
  if (parent.nodeType === 1) return parent;
  return null;
}

/**
 * Collect consecutive comments
 */
function collectConsecutiveComments(startCommentNode) {
  const comments = [];
  const parent = startCommentNode.parentNode;
  if (!parent || !parent.childNodes) return comments;

  const siblings = parent.childNodes;
  const startIndex = siblings.indexOf(startCommentNode);

  for (let i = startIndex; i < siblings.length; i++) {
    const node = siblings[i];
    if (node.nodeType === 8) { // Comment node
      const text = node.rawText.trim();
      if (text && !text.startsWith("//")) comments.push(node);
      else break;
    } else if (node.nodeType === 3 && node.textContent.trim() === "") continue; // Text node (whitespace only)
    else break;
  }
  return comments;
}

/**
 * Merge comments into class/style strings
 */
function mergeComments(comments) {
  const classParts = [];
  const styleParts = [];

  comments.forEach(c => {
    const text = c.rawText.trim();
    if (isStyleString(text)) styleParts.push(text);
    else classParts.push(text);
  });

  return {
    class: classParts.length > 0 ? classParts.join(" ") : null,
    style: styleParts.length > 0 ? styleParts.join("; ") : null,
  };
}

/**
 * Insert or merge attributes for Vue environment
 * node-html-parser의 setAttribute를 사용하여 속성 처리
 */
function insertAttr(s, node, attrName, value) {
  // Adjust for node-html-parser's attribute handling method
  const existingAttr = node.getAttribute(attrName);
  
  if (existingAttr) {
    // Merge if existing attribute exists
    let mergedValue;
    
    if (attrName === 'class') {
      const tokens = Array.from(new Set([...existingAttr.split(/\s+/).filter(Boolean), ...value.split(/\s+/).filter(Boolean)]));
      mergedValue = tokens.join(' ');
    } else { // style
      let base = existingAttr.endsWith(';') ? existingAttr : existingAttr + ';';
      mergedValue = (base + ' ' + value).replace(/\s*;\s*;/g, '; ').trim();
    }
    
    // Update attribute in node-html-parser
    node.setAttribute(attrName, mergedValue);
  } else {
    // Add new attribute
    node.setAttribute(attrName, value);
  }
}