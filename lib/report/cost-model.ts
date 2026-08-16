import { migrate, SUPPORTED_PRIMENG_ATTR_DIRECTIVES, SUPPORTED_PRIMENG_TAGS } from '@ngwave/migrate';
import { getMaterialMapping, MaterialMapping } from './material-map';
import { FileInput, scanFiles, TagUsage } from './scan';

export type EffortTier = 'Small' | 'Medium' | 'Large';

export interface DestinationSummary {
  /** Occurrence-weighted 0–100 automation score (see buildCostReport for the weighting). */
  automatedPct: number;
  mappedCount: number;
  partialOrManualCount: number;
  unsupportedCount: number;
}

export interface ComponentCostRow extends TagUsage {
  ngwave: { hasAdapter: boolean };
  material: MaterialMapping;
}

export interface OwnCdkEstimate {
  tier: EffortTier;
  hoursRange: string;
  distinctComponents: number;
}

export interface CostReport {
  fileCount: number;
  totalOccurrences: number;
  rows: ComponentCostRow[];
  ngwaveSummary: DestinationSummary;
  materialSummary: DestinationSummary;
  ownCdk: OwnCdkEstimate;
  /** Deduped manual/unsupported notes from running the real deterministic engine — the
   *  prop-level detail a pure tag count can't give (e.g. "frozenColumns not supported"). */
  ngwaveNotes: string[];
}

const KNOWN_NGWAVE_TAGS = new Set([
  ...SUPPORTED_PRIMENG_TAGS,
  ...SUPPORTED_PRIMENG_ATTR_DIRECTIVES,
]);

const MATERIAL_CREDIT: Record<MaterialMapping['status'], number> = {
  mapped: 1,
  partial: 0.5,
  unsupported: 0,
};

function estimateOwnCdkTier(distinctComponents: number, totalOccurrences: number): OwnCdkEstimate {
  const score = distinctComponents * 3 + totalOccurrences * 0.1;
  if (score < 20) return { tier: 'Small', hoursRange: '~40–80 hrs', distinctComponents };
  if (score < 60) return { tier: 'Medium', hoursRange: '~80–200 hrs', distinctComponents };
  return { tier: 'Large', hoursRange: '200+ hrs', distinctComponents };
}

function collectNgwaveNotes(htmlFiles: FileInput[]): string[] {
  const manual = new Set<string>();
  const unsupported = new Set<string>();
  for (const file of htmlFiles) {
    const result = migrate(file.content);
    for (const m of result.report.manual) manual.add(m);
    for (const u of result.report.unsupported) unsupported.add(u);
  }
  return [...unsupported, ...manual];
}

/**
 * Builds the full three-destination cost report from a set of .html files.
 * Pure, client-side — no network call, no AI, no cost to run.
 */
export function buildCostReport(htmlFiles: FileInput[]): CostReport {
  const scan = scanFiles(htmlFiles);
  const ngwaveNotes = collectNgwaveNotes(htmlFiles);

  const rows: ComponentCostRow[] = scan.tags.map((usage) => ({
    ...usage,
    ngwave: { hasAdapter: KNOWN_NGWAVE_TAGS.has(usage.tag) },
    material: getMaterialMapping(usage.tag),
  }));

  const ngwaveSummary = summarizeNgwave(rows, scan.totalOccurrences);
  const materialSummary = summarizeMaterial(rows, scan.totalOccurrences);
  const distinctComponents = rows.length;
  const ownCdk = estimateOwnCdkTier(distinctComponents, scan.totalOccurrences);

  return {
    fileCount: scan.fileCount,
    totalOccurrences: scan.totalOccurrences,
    rows,
    ngwaveSummary,
    materialSummary,
    ownCdk,
    ngwaveNotes,
  };
}

function summarizeNgwave(rows: ComponentCostRow[], totalOccurrences: number): DestinationSummary {
  let mappedCount = 0;
  let unsupportedCount = 0;
  let weightedMapped = 0;
  for (const row of rows) {
    if (row.ngwave.hasAdapter) {
      mappedCount++;
      weightedMapped += row.count;
    } else {
      unsupportedCount++;
    }
  }
  return {
    automatedPct: pct(weightedMapped, totalOccurrences),
    mappedCount,
    partialOrManualCount: 0,
    unsupportedCount,
  };
}

function summarizeMaterial(rows: ComponentCostRow[], totalOccurrences: number): DestinationSummary {
  let mappedCount = 0;
  let partialCount = 0;
  let unsupportedCount = 0;
  let weightedCredit = 0;
  for (const row of rows) {
    const { status } = row.material;
    if (status === 'mapped') mappedCount++;
    else if (status === 'partial') partialCount++;
    else unsupportedCount++;
    weightedCredit += row.count * MATERIAL_CREDIT[status];
  }
  return {
    automatedPct: pct(weightedCredit, totalOccurrences),
    mappedCount,
    partialOrManualCount: partialCount,
    unsupportedCount,
  };
}

function pct(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}
