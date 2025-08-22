/**
 * OliveCSS Svelte Plugin
 *
 * Preprocessor plugin that converts comments to class/style attributes in Svelte
 */

let svelteParse = null;
let MagicString = null;

async function loadSvelteDeps() {
  if (!svelteParse) {
    const svelteCompiler = await import("svelte/compiler");
    svelteParse = svelteCompiler.parse;
  }
  if (!MagicString) {
    const magicStringModule = await import("magic-string");
    MagicString = magicStringModule.default;
  }
}

export async function OliveSvelte() {
  await loadSvelteDeps();
  return {
    name: "olivecss-svelte",
    markup({ content }) {
      const ast = svelteParse(content);
      const s = new MagicString(content);

      function walk(nodes, parent = null) {
        if (!nodes) return;

        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          node.parent = parent;

          if (node.type === "Comment") {
            const commentText = node.data.trim();
            if (!commentText || commentText.startsWith("//")) continue;

            const target = findTargetElement(node);
            if (target) {
              const consecutiveComments = collectConsecutiveComments(nodes, i);
              const merged = mergeComments(consecutiveComments);

              consecutiveComments.forEach(removeComment);

              if (merged.class) insertAttr(s, target, "class", merged.class);
              if (merged.style) insertAttr(s, target, "style", merged.style);

              i += consecutiveComments.length - 1;
            }
          }

          if (node.children) walk(node.children, node);
        }
      }

      walk(ast.html.children);

      return { code: s.toString() };
    },
  };
}

/** ───────────────────────────────
 * Determine if comment is a style (key: value format only)
 */
function isStyleString(str) {
  return /^[a-zA-Z-]+\s*:/.test(str);
}

/** ───────────────────────────────
 * Find target Element for comment application
 */
function findTargetElement(commentNode) {
  const parent = commentNode.parent;
  if (!parent || !parent.children) return null;

  const siblings = parent.children;
  const index = siblings.indexOf(commentNode);

  for (let i = index - 1; i >= 0; i--) {
    const sib = siblings[i];
    if (sib.type === "Element") return sib;
    if (sib.type === "Text" && sib.data.trim() === "") continue;
    if (sib.type === "Comment") continue;
    break;
  }

  if (parent.type === "Element") return parent;
  return null;
}

/** ───────────────────────────────
 * Insert/Merge attributes
 */
function insertAttr(s, node, attrName, value) {
  if (!node.attributes) node.attributes = [];

  const existing = node.attributes.find(a => a.name === attrName);

  if (existing) {
    // Merge with existing value
    const existingValue = (existing.value ? existing.value.map(v => v.raw || v.data).join(' ').trim() : '');
    let mergedValue;
    
    if (attrName === 'class') {
      const tokens = Array.from(new Set([...existingValue.split(/\s+/).filter(Boolean), ...value.split(/\s+/).filter(Boolean)]));
      mergedValue = tokens.join(' ');
    } else { // style
      let base = existingValue.endsWith(';') ? existingValue : existingValue + ';';
      mergedValue = (base + ' ' + value).replace(/\s*;\s*;/g, '; ').trim();
    }

    if (existing.start != null && existing.end != null) {
      s.overwrite(existing.start, existing.end, attrName + '="' + mergedValue + '"');
    } else {
      const tagText = s.slice(node.start, node.end);
      const regex = new RegExp(attrName + '=["\']([^"\']*)["\']');
      if (regex.test(tagText)) {
        const m = regex.exec(tagText);
        const attrStart = node.start + m.index;
        const attrEnd = attrStart + m[0].length;
        s.overwrite(attrStart, attrEnd, attrName + '="' + mergedValue + '"');
      } else {
        const insertPos = node.start + node.name.length + 1;
        s.appendLeft(insertPos, ' ' + attrName + '="' + mergedValue + '"');
      }
    }

    existing.value = [{ type: 'Text', data: mergedValue, raw: mergedValue }];
  } else {
    // Insert new attribute
    const insertPos = node.start + node.name.length + 1;
    s.appendLeft(insertPos, ' ' + attrName + '="' + value + '"');
    node.attributes.push({
      name: attrName,
      value: [{ type: 'Text', data: value, raw: value }],
      start: insertPos,
      end: insertPos + attrName.length + value.length + 4
    });
  }
}

/** ───────────────────────────────
 * Remove comment from AST
 */
function removeComment(comment) {
  const parent = comment.parent;
  if (!parent || !parent.children) return;
  const idx = parent.children.indexOf(comment);
  if (idx !== -1) parent.children.splice(idx, 1);
}

/** ───────────────────────────────
 * Collect consecutive comments
 */
function collectConsecutiveComments(nodes, startIndex) {
  const comments = [];

  for (let i = startIndex; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.type === "Comment") {
      const text = node.data.trim();
      if (text && !text.startsWith("//")) comments.push(node);
      else break;
    } else if (node.type === "Text" && node.data.trim() === "") continue;
    else break;
  }

  return comments;
}

/** ───────────────────────────────
 * Merge comments
 */
function mergeComments(comments) {
  const classParts = [];
  const styleParts = [];

  comments.forEach(c => {
    const text = c.data.trim();
    if (isStyleString(text)) styleParts.push(text);
    else classParts.push(text);
  });

  return {
    class: classParts.length > 0 ? classParts.join(' ') : null,
    style: styleParts.length > 0 ? styleParts.join('; ') : null
  };
}
