import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('carousel adapter', () => {
  it('migrates p-carousel tag and its item template', () => {
    const out = migrate(
      `<p-carousel [value]="items" [numVisible]="3"><ng-template let-item pTemplate="item">{{ item }}</ng-template></p-carousel>`,
    );
    expect(out.code).toContain('<nw-carousel');
    expect(out.code).toContain('</nw-carousel>');
    expect(out.code).toContain('nwCarouselItem');
    expect(out.code).not.toContain('pTemplate');
    expect(out.imports).toContain('NwCarouselComponent');
  });

  it('flags autoplay/responsive/orientation as unsupported', () => {
    const out = migrate(`<p-carousel [value]="items" [autoplayInterval]="3000" orientation="vertical"></p-carousel>`);
    expect(out.report.unsupported.some((m) => m.includes('autoplayInterval'))).toBe(true);
    expect(out.report.unsupported.some((m) => m.includes('orientation'))).toBe(true);
  });
});
