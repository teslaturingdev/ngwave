import { describe, expect, it } from 'vitest';
import { FOLDER_FILES, resolveFolders, TAG_TO_FOLDER } from './component-map';

describe('resolveFolders', () => {
  it('maps a direct PrimeNG tag to its folder', () => {
    const result = resolveFolders(['p-button']);
    expect(result).toEqual([{ folder: 'button', direct: true }]);
  });

  it('pulls in button as a dependency when dialog is used, without direct p-button usage', () => {
    const result = resolveFolders(['p-dialog']);
    expect(result).toContainEqual({ folder: 'dialog', direct: true });
    expect(result).toContainEqual({ folder: 'button', direct: false });
  });

  it('marks button as direct if both p-dialog and p-button are used', () => {
    const result = resolveFolders(['p-dialog', 'p-button']);
    expect(result).toContainEqual({ folder: 'button', direct: true });
  });

  it('maps multiple tags to the same folder without duplicates', () => {
    const result = resolveFolders(['p-progressSpinner', 'p-skeleton']);
    expect(result).toEqual([{ folder: 'spinner', direct: true }]);
  });

  it('ignores tags with no known NgWave mapping', () => {
    const result = resolveFolders(['p-calendar', 'p-chart']);
    expect(result).toEqual([]);
  });

  it('returns an empty list for no tags', () => {
    expect(resolveFolders([])).toEqual([]);
  });
});

describe('component-map data integrity', () => {
  it('every mapped folder has a known file list', () => {
    for (const folder of Object.values(TAG_TO_FOLDER)) {
      expect(FOLDER_FILES[folder], `missing FOLDER_FILES entry for "${folder}"`).toBeDefined();
    }
  });
});
