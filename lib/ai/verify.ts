/**
 * Lightweight verification of AI output — no Angular compiler in the browser/function,
 * so we check the cheap, high-signal invariant: no PrimeNG p-* elements or pInput* /
 * pButton attribute directives should remain. Returns the leftover tags (empty = clean).
 */
export function findLeftoverPrimeng(html: string): string[] {
  const found = new Set<string>();

  // Elements: <p-table>, </p-button>, <p-dropdown ...>
  const elementRe = /<\/?\s*(p-[a-zA-Z][\w-]*)/g;
  let m: RegExpExecArray | null;
  while ((m = elementRe.exec(html))) found.add(m[1]);

  // Attribute directives: pInputText, pInputTextarea, pButton, pTemplate
  const attrRe = /\b(pInputText|pInputTextarea|pButton|pTemplate|pRipple|pTooltip)\b/g;
  while ((m = attrRe.exec(html))) found.add(m[1]);

  return [...found];
}
