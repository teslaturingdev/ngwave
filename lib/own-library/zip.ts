import { strToU8, zipSync } from 'fflate';
import { GeneratedFile } from './generate';

/** Packages generated files at their given paths — same fflate approach as lib/batch-migrate/zip.ts. */
export function buildLibraryZip(files: GeneratedFile[]): Uint8Array {
  const entries: Record<string, Uint8Array> = {};
  for (const file of files) entries[file.path] = strToU8(file.content);
  return zipSync(entries);
}
