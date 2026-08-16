/**
 * Broad PrimeNG usage scanner — counts every p-* element and known attribute
 * directive across a set of files, INCLUDING tags @ngwave/migrate has no
 * adapter for. migrate() only reports what it can classify (see
 * SUPPORTED_PRIMENG_TAGS); this fills the gap so the inventory reflects the
 * whole codebase, not just the part NgWave already supports.
 */

export interface FileInput {
  path: string;
  content: string;
}

export interface TagUsage {
  tag: string;
  kind: 'element' | 'attribute';
  count: number;
  files: string[];
}

export interface ScanResult {
  tags: TagUsage[];
  fileCount: number;
  totalOccurrences: number;
}

const ATTR_DIRECTIVES = [
  'pInputText',
  'pInputTextarea',
  'pButton',
  'pTemplate',
  'pRipple',
  'pTooltip',
];

interface RawCounts {
  elements: Map<string, number>;
  attributes: Map<string, number>;
}

function countInFile(content: string): RawCounts {
  const elements = new Map<string, number>();
  const attributes = new Map<string, number>();

  // Elements: count opening tags only (`<p-table`), skip closing tags
  // (`</p-table`) so each element instance is counted once.
  const elementRe = /<(\/)?\s*(p-[a-zA-Z][\w-]*)/g;
  let m: RegExpExecArray | null;
  while ((m = elementRe.exec(content))) {
    if (m[1]) continue;
    const tag = m[2];
    elements.set(tag, (elements.get(tag) ?? 0) + 1);
  }

  const attrRe = new RegExp(`\\b(${ATTR_DIRECTIVES.join('|')})\\b`, 'g');
  while ((m = attrRe.exec(content))) {
    const name = m[1];
    attributes.set(name, (attributes.get(name) ?? 0) + 1);
  }

  return { elements, attributes };
}

function addUsage(
  merged: Map<string, TagUsage>,
  tag: string,
  kind: 'element' | 'attribute',
  count: number,
  filePath: string,
): void {
  const existing = merged.get(tag);
  if (existing) {
    existing.count += count;
    if (!existing.files.includes(filePath)) existing.files.push(filePath);
  } else {
    merged.set(tag, { tag, kind, count, files: [filePath] });
  }
}

export function scanFiles(files: FileInput[]): ScanResult {
  const merged = new Map<string, TagUsage>();
  let totalOccurrences = 0;

  for (const file of files) {
    const { elements, attributes } = countInFile(file.content);
    for (const [tag, count] of elements) {
      addUsage(merged, tag, 'element', count, file.path);
      totalOccurrences += count;
    }
    for (const [tag, count] of attributes) {
      addUsage(merged, tag, 'attribute', count, file.path);
      totalOccurrences += count;
    }
  }

  const tags = [...merged.values()].sort((a, b) => b.count - a.count);
  return { tags, fileCount: files.length, totalOccurrences };
}
