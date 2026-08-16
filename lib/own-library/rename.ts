/**
 * Renames NgWave's "nw" prefix to a customer namespace across a file's full
 * text — selectors, Tailwind/CSS-var token classes, and exported identifiers
 * alike. Verified against real component source (see Design Doc): every
 * occurrence is either a standalone lowercase "nw" token (selectors, Tailwind
 * classes, CSS vars — always hyphen/quote/colon-delimited) or a capitalized
 * "Nw" immediately followed by another capital letter (every exported class,
 * type, interface, and directive follows Nw<PascalCase>).
 */

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function renamePrefix(code: string, prefix: string): string {
  const lower = prefix.toLowerCase();
  const capitalized = capitalize(lower);
  return code.replace(/\bnw\b/g, lower).replace(/\bNw(?=[A-Z])/g, capitalized);
}

/** Lowercase letters/digits/hyphens, must start with a letter, 2–30 chars. */
export function isValidPrefix(prefix: string): boolean {
  return /^[a-z][a-z0-9-]{1,29}$/.test(prefix);
}
