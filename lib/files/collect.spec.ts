import { describe, expect, it, vi } from 'vitest';
import { collectFromDataTransfer, isRelevantPath, readFileContents } from './collect';

function fakeFileEntry(name: string): FileSystemEntry {
  return {
    name,
    isFile: true,
    isDirectory: false,
    file(success: (f: File) => void) {
      success(new File(['content'], name));
    },
  } as unknown as FileSystemEntry;
}

function fakeDirEntry(
  name: string,
  children: FileSystemEntry[],
): { entry: FileSystemEntry; readEntries: ReturnType<typeof vi.fn> } {
  const readEntries = vi.fn((success: (entries: FileSystemEntry[]) => void) => {
    // Simulate the browser's batched readEntries: return everything once,
    // then an empty array to signal the directory is exhausted.
    if (readEntries.mock.calls.length === 1) {
      success(children);
    } else {
      success([]);
    }
  });
  const entry = {
    name,
    isFile: false,
    isDirectory: true,
    createReader: () => ({ readEntries }),
  } as unknown as FileSystemEntry;
  return { entry, readEntries };
}

function fakeDataTransfer(entries: FileSystemEntry[]): DataTransfer {
  return {
    items: entries.map((entry) => ({ webkitGetAsEntry: () => entry })),
    files: [],
  } as unknown as DataTransfer;
}

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

describe('collectFromDataTransfer', () => {
  it('collects files from nested directories', async () => {
    const { entry } = fakeDirEntry('src', [fakeFileEntry('app.component.ts')]);
    const result = await collectFromDataTransfer(fakeDataTransfer([entry]));
    expect(result.map((f) => f.path)).toEqual(['src/app.component.ts']);
  });

  it('prunes node_modules/dist/.git directories without recursing into them', async () => {
    const nodeModules = fakeDirEntry('node_modules', [fakeFileEntry('should-not-appear.js')]);
    const dist = fakeDirEntry('dist', [fakeFileEntry('should-not-appear.js')]);
    const gitDir = fakeDirEntry('.git', [fakeFileEntry('should-not-appear')]);
    const src = fakeDirEntry('src', [fakeFileEntry('app.component.ts')]);

    const result = await collectFromDataTransfer(
      fakeDataTransfer([nodeModules.entry, dist.entry, gitDir.entry, src.entry]),
    );

    expect(result.map((f) => f.path)).toEqual(['src/app.component.ts']);
    // The pruned directories' readers must never even be asked for entries.
    expect(nodeModules.readEntries).not.toHaveBeenCalled();
    expect(dist.readEntries).not.toHaveBeenCalled();
    expect(gitDir.readEntries).not.toHaveBeenCalled();
    expect(src.readEntries).toHaveBeenCalled();
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
