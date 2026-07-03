// Parses a verbatim CSS declaration string ("a:b;c:d") into a React style object.
// Lets us port the original x-dc inline styles 1:1 without hand-converting each
// property to camelCase. Cached because the same static strings recur constantly.
const cache = new Map();

function toCamel(prop) {
  const p = prop.trim();
  // Preserve CSS custom properties (--var) as-is.
  if (p.startsWith('--')) return p;
  return p.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

export function cx(css) {
  if (css == null) return undefined;
  if (typeof css !== 'string') return css; // already an object
  const hit = cache.get(css);
  if (hit) return hit;

  const obj = {};
  // Split on ';' that are not inside parentheses (e.g. rgba(), url(), clamp()).
  let depth = 0;
  let start = 0;
  const decls = [];
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (ch === ';' && depth === 0) {
      decls.push(css.slice(start, i));
      start = i + 1;
    }
  }
  decls.push(css.slice(start));

  for (const decl of decls) {
    if (!decl.trim()) continue;
    const idx = decl.indexOf(':');
    if (idx === -1) continue;
    const prop = decl.slice(0, idx);
    const val = decl.slice(idx + 1).trim();
    if (!prop.trim()) continue;
    obj[toCamel(prop)] = val;
  }

  cache.set(css, obj);
  return obj;
}
