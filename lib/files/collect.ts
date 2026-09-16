/**
 * Shared folder-picker / drag-and-drop file collection — used by every
 * "point this at your whole project" tool (repo scan, whole-repo migration).
 * Pure browser file gathering; callers decide their own relevance filter.
 */

export interface CollectedFile {
  path: string;
  file: File;
}

export interface FileInput {
  path: string;
  content: string;
}

/** Reads every collected File's text content — the step every "scan/migrate my project" tool needs next. */
export async function readFileContents(files: CollectedFile[]): Promise<FileInput[]> {
  return Promise.all(files.map(async (f) => ({ path: f.path, content: await f.file.text() })));
}

export const MAX_FILES = 500;
const EXCLUDED_DIR_NAMES = ['node_modules', 'dist', '.git'];
const EXCLUDED_PATH_SEGMENTS = EXCLUDED_DIR_NAMES.map((name) => `${name}/`);

/** Default relevance check: matches the given extension, skips common noise directories. */
export function isRelevantPath(path: string, extension: string): boolean {
  if (!path.toLowerCase().endsWith(extension)) return false;
  return !EXCLUDED_PATH_SEGMENTS.some((seg) => path.includes(seg));
}

async function readDirEntry(
  entry: FileSystemEntry,
  prefix: string,
  out: CollectedFile[],
): Promise<void> {
  const path = prefix + entry.name;
  if (entry.isFile) {
    const fileEntry = entry as FileSystemFileEntry;
    const file = await new Promise<File>((resolve, reject) => fileEntry.file(resolve, reject));
    out.push({ path, file });
    return;
  }
  if (entry.isDirectory) {
    // Prune noise directories before recursing, rather than walking them and
    // filtering afterward — node_modules alone can be tens of thousands of
    // entries, so skipping the recursion (not just the eventual file) matters.
    if (EXCLUDED_DIR_NAMES.includes(entry.name)) return;
    const reader = (entry as FileSystemDirectoryEntry).createReader();
    let batch: FileSystemEntry[];
    do {
      batch = await new Promise<FileSystemEntry[]>((resolve, reject) =>
        reader.readEntries(resolve, reject),
      );
      for (const child of batch) await readDirEntry(child, path + '/', out);
    } while (batch.length > 0);
  }
}

/** Recursively collects files from a folder/files drag-and-drop event. */
export async function collectFromDataTransfer(dt: DataTransfer): Promise<CollectedFile[]> {
  const out: CollectedFile[] = [];
  const entries: FileSystemEntry[] = [];
  for (let i = 0; i < dt.items.length; i++) {
    const entry = dt.items[i].webkitGetAsEntry?.();
    if (entry) entries.push(entry);
  }
  if (entries.length) {
    for (const entry of entries) await readDirEntry(entry, '', out);
  } else {
    for (const file of Array.from(dt.files)) out.push({ path: file.name, file });
  }
  return out;
}

/**
 * Collects files from a native <input type="file"> change event.
 * `preferRelativePath` reads `webkitRelativePath` (folder pickers) and falls
 * back to the bare filename (individual-file pickers don't set it).
 */
export function collectFromFileList(
  fileList: FileList | null,
  preferRelativePath: boolean,
): CollectedFile[] {
  const files = fileList ? Array.from(fileList) : [];
  return files.map((file) => ({
    path: preferRelativePath
      ? (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name
      : file.name,
    file,
  }));
}
