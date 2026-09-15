import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('galleria adapter', () => {
  it('migrates p-galleria tag and its item/thumbnail templates', () => {
    const out = migrate(
      `<p-galleria [value]="images"><ng-template let-item pTemplate="item">{{ item }}</ng-template><ng-template let-item pTemplate="thumbnail">{{ item }}</ng-template></p-galleria>`,
    );
    expect(out.code).toContain('<nw-galleria');
    expect(out.code).toContain('</nw-galleria>');
    expect(out.code).toContain('nwGalleriaItem');
    expect(out.code).toContain('nwGalleriaThumbnail');
    expect(out.code).not.toContain('pTemplate');
    expect(out.imports).toContain('NwGalleriaComponent');
  });

  it('flags fullScreen/autoPlay/numVisible/thumbnailsPosition as unsupported', () => {
    const out = migrate(`<p-galleria [value]="images" [fullScreen]="true" [autoPlay]="true"></p-galleria>`);
    expect(out.report.unsupported.some((m) => m.includes('fullScreen'))).toBe(true);
    expect(out.report.unsupported.some((m) => m.includes('autoPlay'))).toBe(true);
  });
});
