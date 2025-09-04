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

        // 먼저 모든 주석을 수집
        const commentGroups = [];
        const processedComments = new Set(); // 이미 처리된 주석을 추적
        
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          node.parent = parent;

          if (node.type === "Comment") {
            const commentText = node.data.trim();
            if (!commentText || commentText.startsWith("//")) continue;

            // 이미 처리된 주석인지 확인
            if (processedComments.has(node)) continue;

            const target = findTargetElement(node);
            if (target) {
              const consecutiveComments = collectConsecutiveComments(nodes, i);
              
              // 연속된 주석들을 처리된 것으로 표시
              consecutiveComments.forEach(comment => processedComments.add(comment));
              
              commentGroups.push({ target, comments: consecutiveComments });
              i += consecutiveComments.length - 1;
            }
          }

          // 조건부 블록의 경우 children을 재귀적으로 처리
          if (node.children) walk(node.children, node);
          
          // Svelte의 조건부 블록 구조 처리
          if (node.type === "IfBlock" && node.else) {
            if (node.else.children) walk(node.else.children, node.else);
          }
          if (node.type === "EachBlock" && node.else) {
            if (node.else.children) walk(node.else.children, node.else);
          }
        }

        // 수집된 주석 그룹들을 처리
        commentGroups.forEach(({ target, comments }) => {
          const newAttrs = mergeComments(comments);

          // console.log("🐞 newAttrs: ", newAttrs);

          // 👇 The core fix: Get existing attribute values and merge them
          let allClasses = '';
          let allStyles = '';
          const attrsToRemove = [];
          const tagStartSlice = s.slice(target.start, target.end);
          
          // 기존 class, style 속성을 찾아 값 병합 및 삭제할 속성 노드 식별
          target.attributes.forEach(attr => {
            if (attr.name === 'class') {
              allClasses = (attr.value ? attr.value.map(v => v.raw || v.data).join(' ') : '');
              attrsToRemove.push(attr);
            }
            if (attr.name === 'style') {
              allStyles = (attr.value ? attr.value.map(v => v.raw || v.data).join(' ') : '');
              attrsToRemove.push(attr);
            }
          });
          
          // 최종 class/style 값 병합
          allClasses = `${allClasses} ${newAttrs.class}`.trim().split(/\s+/).filter(Boolean);
          const uniqueClasses = Array.from(new Set(allClasses)).join(' ');
          
          allStyles = `${allStyles} ${newAttrs.style}`.trim().split(';').map(s => s.trim()).filter(Boolean);
          const uniqueStyles = Array.from(new Set(allStyles)).join('; ');

          // 👇 The 'Remove and Re-add' strategy
          // 1. 기존 속성을 문자열에서 제거 (AST 노드의 정확한 위치 사용)
          attrsToRemove.forEach(attr => {
            if (attr.start != null && attr.end != null) {
              s.remove(attr.start, attr.end);
            }
          });
          
          // 2. 최종 병합된 속성들을 태그의 닫는 꺾쇠(`>`) 바로 앞에 재삽입
          let insertPos = tagStartSlice.indexOf('>') !== -1 ? target.start + tagStartSlice.indexOf('>') : target.end;

          if (uniqueClasses && uniqueClasses.trim() !== '') {
            s.appendLeft(insertPos, ` class="${uniqueClasses}"`);
          }
          if (uniqueStyles && uniqueStyles.trim() !== '') {
            s.appendLeft(insertPos, ` style="${uniqueStyles}"`);
          }

          // Don't forget to remove the comments from the string and AST
          comments.forEach(comment => {
            s.remove(comment.start, comment.end);
            removeComment(comment);
          });
        });
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

  // 먼저 같은 레벨에서 이전 엘리먼트를 찾음
  for (let i = index - 1; i >= 0; i--) {
    const sib = siblings[i];
    if (sib.type === "Element") return sib;
    if (sib.type === "Text" && sib.data.trim() === "") continue;
    if (sib.type === "Comment") continue;
    break;
  }

  // 같은 레벨에서 찾지 못했다면, 부모가 엘리먼트인지 확인
  if (parent.type === "Element") return parent;
  
  // 부모가 조건부 블록이나 다른 컨테이너인 경우, 상위로 올라가면서 찾기
  let currentParent = parent;
  while (currentParent && currentParent.parent) {
    currentParent = currentParent.parent;
    if (currentParent.type === "Element") return currentParent;
  }
  
  // 마지막으로, 주석 다음에 오는 첫 번째 엘리먼트를 찾기
  for (let i = index + 1; i < siblings.length; i++) {
    const sib = siblings[i];
    if (sib.type === "Element") return sib;
    if (sib.type === "Text" && sib.data.trim() === "") continue;
    if (sib.type === "Comment") continue;
    break;
  }
  
  return null;
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
    if (isStyleString(text)) {
      const styles = text.split(';').map(s => s.trim()).filter(Boolean);
      styleParts.push(...styles);
    } else {
      const classes = text.split(/\s+/).filter(Boolean);
      classParts.push(...classes);
    }
  });

  const uniqueClasses = Array.from(new Set(classParts));
  const uniqueStyles = Array.from(new Set(styleParts));

  return {
    class: uniqueClasses.length > 0 ? uniqueClasses.join(' ') : '',
    style: uniqueStyles.length > 0 ? uniqueStyles.join('; ') : ''
  };
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