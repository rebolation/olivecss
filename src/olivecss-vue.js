/**
 * OliveCSS Vue Plugin
 *
 * Vite plugin that converts Vue template comments to class/style attributes
 * Supports Vue 3 templates
 */

let vueParse = null;
let vueBaseParse = null;
let MagicString = null;

async function loadVueDeps() {
  if (!vueParse) {
    const vueCompilerSfc = await import("@vue/compiler-sfc");
    vueParse = vueCompilerSfc.parse;
  }
  if (!vueBaseParse) {
    const vueCompilerDom = await import("@vue/compiler-dom");
    vueBaseParse = vueCompilerDom.baseParse;
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

    transform(code, id) {
      if (!id.endsWith(".vue")) return null;

      const { descriptor } = vueParse(code);
      if (!descriptor.template) return null;

      const template = descriptor.template.content;
      const ast = vueBaseParse(template);
      const s = new MagicString(template);

      function walk(nodes, parent = null) {
        if (!nodes) return;

        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          node.parent = parent;

          if (node.type === 3) { // Comment node in Vue AST
            const commentText = node.content.trim();
            if (!commentText || commentText.startsWith("//")) continue;

            const target = findTargetElement(node);
            if (target) {
              const consecutiveComments = collectConsecutiveComments(parent?.children || [], node);
              const merged = mergeComments(consecutiveComments);

              consecutiveComments.forEach(c => removeComment(s, c));

              if (merged.class) insertAttr(s, target, "class", merged.class);
              if (merged.style) insertAttr(s, target, "style", merged.style);
            }
          }

          if (node.children) walk(node.children, node);
        }
      }

      walk(ast.children);

      return {
        code: code.slice(0, descriptor.template.loc.start.offset) +
              s.toString() +
              code.slice(descriptor.template.loc.end.offset),
        map: null,
      };
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
 * Find target element for comment
 */
function findTargetElement(commentNode) {
  const parent = commentNode.parent;
  if (!parent || !parent.children) return null;

  const siblings = parent.children;
  const idx = siblings.indexOf(commentNode);

  for (let i = idx - 1; i >= 0; i--) {
    const sib = siblings[i];
    if (sib.type === 1) return sib; // Element node in Vue AST
    if (sib.type === 2 && sib.content.trim() === "") continue; // Text node
    if (sib.type === 3) continue; // Comment node
    break;
  }

  if (parent.type === 1) return parent; // Element node
  return null;
}

/** ───────────────────────────────
 * Insert or merge attributes
 */
function insertAttr(s, node, attrName, value) {
  if (!node.props) node.props = [];

  const existing = node.props.find(p => p.type === 6 && p.name === attrName);

  if (existing) {
    // Merge with existing value
    const existingValue = existing.value ? existing.value.content : "";
    let mergedValue;

    if (attrName === "class") {
      const tokens = Array.from(
        new Set([...existingValue.split(/\s+/).filter(Boolean), ...value.split(/\s+/).filter(Boolean)])
      );
      mergedValue = tokens.join(" ");
    } else { // style
      let base = existingValue.endsWith(";") ? existingValue : existingValue + ";";
      mergedValue = (base + " " + value).replace(/\s*;\s*;/g, "; ").trim();
    }

    // 문자열 기반 MagicString 교체
    const fullAttr = `${attrName}="${existingValue}"`;
    const newAttr = `${attrName}="${mergedValue}"`;
    const tagText = s.original.slice(node.loc.start.offset, node.loc.end.offset);
    const idx = tagText.indexOf(fullAttr);

    if (idx !== -1) {
      s.overwrite(node.loc.start.offset + idx, node.loc.start.offset + idx + fullAttr.length, newAttr);
    }

    existing.value.content = mergedValue;
  } else {
    // 새로운 속성 추가
    const insertPos = node.loc.start.offset + node.tag.length + 1;
    s.appendLeft(insertPos, ` ${attrName}="${value}"`);
    node.props.push({
      type: 6,
      name: attrName,
      value: { content: value },
    });
  }
}

/** ───────────────────────────────
 * Remove comment from AST
 */
function removeComment(s, commentNode) {
  s.remove(commentNode.loc.start.offset, commentNode.loc.end.offset);
}

/** ───────────────────────────────
 * Collect consecutive comments
 */
function collectConsecutiveComments(nodes, startNode) {
  const comments = [];
  const startIndex = nodes.indexOf(startNode);

  for (let i = startIndex; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.type === 3) { // Comment node in Vue AST
      const text = node.content.trim();
      if (text && !text.startsWith("//")) comments.push(node);
      else break;
    } else if (node.type === 2 && node.content.trim() === "") continue; // Text node
    else break;
  }
  return comments;
}

/** ───────────────────────────────
 * Merge comments into class/style strings
 */
function mergeComments(comments) {
  const classParts = [];
  const styleParts = [];

  comments.forEach(c => {
    const text = c.content.trim();
    if (isStyleString(text)) styleParts.push(text);
    else classParts.push(text);
  });

  return {
    class: classParts.length > 0 ? classParts.join(" ") : null,
    style: styleParts.length > 0 ? styleParts.join("; ") : null,
  };
}
