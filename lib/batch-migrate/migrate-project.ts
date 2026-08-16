import { migrate, MigrationReport } from '@ngwave/migrate';
import { FileInput } from '@ngwave/files';

export interface MigratedFile {
  path: string;
  code: string;
  imports: string[];
  report: MigrationReport;
}

export interface ProjectTotals {
  fileCount: number;
  mappedCount: number;
  manualCount: number;
  unsupportedCount: number;
}

export interface ProjectMigrationResult {
  files: MigratedFile[];
  totals: ProjectTotals;
}

/**
 * Runs the existing, unmodified deterministic `migrate()` across every file.
 * Pure aggregation — no new migration logic, just scale.
 */
export function migrateProject(files: FileInput[]): ProjectMigrationResult {
  const migrated: MigratedFile[] = files.map((file) => {
    const result = migrate(file.content);
    return { path: file.path, code: result.code, imports: result.imports, report: result.report };
  });

  const totals: ProjectTotals = migrated.reduce(
    (acc, file) => {
      acc.mappedCount += file.report.mapped.length;
      acc.manualCount += file.report.manual.length;
      acc.unsupportedCount += file.report.unsupported.length;
      return acc;
    },
    { fileCount: migrated.length, mappedCount: 0, manualCount: 0, unsupportedCount: 0 },
  );

  return { files: migrated, totals };
}
