import { AttrKind, ParsedAttr } from './types.js';

export interface FoundElement {
  /** Index of the opening `<`. */
  start: number;
  /** Index just past the opening tag's `>`. */
  end: number;
  /** Raw text of the attributes region (between tag name and `>`). */
  attrsText: string;
  selfClosing: boolean;
}

const NAME_BOUNDARY = /[\s/>]/;

function classifyName(rawName: string): { kind: AttrKind; name: string } {
  if (rawName.startsWith('[(') && rawName.endsWith(')]')) {
    return { kind: 'twoway', name: rawName.slice(2, -2) };
  }
  if (rawName.startsWith('[') && rawName.endsWith(']')) {
    return { kind: 'input', name: rawName.slice(1, -1) };
  }
  if (rawName.startsWith('(') && rawName.endsWith(')')) {
    return { kind: 'output', name: rawName.slice(1, -1) };
  }
  if (rawName.startsWith('*')) {
    return { kind: 'structural', name: rawName.slice(1) };
  }
  if (rawName.startsWith('#')) {
    return { kind: 'ref', name: rawName.slice(1) };
  }
  return { kind: 'plain', name: rawName };
}

/** Parse the attribute region of an opening tag into structured attributes. */
export function parseAttributes(attrsText: string): ParsedAttr[] {
  const attrs: ParsedAttr[] = [];
  let i = 0;
  const len = attrsText.length;

  while (i < len) {
    // skip whitespace
    while (i < len && /\s/.test(attrsText[i])) i++;
    if (i >= len) break;

    const nameStart = i;
    while (i < len && !NAME_BOUNDARY.test(attrsText[i]) && attrsText[i] !== '=') {
      i++;
    }
    const rawName = attrsText.slice(nameStart, i);
    if (!rawName) {
      i++;
      continue;
    }

    // optional = value
    let value: string | undefined;
    let quote: '"' | "'" = '"';
    let after = i;
    while (after < len && /\s/.test(attrsText[after])) after++;
    if (attrsText[after] === '=') {
      after++;
      while (after < len && /\s/.test(attrsText[after])) after++;
      const q = attrsText[after];
      if (q === '"' || q === "'") {
        quote = q;
        after++;
        const valStart = after;
        while (after < len && attrsText[after] !== q) after++;
        value = attrsText.slice(valStart, after);
        after++; // consume closing quote
      }
      i = after;
    }

    const { kind, name } = classifyName(rawName);
    const raw =
      value !== undefined ? `${rawName}=${quote}${value}${quote}` : rawName;
    attrs.push({ kind, name, value, quote, raw });
  }

  return attrs;
}

/** Rebuild an attribute string from its parts. */
export function serializeAttr(
  kind: AttrKind,
  name: string,
  value: string | undefined,
  quote: '"' | "'" = '"',
): string {
  const q = value !== undefined && value.includes('"') ? "'" : quote;
  const val = value !== undefined ? `=${q}${value}${q}` : '';
  switch (kind) {
    case 'input':
      return `[${name}]${val}`;
    case 'output':
      return `(${name})${val}`;
    case 'twoway':
      return `[(${name})]${val}`;
    case 'structural':
      return `*${name}${val}`;
    case 'ref':
      return `#${name}${val}`;
    case 'plain':
      return value !== undefined ? `${name}${val}` : name;
  }
}

/** Advance past the end of an opening tag starting at `<`, honoring quotes. */
function readOpeningTag(
  src: string,
  ltIndex: number,
): { end: number; attrsText: string; selfClosing: boolean } | null {
  let i = ltIndex + 1;
  // skip tag name
  while (i < src.length && !NAME_BOUNDARY.test(src[i])) i++;
  const attrsStart = i;
  let quote: string | null = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
    } else if (c === '>') {
      const before = src.slice(attrsStart, i).trimEnd();
      const selfClosing = before.endsWith('/');
      const attrsText = selfClosing ? before.slice(0, -1) : before;
      return { end: i + 1, attrsText, selfClosing };
    }
  }
  return null;
}

/** Find all elements with the given tag name (case-sensitive). */
export function findElements(src: string, tagName: string): FoundElement[] {
  const results: FoundElement[] = [];
  const needle = `<${tagName}`;
  let from = 0;
  while (true) {
    const idx = src.indexOf(needle, from);
    if (idx === -1) break;
    const next = src[idx + needle.length];
    // ensure it's a full tag name match (next char is a boundary)
    if (next !== undefined && !NAME_BOUNDARY.test(next)) {
      from = idx + needle.length;
      continue;
    }
    const tag = readOpeningTag(src, idx);
    if (!tag) break;
    results.push({
      start: idx,
      end: tag.end,
      attrsText: tag.attrsText,
      selfClosing: tag.selfClosing,
    });
    from = tag.end;
  }
  return results;
}

/**
 * Given the index just past an opening tag, find the index of its matching
 * closing `</tagName>`, accounting for nested same-name elements.
 */
export function findMatchingClose(
  src: string,
  tagName: string,
  fromIndex: number,
): number {
  const open = `<${tagName}`;
  const close = `</${tagName}>`;
  let depth = 0;
  let i = fromIndex;
  while (i < src.length) {
    const nextOpen = src.indexOf(open, i);
    const nextClose = src.indexOf(close, i);
    if (nextClose === -1) return -1;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      const boundary = src[nextOpen + open.length];
      if (boundary !== undefined && !NAME_BOUNDARY.test(boundary)) {
        i = nextOpen + open.length;
        continue;
      }
      const tag = readOpeningTag(src, nextOpen);
      if (tag && !tag.selfClosing) depth++;
      i = tag ? tag.end : nextOpen + open.length;
    } else {
      if (depth === 0) return nextClose;
      depth--;
      i = nextClose + close.length;
    }
  }
  return -1;
}

export function hasPlainAttr(attrs: ParsedAttr[], name: string): boolean {
  return attrs.some((a) => a.kind === 'plain' && a.name === name);
}
