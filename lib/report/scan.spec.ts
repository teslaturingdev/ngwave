import { describe, expect, it } from 'vitest';
import { scanFiles } from './scan';

describe('scanFiles', () => {
  it('counts opening tags once, ignoring closing tags', () => {
    const result = scanFiles([
      {
        path: 'a.html',
        content: `<p-button label="x"></p-button><p-button label="y"></p-button>`,
      },
    ]);
    const button = result.tags.find((t) => t.tag === 'p-button');
    expect(button?.count).toBe(2);
    expect(button?.kind).toBe('element');
  });

  it('counts self-closing elements', () => {
    const result = scanFiles([{ path: 'a.html', content: `<p-toast position="top-right" />` }]);
    expect(result.tags.find((t) => t.tag === 'p-toast')?.count).toBe(1);
  });

  it('counts attribute directives', () => {
    const result = scanFiles([
      { path: 'a.html', content: `<input pInputText /><button pButton>Go</button>` },
    ]);
    expect(result.tags.find((t) => t.tag === 'pInputText')?.count).toBe(1);
    expect(result.tags.find((t) => t.tag === 'pButton')?.count).toBe(1);
  });

  it('aggregates counts and file lists across multiple files', () => {
    const result = scanFiles([
      { path: 'a.html', content: `<p-table></p-table>` },
      { path: 'b.html', content: `<p-table></p-table><p-table></p-table>` },
    ]);
    const table = result.tags.find((t) => t.tag === 'p-table');
    expect(table?.count).toBe(3);
    expect(table?.files.sort()).toEqual(['a.html', 'b.html']);
    expect(result.fileCount).toBe(2);
    expect(result.totalOccurrences).toBe(3);
  });

  it('does not double-count a file that repeats a tag in its files list', () => {
    const result = scanFiles([{ path: 'a.html', content: `<p-button></p-button><p-button></p-button>` }]);
    const button = result.tags.find((t) => t.tag === 'p-button');
    expect(button?.files).toEqual(['a.html']);
  });

  it('captures tags with no NgWave adapter at all (e.g. p-calendar)', () => {
    const result = scanFiles([{ path: 'a.html', content: `<p-calendar></p-calendar>` }]);
    expect(result.tags.find((t) => t.tag === 'p-calendar')?.count).toBe(1);
  });

  it('sorts tags by count descending', () => {
    const result = scanFiles([
      {
        path: 'a.html',
        content: `<p-button></p-button><p-table></p-table><p-table></p-table><p-table></p-table>`,
      },
    ]);
    expect(result.tags[0].tag).toBe('p-table');
  });

  it('returns empty result for files with no PrimeNG usage', () => {
    const result = scanFiles([{ path: 'a.html', content: `<div class="plain"></div>` }]);
    expect(result.tags).toEqual([]);
    expect(result.totalOccurrences).toBe(0);
  });
});
