// olive-astro.js

let parseHTML = null;
let MagicString = null;

async function loadAstroDeps() {
  if (!parseHTML) {
    const parseHTMLModule = await import("node-html-parser");
    parseHTML = parseHTMLModule.parse;
  }
  if (!MagicString) {
    const magicStringModule = await import("magic-string");
    MagicString = magicStringModule.default;
  }
}

export async function OliveAstro() {
  await loadAstroDeps();  

  return {
    name: "vite-plugin-olivecss-astro",
    enforce: 'pre', // Run this plugin before other transformers
    transform(code, id) {
      // 1. Only process .astro files
      if (!id.endsWith('.astro')) return null;

      // 2. Extract frontmatter and markup
      const frontmatterRegex = /^---([\s\S]*?)---/;
      const frontmatterMatch = code.match(frontmatterRegex);
      const frontmatter = frontmatterMatch ? frontmatterMatch[0] : '';
      const markup = code.substring(frontmatter.length).trim();

      // 3. Parse markup using node-html-parser
      const root = parseHTML(markup, { comment: true, locationInfo: true });
      const commentNodes = [];
      const findComments = (node) => {
        if (!node) return;
        if (node.nodeType === 8) {
          commentNodes.push(node);
        }
        if (node.childNodes) {
          node.childNodes.forEach(findComments);
        }
      };
      findComments(root);

      // 4. Process comments and apply transformations to the HTML AST
      for (const commentNode of commentNodes) {
        const commentText = commentNode.rawText.trim();
        if (!commentText || commentText.startsWith("//")) continue;

        const targetElement = findTargetElement(commentNode);

        if (targetElement) {
          const consecutiveComments = collectConsecutiveComments(commentNode);
          const merged = mergeComments(consecutiveComments);

          consecutiveComments.forEach(c => c.remove());

          if (merged.class) {
            const existingClass = targetElement.getAttribute('class') || '';
            const tokens = new Set([...existingClass.split(/\s+/).filter(Boolean), ...merged.class.split(/\s+/).filter(Boolean)]);
            targetElement.setAttribute('class', Array.from(tokens).join(' '));
          }
          if (merged.style) {
            const existingStyle = targetElement.getAttribute('style') || '';
            let base = existingStyle.endsWith(';') ? existingStyle : existingStyle + ';';
            const mergedStyle = (base + ' ' + merged.style).replace(/\s*;\s*;/g, '; ').trim();
            targetElement.setAttribute('style', mergedStyle);
          }
        }
      }

      // 5. Return transformed code with sourcemap
      const transformedMarkup = root.toString();
      const ms = new MagicString(code);
      ms.overwrite(frontmatter.length, code.length, transformedMarkup);

      return {
        code: ms.toString(),
        map: ms.generateMap({ hires: true, source: id }),
      };
    },
  };
}

// Reusable core logic for comment transformation
// ... (Your existing functions: isStyleString, findTargetElement, etc.)
function isStyleString(str) {
  return /^[a-zA-Z-]+\s*:/.test(str);
}
function findTargetElement(commentNode) {
  const parent = commentNode.parentNode;
  if (!parent || !parent.childNodes) return null;
  const siblings = parent.childNodes;
  const index = siblings.indexOf(commentNode);
  for (let i = index - 1; i >= 0; i--) {
    const sib = siblings[i];
    if (sib.nodeType === 1) return sib;
    if (sib.nodeType === 3 && sib.textContent.trim() === "") continue;
    if (sib.nodeType === 8) continue;
    break;
  }
  if (parent.nodeType === 1) return parent;
  return null;
}
function collectConsecutiveComments(startCommentNode) {
  const comments = [];
  const parent = startCommentNode.parentNode;
  if (!parent || !parent.childNodes) return comments;
  const siblings = parent.childNodes;
  const startIndex = siblings.indexOf(startCommentNode);
  for (let i = startIndex; i < siblings.length; i++) {
    const node = siblings[i];
    if (node.nodeType === 8) {
      const text = node.rawText.trim();
      if (text && !text.startsWith("//")) comments.push(node);
      else break;
    } else if (node.nodeType === 3 && node.textContent.trim() === "") continue;
    else break;
  }
  return comments;
}
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
