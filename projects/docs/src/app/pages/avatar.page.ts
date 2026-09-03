import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwAvatarComponent, NwAvatarGroupComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-avatar-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwAvatarComponent,
    NwAvatarGroupComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Avatar</h1>
          <p class="mt-2 text-surface-600">
            Represents a user or entity with an image, icon, or initials.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Label, icon & image" [code]="basicCode">
              <nw-avatar label="SP" />
              <nw-avatar icon="pi pi-user" />
              <nw-avatar image="https://i.pravatar.cc/64" />
            </docs-demo>

            <docs-demo id="shape" title="Shape" [code]="shapeCode">
              <nw-avatar label="SQ" shape="square" />
              <nw-avatar label="CI" shape="circle" />
            </docs-demo>

            <docs-demo id="size" title="Size" [code]="sizeCode">
              <nw-avatar label="N" size="normal" />
              <nw-avatar label="L" size="large" />
              <nw-avatar label="XL" size="xlarge" />
            </docs-demo>

            <docs-demo id="group" title="Group" [code]="groupCode">
              <nw-avatar-group>
                <nw-avatar image="https://i.pravatar.cc/64?img=1" />
                <nw-avatar image="https://i.pravatar.cc/64?img=2" />
                <nw-avatar image="https://i.pravatar.cc/64?img=3" />
                <nw-avatar label="+3" />
              </nw-avatar-group>
            </docs-demo>
          </div>

          <div api>
            <docs-api-table [rows]="api" />
          </div>
        </docs-tabs>
      </article>

      <docs-toc [sections]="sections" />
    </div>
  `,
})
export class AvatarDocPageComponent {
  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Label, icon & image' },
    { id: 'shape', label: 'Shape' },
    { id: 'size', label: 'Size' },
    { id: 'group', label: 'Group' },
  ];

  protected readonly basicCode = `<nw-avatar label="SP" />
<nw-avatar icon="pi pi-user" />
<nw-avatar image="https://i.pravatar.cc/64" />`;
  protected readonly shapeCode = `<nw-avatar label="SQ" shape="square" />
<nw-avatar label="CI" shape="circle" />`;
  protected readonly sizeCode = `<nw-avatar label="L" size="large" />
<nw-avatar label="XL" size="xlarge" />`;
  protected readonly groupCode = `<nw-avatar-group>
  <nw-avatar image="..." />
  <nw-avatar image="..." />
  <nw-avatar label="+3" />
</nw-avatar-group>`;

  protected readonly api: ApiRow[] = [
    { name: 'label', type: 'string', default: `''`, description: 'Initials or short text shown when no image/icon is set.' },
    { name: 'icon', type: 'string', default: `''`, description: 'Icon class, e.g. "pi pi-user".' },
    { name: 'image', type: 'string', default: `''`, description: 'Image URL. Falls back to icon/label on load error.' },
    { name: 'size', type: `'normal' | 'large' | 'xlarge'`, default: `'normal'`, description: 'Avatar size.' },
    { name: 'shape', type: `'square' | 'circle'`, default: `'circle'`, description: 'Avatar shape.' },
    { name: 'imageError', type: 'output<void>', default: '—', description: 'Fires when the image fails to load.' },
    { name: 'nw-avatar-group', type: 'component', default: '—', description: 'Wraps nw-avatar children in an overlapping stack.' },
  ];
}
