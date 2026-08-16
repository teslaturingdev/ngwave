import { describe, expect, it } from 'vitest';
import { migrateProject } from './migrate-project';

describe('migrateProject', () => {
  it('migrates every file independently, preserving path', () => {
    const result = migrateProject([
      { path: 'a.html', content: '<p-button label="Save"></p-button>' },
      { path: 'b.html', content: '<p-table [value]="rows"></p-table>' },
    ]);
    expect(result.files.map((f) => f.path)).toEqual(['a.html', 'b.html']);
    expect(result.files[0].code).toContain('nw-button');
    expect(result.files[1].code).toContain('nw-data-table');
  });

  it('surfaces imports needed per file', () => {
    const result = migrateProject([{ path: 'a.html', content: '<p-button label="Save"></p-button>' }]);
    expect(result.files[0].imports).toContain('NwButtonComponent');
  });

  it('aggregates mapped/manual/unsupported totals across all files', () => {
    const result = migrateProject([
      { path: 'a.html', content: '<p-table [frozenColumns]="frozen"></p-table>' },
      { path: 'b.html', content: '<p-button label="Save"></p-button>' },
    ]);
    expect(result.totals.fileCount).toBe(2);
    expect(result.totals.unsupportedCount).toBeGreaterThan(0); // frozenColumns
    expect(result.totals.mappedCount).toBeGreaterThan(0); // label → label
  });

  it('returns zeroed totals for an empty project', () => {
    const result = migrateProject([]);
    expect(result.files).toEqual([]);
    expect(result.totals).toEqual({
      fileCount: 0,
      mappedCount: 0,
      manualCount: 0,
      unsupportedCount: 0,
    });
  });

  it('leaves files with no PrimeNG markup unchanged', () => {
    const result = migrateProject([{ path: 'a.html', content: '<div>plain</div>' }]);
    expect(result.files[0].code).toBe('<div>plain</div>');
    expect(result.files[0].imports).toEqual([]);
  });
});
