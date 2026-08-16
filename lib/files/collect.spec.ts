import { describe, expect, it } from 'vitest';
import { isRelevantPath, readFileContents } from './collect';

describe('isRelevantPath', () => {
  it('matches the given extension', () => {
    expect(isRelevantPath('src/app/foo.html', '.html')).toBe(true);
    expect(isRelevantPath('src/app/foo.ts', '.html')).toBe(false);
  });

  it('is case-insensitive on the extension', () => {
    expect(isRelevantPath('src/app/FOO.HTML', '.html')).toBe(true);
  });

  it('excludes node_modules, dist, and .git paths', () => {
    expect(isRelevantPath('node_modules/pkg/foo.html', '.html')).toBe(false);
    expect(isRelevantPath('dist/foo.html', '.html')).toBe(false);
    expect(isRelevantPath('.git/foo.html', '.html')).toBe(false);
    expect(isRelevantPath('src/app/foo.html', '.html')).toBe(true);
  });
});

describe('readFileContents', () => {
  it('reads text content for every collected file', async () => {
    const files = [
      { path: 'a.html', file: new File(['<p-button></p-button>'], 'a.html') },
      { path: 'b.html', file: new File(['<p-table></p-table>'], 'b.html') },
    ];
    const result = await readFileContents(files);
    expect(result).toEqual([
      { path: 'a.html', content: '<p-button></p-button>' },
      { path: 'b.html', content: '<p-table></p-table>' },
    ]);
  });

  it('returns an empty array for no files', async () => {
    expect(await readFileContents([])).toEqual([]);
  });
});
