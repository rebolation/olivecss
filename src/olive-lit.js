/**
 * OliveCSS Lit Plugin
 *
 * Vite plugin that converts Lit template comments to class/style attributes
 * Supports Lit template literals
 */

let traverse = null;
let babelParser = null;
let parseHTML = null;
let MagicString = null;

async function loadLitDeps() {
  if (!traverse) {
    const traverseModule = await import("@babel/traverse");
    traverse = traverseModule.default.default;
  }  
  if (!babelParser) {
    const babelParserModule = await import("@babel/parser");
    babelParser = babelParserModule.parse;
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

export async function OliveLit() {
  await loadLitDeps();  

  return {
    name: "vite-plugin-olivecss-lit",
    enforce: "pre",
    transform(source, id) {
      if (!id.endsWith(".js") && !id.endsWith(".ts")) return null;
      if (!source.includes("html`")) return null;

      const ast = babelParser(source, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript', 'decorators'] // Add plugins needed for Lit code
      });      


      // Collect template literals
      const templates = [];
      
      traverse(ast, {
        TaggedTemplateExpression(path) {
          const node = path.node;
          if (node.tag.type !== 'Identifier' || node.tag.name !== 'html') {
            return;
          }
          
          templates.push({ path, node });
        }
      });
      
      // Process template literals in reverse order
      const ms = new MagicString(source);
      
      for (let i = templates.length - 1; i >= 0; i--) {
        const { path, node } = templates[i];
        const quasi = node.quasi;
        const parts = [];
      
        // 2. Reconstruct string using quasi and expressions
        let currentOffset = 0;
        for (let j = 0; j < quasi.quasis.length; j++) {
          const quasiPart = quasi.quasis[j];
          const expressionPart = quasi.expressions[j];
          
          const staticString = quasiPart.value.raw;
          parts.push(staticString);
          currentOffset += staticString.length;
      
          if (expressionPart) {
            const dynamicCode = source.substring(expressionPart.start, expressionPart.end);
            parts.push(`\${${dynamicCode}}`);
            currentOffset += `\${${dynamicCode}}`.length;
          }
        }
        const fullTemplateString = parts.join('');
    
        // 3. Parse and transform reconstructed string
        const root = parseHTML(fullTemplateString, { comment: true, locationInfo: true });
        
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
        
        commentNodes.forEach(commentNode => {
          const commentText = commentNode.rawText.trim();
          if (!commentText || commentText.startsWith("//")) return;
          
          // findTargetElement logic - Apply same pattern as Vue/Svelte
          const targetElement = findTargetElement(commentNode);
          
          if (targetElement) {
            // Collect and merge consecutive comments
            const consecutiveComments = collectConsecutiveComments(commentNode);
            const merged = mergeComments(consecutiveComments);

            // Remove consecutive comments
            consecutiveComments.forEach(c => c.remove());

            // Apply class and style attributes
            if (merged.class) {
              insertAttr(ms, targetElement, 'class', merged.class);
            }
            if (merged.style) {
              insertAttr(ms, targetElement, 'style', merged.style);
            }
          }
        });

        const transformedString = root.toString();
        
        // Apply transformed string to original template
        const originalContent = source.substring(quasi.start + 1, quasi.end - 1);
        const transformedContent = transformedString;
        
        // Use magic-string to replace original template part with transformed content
        ms.overwrite(quasi.start + 1, quasi.end - 1, transformedContent);
      }
      
      return {
        code: ms.toString(),
        map: ms.generateMap({ hires: true, source: id }),
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
 * Same logic as Vue/Svelte: Check previous siblings of comment node in reverse order
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
 * Insert or merge attributes for Lit environment
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

