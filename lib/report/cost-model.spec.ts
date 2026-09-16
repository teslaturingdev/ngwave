import { describe, expect, it } from 'vitest';
import { buildCostReport } from './cost-model';

describe('buildCostReport', () => {
  it('marks tags with an @ngwave/migrate adapter as NgWave-supported, others not', () => {
    const report = buildCostReport([
      {
        path: 'a.html',
        content: `<p-dropdown [options]="o"></p-dropdown><p-organizationChart></p-organizationChart>`,
      },
    ]);
    const dropdown = report.rows.find((r) => r.tag === 'p-dropdown');
    const orgChart = report.rows.find((r) => r.tag === 'p-organizationChart');
    expect(dropdown?.ngwave.hasAdapter).toBe(true);
    expect(orgChart?.ngwave.hasAdapter).toBe(false);
  });

  it('computes an occurrence-weighted automated % for NgWave', () => {
    // p-dropdown (supported) x2, p-organizationChart (unsupported) x1 → 2/3 supported by volume.
    const report = buildCostReport([
      {
        path: 'a.html',
        content: `<p-dropdown [options]="o"></p-dropdown><p-dropdown [options]="o"></p-dropdown><p-organizationChart></p-organizationChart>`,
      },
    ]);
    expect(report.ngwaveSummary.automatedPct).toBe(67);
  });

  it('computes a graduated occurrence-weighted automated % for Material (mapped=1, partial=0.5, unsupported=0)', () => {
    // p-dropdown mapped x2 (credit 2), p-calendar partial x1 (credit 0.5) → 2.5/3.
    const report = buildCostReport([
      {
        path: 'a.html',
        content: `<p-dropdown [options]="o"></p-dropdown><p-dropdown [options]="o"></p-dropdown><p-calendar></p-calendar>`,
      },
    ]);
    expect(report.materialSummary.automatedPct).toBe(83);
  });

  it('falls back to the uncatalogued entry for a tag not in the Material map', () => {
    const report = buildCostReport([{ path: 'a.html', content: `<p-totallyMadeUpThing></p-totallyMadeUpThing>` }]);
    const row = report.rows.find((r) => r.tag === 'p-totallyMadeUpThing');
    expect(row?.material.status).toBe('unsupported');
    expect(row?.material.materialEquivalent).toBe('—');
  });

  it('surfaces prop-level NgWave issues from the real deterministic engine (e.g. frozenColumns)', () => {
    const report = buildCostReport([
      { path: 'a.html', content: `<p-table [frozenColumns]="frozen"></p-table>` },
    ]);
    expect(report.ngwaveNotes.some((n) => n.includes('frozen columns are not supported'))).toBe(true);
  });

  it('dedupes identical NgWave notes across files', () => {
    const report = buildCostReport([
      { path: 'a.html', content: `<p-table [frozenColumns]="frozen"></p-table>` },
      { path: 'b.html', content: `<p-table [frozenColumns]="frozen"></p-table>` },
    ]);
    const matches = report.ngwaveNotes.filter((n) => n.includes('frozen columns are not supported'));
    expect(matches.length).toBe(1);
  });

  it('estimates a Small own-CDK tier for a couple of components', () => {
    const report = buildCostReport([
      { path: 'a.html', content: `<p-button></p-button><p-checkbox></p-checkbox>` },
    ]);
    expect(report.ownCdk.tier).toBe('Small');
  });

  it('estimates a Medium own-CDK tier for a moderate number of distinct components', () => {
    const tags = ['p-calendar', 'p-chart', 'p-menu', 'p-accordion', 'p-card', 'p-fileUpload', 'p-tag'];
    const content = tags.map((t) => `<${t}></${t}>`).join('');
    const report = buildCostReport([{ path: 'a.html', content }]);
    expect(report.ownCdk.tier).toBe('Medium');
  });

  it('estimates a Large own-CDK tier for many distinct components', () => {
    const tags = [
      'p-calendar', 'p-chart', 'p-menu', 'p-accordion', 'p-card', 'p-fileUpload', 'p-tag',
      'p-chip', 'p-confirmDialog', 'p-avatar', 'p-breadcrumb', 'p-splitButton', 'p-inputSwitch',
      'p-slider', 'p-rating', 'p-progressBar', 'p-paginator', 'p-panel', 'p-fieldset',
      'p-divider', 'p-toolbar',
    ];
    const content = tags.map((t) => `<${t}></${t}>`).join('');
    const report = buildCostReport([{ path: 'a.html', content }]);
    expect(report.ownCdk.distinctComponents).toBe(tags.length);
    expect(report.ownCdk.tier).toBe('Large');
  });

  it('returns zeroed summaries for a project with no PrimeNG usage', () => {
    const report = buildCostReport([{ path: 'a.html', content: `<div></div>` }]);
    expect(report.rows).toEqual([]);
    expect(report.ngwaveSummary.automatedPct).toBe(0);
    expect(report.materialSummary.automatedPct).toBe(0);
  });
});
