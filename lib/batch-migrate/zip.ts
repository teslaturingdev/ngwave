import { strToU8, zipSync } from 'fflate';
import { MigratedFile } from './migrate-project';

/**
 * The offline equivalent of what /migrate shows inline for a single file —
 * needs to travel with the zip since there's no page left to look back at
 * once it's downloaded.
 */
function buildNotes(files: MigratedFile[]): string {
  const lines: string[] = ['# Migration Notes', ''];
  for (const file of files) {
    const hasNotes =
      file.imports.length || file.report.manual.length || file.report.unsupported.length;
    if (!hasNotes) continue;

    lines.push(`## ${file.path}`, '');
    if (file.imports.length) {
      lines.push(`**Add to your component imports:** ${file.imports.join(', ')}`, '');
    }
    if (file.report.unsupported.length) {
      lines.push('**Unsupported:**');
      for (const msg of file.report.unsupported) lines.push(`- ${msg}`);
      lines.push('');
    }
    if (file.report.manual.length) {
      lines.push('**Needs manual review:**');
      for (const msg of file.report.manual) lines.push(`- ${msg}`);
      lines.push('');
    }
  }
  if (lines.length === 2) lines.push('Nothing needs manual attention — fully automated.');
  return lines.join('\n');
}

/** Packages migrated files at their original relative paths, plus a summary note. */
export function buildMigratedZip(files: MigratedFile[]): Uint8Array {
  const entries: Record<string, Uint8Array> = {};
  for (const file of files) {
    entries[file.path] = strToU8(file.code);
  }
  entries['_MIGRATION_NOTES.md'] = strToU8(buildNotes(files));
  return zipSync(entries);
}
