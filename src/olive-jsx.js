/**
 * OliveCSS JSX Plugin
 *
 * Babel plugin that converts JSX comments to class/style attributes
 * Supports React and SolidJS
 */

export default function ({ types: t }, options = {}) {
  const framework = options.framework || "react";

  return {
    name: "olivecss-jsx",
    visitor: {
      Program(path) {
        const commentPaths = [];

        // Find JSX comments
        path.traverse({
          JSXExpressionContainer(commentPath) {
            if (
              commentPath.node.expression &&
              t.isJSXEmptyExpression(commentPath.node.expression) &&
              commentPath.node.expression.innerComments &&
              commentPath.node.expression.innerComments.length > 0
            ) {
              commentPaths.push(commentPath);
            }
          },
        });

        for (const commentPath of commentPaths) {
          const targetElement = findTargetJSXElement(commentPath, t);
          if (!targetElement) continue;

          const rawComments = (commentPath.node.expression.innerComments || [])
            .map((c) => c.value.trim())
            .filter(Boolean);

          const classParts = [];
          const styleParts = [];

          for (const str of rawComments) {
            const trimmed = str.trim();
            if (!trimmed || trimmed.startsWith("//")) continue;

            if (isStyleString(trimmed)) styleParts.push(trimmed);
            else classParts.push(...trimmed.split(/\s+/));
          }

          if (classParts.length > 0) addClassName(targetElement, classParts, t);
          if (styleParts.length > 0) addStyle(targetElement, styleParts, t, framework);

          commentPath.remove();
        }
      },
    },
  };
}

/** ─────────────── Helpers ─────────────── */

function isStyleString(str) {
  return /^[a-zA-Z-]+\s*:/.test(str);
}

function findTargetJSXElement(commentPath, t) {
  if (!commentPath.parentPath) return null;

  const siblings = commentPath.parentPath.get("children");
  if (!Array.isArray(siblings)) return null;

  const commentIndex = siblings.findIndex((s) => s.node === commentPath.node);
  if (commentIndex <= 0) return null;

  for (let i = commentIndex - 1; i >= 0; i--) {
    const sibling = siblings[i];
    if (sibling.isJSXText() && sibling.node.value.trim() === "") continue;
    if (
      sibling.isJSXExpressionContainer() &&
      sibling.node.expression &&
      t.isJSXEmptyExpression(sibling.node.expression) &&
      sibling.node.expression.innerComments
    )
      continue;
    if (sibling.isJSXElement()) return sibling.node.openingElement;
    if (sibling.isJSXFragment()) {
      const fragmentChildren = sibling.node.children;
      if (Array.isArray(fragmentChildren)) {
        for (let j = fragmentChildren.length - 1; j >= 0; j--) {
          const fragmentChild = fragmentChildren[j];
          if (t.isJSXElement(fragmentChild)) return fragmentChild.openingElement;
        }
      }
      continue;
    }
    break;
  }

  if (commentPath.parentPath.isJSXElement()) return commentPath.parentPath.node.openingElement;
  return null;
}

function addClassName(openingElement, classNames, t) {
  if (!classNames || classNames.length === 0) return;

  let targetAttr = openingElement.attributes.find(
    (a) =>
      t.isJSXAttribute(a) &&
      (a.name.name === "className" || a.name.name === "class")
  );

  const attrName = targetAttr?.name?.name || "className";

  if (!targetAttr) {
    targetAttr = t.jsxAttribute(
      t.jsxIdentifier(attrName),
      t.stringLiteral(classNames.join(" "))
    );
    openingElement.attributes.push(targetAttr);
    return;
  }

  const val = targetAttr.value;
  if (t.isStringLiteral(val)) {
    const tokens = val.value.trim() ? val.value.trim().split(/\s+/) : [];
    const merged = Array.from(new Set([...tokens, ...classNames]));
    targetAttr.value = t.stringLiteral(merged.join(" ").trim());
    return;
  }

  if (t.isJSXExpressionContainer(val)) {
    const expr = val.expression;
    targetAttr.value = t.jsxExpressionContainer(
      t.binaryExpression("+", t.binaryExpression("+", expr, t.stringLiteral(" ")), t.stringLiteral(classNames.join(" ")))
    );
    return;
  }

  targetAttr.value = t.stringLiteral(classNames.join(" "));
}

/**
 * Add or merge style attribute
 * @param {JSXOpeningElement} openingElement
 * @param {string[]} styleStrings
 * @param {object} t
 * @param {"react"|"solid"|"..."} framework
 */
function addStyle(openingElement, styleStrings, t, framework = "react") {
  if (!styleStrings || styleStrings.length === 0) return;

  let styleAttr = openingElement.attributes.find(
    (a) => t.isJSXAttribute(a) && a.name.name === "style"
  );

  const styleObjProperties = [];

  for (const styleString of styleStrings) {
    const pairs = styleString.split(";").map((s) => s.trim()).filter(Boolean);
    for (const pair of pairs) {
      const [rawKey, rawVal] = pair.split(":").map((s) => s.trim());
      if (!rawKey || !rawVal) continue;

      const key = framework === "react"
        ? rawKey.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
        : rawKey;

      const objKey = framework === "react" ? t.identifier(key) : t.stringLiteral(key);
      const cleanVal = rawVal.replace(/^['"]|['"]$/g, "");
      styleObjProperties.push(t.objectProperty(objKey, t.stringLiteral(cleanVal)));
    }
  }

  if (!styleAttr) {
    styleAttr = t.jsxAttribute(
      t.jsxIdentifier("style"),
      t.jsxExpressionContainer(t.objectExpression(styleObjProperties))
    );
    openingElement.attributes.push(styleAttr);
    return;
  }

  const val = styleAttr.value;
  if (t.isJSXExpressionContainer(val) && t.isObjectExpression(val.expression)) {
    styleAttr.value = t.jsxExpressionContainer(
      t.objectExpression([...val.expression.properties, ...styleObjProperties])
    );
  } else if (t.isStringLiteral(val)) {
    const existingPairs = val.value.split(";").map((s) => s.trim()).filter(Boolean);
    const existingProps = existingPairs.map((pair) => {
      const [k, v] = pair.split(":").map((s) => s.trim());
      const key = framework === "react" ? k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) : k;
      const objKey = framework === "react" ? t.identifier(key) : t.stringLiteral(key);
      return t.objectProperty(objKey, t.stringLiteral(v));
    });
    styleAttr.value = t.jsxExpressionContainer(
      t.objectExpression([...existingProps, ...styleObjProperties])
    );
  } else {
    styleAttr.value = t.jsxExpressionContainer(
      t.objectExpression(styleObjProperties)
    );
  }
}
