import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('image adapter', () => {
  it('migrates p-image tag', () => {
    const out = migrate(`<p-image src="/a.png" alt="A" [preview]="true"></p-image>`);
    expect(out.code).toContain('<nw-image');
    expect(out.imports).toContain('NwImageComponent');
  });

  it('renames imageStyleClass to class', () => {
    const out = migrate(`<p-image src="/a.png" imageStyleClass="rounded"></p-image>`);
    expect(out.code).toContain('class="rounded"');
  });

  it('flags previewImageSrc as unsupported', () => {
    const out = migrate(`<p-image src="/a.png" previewImageSrc="/a-full.png"></p-image>`);
    expect(out.report.unsupported.some((m) => m.includes('previewImageSrc'))).toBe(true);
  });
});
