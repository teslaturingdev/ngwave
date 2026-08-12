import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwButtonComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-button-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwButtonComponent,
    DocsDemoComponent,
    DocsApiTableComponent,
    DocsTabsComponent,
    DocsTocComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Button</h1>
          <p class="mt-2 text-surface-600">
            A themeable button with variants, sizes, and a loading state. Renders
            a native <code class="text-nw-600">&lt;button&gt;</code> for full
            accessibility.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="variants" title="Variants" [code]="variantsCode">
              <nw-button variant="primary">Primary</nw-button>
              <nw-button variant="secondary">Secondary</nw-button>
              <nw-button variant="success">Success</nw-button>
              <nw-button variant="info">Info</nw-button>
              <nw-button variant="warn">Warn</nw-button>
              <nw-button variant="help">Help</nw-button>
              <nw-button variant="danger">Danger</nw-button>
              <nw-button variant="contrast">Contrast</nw-button>
              <nw-button variant="outlined">Outlined</nw-button>
              <nw-button variant="text">Text</nw-button>
              <nw-button variant="link">Link</nw-button>
              <nw-button variant="raised">Raised</nw-button>
            </docs-demo>

            <docs-demo id="sizes" title="Sizes" [code]="sizesCode">
              <nw-button size="small">Small</nw-button>
              <nw-button size="normal">Normal</nw-button>
              <nw-button size="large">Large</nw-button>
            </docs-demo>

            <docs-demo id="label-icon" title="Label, icon & badge" [code]="advancedCode">
              <nw-button label="Save" icon="pi pi-check"></nw-button>
              <nw-button label="Next" icon="pi pi-arrow-right" iconPosition="right"></nw-button>
              <nw-button label="Inbox" badge="8"></nw-button>
              <nw-button label="Rounded" [rounded]="true"></nw-button>
            </docs-demo>

            <docs-demo id="icon-only" title="Icon-only & fluid" [code]="iconOnlyCode">
              <nw-button [iconOnly]="true" icon="pi pi-search" ariaLabel="Search"></nw-button>
              <nw-button [iconOnly]="true" [rounded]="true" icon="pi pi-plus" ariaLabel="Add"></nw-button>
              <nw-button [iconOnly]="true" variant="danger" icon="pi pi-trash" ariaLabel="Delete"></nw-button>
              <div class="w-full pt-2">
                <nw-button [fluid]="true">Full width</nw-button>
              </div>
            </docs-demo>

            <docs-demo
              id="states"
              title="Loading & disabled"
              [code]="statesCode"
            >
              <nw-button [loading]="true">Saving</nw-button>
              <nw-button variant="outlined" [loading]="true">Loading</nw-button>
              <nw-button [disabled]="true">Disabled</nw-button>
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
export class ButtonPageComponent {
  protected readonly sections: TocSection[] = [
    { id: 'variants', label: 'Variants' },
    { id: 'sizes', label: 'Sizes' },
    { id: 'label-icon', label: 'Label, icon & badge' },
    { id: 'icon-only', label: 'Icon-only & fluid' },
    { id: 'states', label: 'Loading & disabled' },
  ];

  protected readonly variantsCode = `<nw-button variant="primary">Primary</nw-button>
<nw-button variant="success">Success</nw-button>
<nw-button variant="info">Info</nw-button>
<nw-button variant="warn">Warn</nw-button>
<nw-button variant="help">Help</nw-button>
<nw-button variant="danger">Danger</nw-button>
<nw-button variant="contrast">Contrast</nw-button>
<nw-button variant="outlined">Outlined</nw-button>
<nw-button variant="text">Text</nw-button>
<nw-button variant="link">Link</nw-button>
<nw-button variant="raised">Raised</nw-button>`;

  protected readonly sizesCode = `<nw-button size="small">Small</nw-button>
<nw-button size="normal">Normal</nw-button>
<nw-button size="large">Large</nw-button>`;

  protected readonly iconOnlyCode = `<nw-button [iconOnly]="true" icon="pi pi-search" ariaLabel="Search" />
<nw-button [iconOnly]="true" [rounded]="true" icon="pi pi-plus" ariaLabel="Add" />
<nw-button [iconOnly]="true" variant="danger" icon="pi pi-trash" ariaLabel="Delete" />
<nw-button [fluid]="true">Full width</nw-button>`;

  protected readonly advancedCode = `<nw-button label="Save" icon="pi pi-check" />
<nw-button label="Next" icon="pi pi-arrow-right" iconPosition="right" />
<nw-button label="Inbox" badge="8" />
<nw-button label="Rounded" [rounded]="true" />`;

  protected readonly statesCode = `<nw-button [loading]="true">Saving</nw-button>
<nw-button [disabled]="true">Disabled</nw-button>`;

  protected readonly api: ApiRow[] = [
    {
      name: 'variant',
      type: `'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast' | 'outlined' | 'text' | 'link' | 'raised'`,
      default: `'primary'`,
      description: 'Visual style / severity of the button.',
    },
    {
      name: 'iconOnly',
      type: 'boolean',
      default: 'false',
      description: 'Square icon button; pair with ariaLabel for accessibility.',
    },
    {
      name: 'fluid',
      type: 'boolean',
      default: 'false',
      description: 'Stretches the button to fill its container width.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      default: `''`,
      description: 'Accessible label (required for icon-only buttons).',
    },
    {
      name: 'size',
      type: `'small' | 'normal' | 'large'`,
      default: `'normal'`,
      description: 'Button size.',
    },
    {
      name: 'label',
      type: 'string',
      default: `''`,
      description: 'Button text (falls back to projected content if empty).',
    },
    {
      name: 'icon',
      type: 'string',
      default: `''`,
      description: 'CSS class for an icon element.',
    },
    {
      name: 'iconPosition',
      type: `'left' | 'right'`,
      default: `'left'`,
      description: 'Icon placement relative to the label.',
    },
    {
      name: 'rounded',
      type: 'boolean',
      default: 'false',
      description: 'Renders a fully rounded (pill) button.',
    },
    {
      name: 'badge',
      type: 'string',
      default: `''`,
      description: 'Optional badge text/count.',
    },
    {
      name: 'badgeVariant',
      type: 'NwButtonVariant',
      default: `'secondary'`,
      description: 'Badge color variant.',
    },
    {
      name: 'type',
      type: `'button' | 'submit' | 'reset'`,
      default: `'button'`,
      description: 'Native button type.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the button.',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'Shows a spinner, disables the button, sets aria-busy.',
    },
  ];
}
