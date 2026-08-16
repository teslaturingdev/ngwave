import { strFromU8, unzipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { migrateProject } from './migrate-project';
import { buildMigratedZip } from './zip';

describe('buildMigratedZip', () => {
  it('packages each migrated file at its original path', () => {
    const project = migrateProject([
      { path: 'src/app/foo.html', content: '<p-button label="Save"></p-button>' },
      { path: 'src/app/bar.html', content: '<p-table [value]="rows"></p-table>' },
    ]);
    const zip = unzipSync(buildMigratedZip(project.files));

    expect(strFromU8(zip['src/app/foo.html'])).toContain('nw-button');
    expect(strFromU8(zip['src/app/bar.html'])).toContain('nw-data-table');
  });

  it('includes a _MIGRATION_NOTES.md listing imports and flagged issues', () => {
    const project = migrateProject([
      { path: 'a.html', content: '<p-table [frozenColumns]="frozen"></p-table>' },
    ]);
    const zip = unzipSync(buildMigratedZip(project.files));
    const notes = strFromU8(zip['_MIGRATION_NOTES.md']);

    expect(notes).toContain('a.html');
    expect(notes).toContain('NwDataTableComponent');
    expect(notes).toContain('frozen columns are not supported');
  });

  it('notes say fully automated when there is nothing to flag', () => {
    const project = migrateProject([{ path: 'a.html', content: '<div>plain</div>' }]);
    const zip = unzipSync(buildMigratedZip(project.files));
    const notes = strFromU8(zip['_MIGRATION_NOTES.md']);

    expect(notes).toContain('fully automated');
  });
});
