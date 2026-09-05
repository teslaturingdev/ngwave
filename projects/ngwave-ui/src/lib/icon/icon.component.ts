import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NwIconName =
  | 'home'
  | 'bar-chart'
  | 'folder'
  | 'users'
  | 'user'
  | 'message-circle'
  | 'bell'
  | 'settings'
  | 'help-circle'
  | 'key'
  | 'edit'
  | 'mail'
  | 'lock'
  | 'hash'
  | 'alert-triangle'
  | 'wrench'
  | 'circle-dashed'
  | 'clock'
  | 'list-checks'
  | 'search'
  | 'file-text'
  | 'chevron-down'
  | 'chevron-up'
  | 'chevron-left'
  | 'chevron-right'
  | 'menu'
  | 'command'
  | 'table'
  | 'plus'
  | 'minus'
  | 'trash'
  | 'check'
  | 'check-circle'
  | 'x'
  | 'x-circle'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up-right'
  | 'arrow-down-right'
  | 'credit-card'
  | 'log-out'
  | 'sparkles'
  | 'moon'
  | 'trending-up'
  | 'trending-down'
  | 'palette'
  | 'plug'
  | 'package'
  | 'more-horizontal'
  | 'shield'
  | 'inbox'
  | 'layout-dashboard'
  | 'eye'
  | 'filter'
  | 'calendar'
  | 'external-link'
  | 'layers'
  | 'star'
  | 'dollar-sign';

/**
 * Inline SVG icon set: 24x24 viewBox, currentColor stroke, no external assets.
 * Kept as one component so the whole set ships as pure markup — no icon fonts
 * or sprite fetches, and every icon inherits text color/size for free.
 */
@Component({
  selector: 'nw-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0' },
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @switch (name()) {
        @case ('home') {
          <path d="M3 11l9-7 9 7" />
          <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
        }
        @case ('bar-chart') {
          <line x1="6" y1="20" x2="6" y2="13" />
          <line x1="12" y1="20" x2="12" y2="7" />
          <line x1="18" y1="20" x2="18" y2="11" />
        }
        @case ('folder') {
          <path d="M3 7h6l2 2h10v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z" />
        }
        @case ('users') {
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3 3-5 6-5s6 2 6 5" />
          <circle cx="17" cy="9" r="2.3" />
          <path d="M15.5 20c0-2.5 1.8-4 4-4" />
        }
        @case ('user') {
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        }
        @case ('message-circle') {
          <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
        }
        @case ('bell') {
          <path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 6 2 7H4c.5-1 2-3 2-7z" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        }
        @case ('settings') {
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="2" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="2" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="22" y2="12" />
          <line x1="4.9" y1="4.9" x2="7" y2="7" />
          <line x1="17" y1="17" x2="19.1" y2="19.1" />
          <line x1="4.9" y1="19.1" x2="7" y2="17" />
          <line x1="17" y1="7" x2="19.1" y2="4.9" />
        }
        @case ('help-circle') {
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.2a2.6 2.6 0 1 1 3.7 2.4c-.9.4-1.2 1-1.2 1.9" />
          <line x1="12" y1="17" x2="12" y2="17.01" />
        }
        @case ('key') {
          <circle cx="7" cy="15" r="4" />
          <path d="M10 12l9-9" />
          <path d="M15 7l3 3" />
          <path d="M13 9l2 2" />
        }
        @case ('edit') {
          <path d="M4 20l1-4L16 5l3 3L8 19l-4 1z" />
          <line x1="14" y1="7" x2="17" y2="10" />
        }
        @case ('mail') {
          <rect x="3" y="5" width="18" height="14" rx="1.5" />
          <path d="M3 6.5l9 6.5 9-6.5" />
        }
        @case ('lock') {
          <rect x="5" y="11" width="14" height="9" rx="1.5" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        }
        @case ('hash') {
          <line x1="9" y1="4" x2="7" y2="20" />
          <line x1="17" y1="4" x2="15" y2="20" />
          <line x1="4" y1="9" x2="20" y2="9" />
          <line x1="3" y1="15" x2="19" y2="15" />
        }
        @case ('alert-triangle') {
          <path d="M12 3l10 18H2L12 3z" />
          <line x1="12" y1="9.5" x2="12" y2="14" />
          <line x1="12" y1="17" x2="12" y2="17.01" />
        }
        @case ('wrench') {
          <path
            d="M14.7 6.3a4 4 0 1 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2-2z"
          />
        }
        @case ('circle-dashed') {
          <circle cx="12" cy="12" r="9" stroke-dasharray="3.5 3" />
        }
        @case ('clock') {
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l4 2" />
        }
        @case ('list-checks') {
          <path d="M4 6l2 2 4-4" />
          <line x1="12" y1="6" x2="21" y2="6" />
          <path d="M4 14l2 2 4-4" />
          <line x1="12" y1="14" x2="21" y2="14" />
        }
        @case ('search') {
          <circle cx="10" cy="10" r="7" />
          <line x1="21" y1="21" x2="15.5" y2="15.5" />
        }
        @case ('file-text') {
          <path d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="8" y1="16" x2="16" y2="16" />
          <line x1="8" y1="8" x2="11" y2="8" />
        }
        @case ('chevron-down') {
          <polyline points="6 9 12 15 18 9" />
        }
        @case ('chevron-up') {
          <polyline points="6 15 12 9 18 15" />
        }
        @case ('chevron-left') {
          <polyline points="15 6 9 12 15 18" />
        }
        @case ('chevron-right') {
          <polyline points="9 6 15 12 9 18" />
        }
        @case ('menu') {
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        }
        @case ('command') {
          <circle cx="7" cy="7" r="2.5" />
          <circle cx="17" cy="7" r="2.5" />
          <circle cx="7" cy="17" r="2.5" />
          <circle cx="17" cy="17" r="2.5" />
          <line x1="9.5" y1="7" x2="14.5" y2="7" />
          <line x1="9.5" y1="17" x2="14.5" y2="17" />
          <line x1="7" y1="9.5" x2="7" y2="14.5" />
          <line x1="17" y1="9.5" x2="17" y2="14.5" />
        }
        @case ('table') {
          <rect x="3" y="4" width="18" height="16" rx="1.5" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="9" y1="10" x2="9" y2="20" />
        }
        @case ('plus') {
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        }
        @case ('minus') {
          <line x1="5" y1="12" x2="19" y2="12" />
        }
        @case ('trash') {
          <path d="M4 7h16" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
          <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
        }
        @case ('check') {
          <polyline points="5 13 10 18 19 7" />
        }
        @case ('check-circle') {
          <circle cx="12" cy="12" r="9" />
          <polyline points="8 12 11 15 16 9" />
        }
        @case ('x') {
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        }
        @case ('x-circle') {
          <circle cx="12" cy="12" r="9" />
          <line x1="9" y1="9" x2="15" y2="15" />
          <line x1="15" y1="9" x2="9" y2="15" />
        }
        @case ('arrow-right') {
          <line x1="4" y1="12" x2="20" y2="12" />
          <polyline points="14 6 20 12 14 18" />
        }
        @case ('arrow-left') {
          <line x1="20" y1="12" x2="4" y2="12" />
          <polyline points="10 6 4 12 10 18" />
        }
        @case ('arrow-up-right') {
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="8 7 17 7 17 16" />
        }
        @case ('arrow-down-right') {
          <line x1="7" y1="7" x2="17" y2="17" />
          <polyline points="17 8 17 17 8 17" />
        }
        @case ('credit-card') {
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        }
        @case ('log-out') {
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        }
        @case ('sparkles') {
          <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
          <path d="M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" />
        }
        @case ('moon') {
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 7 7 0 0 0 20 14.5z" />
        }
        @case ('trending-up') {
          <polyline points="4 15 10 9 14 13 20 6" />
          <polyline points="14 6 20 6 20 12" />
        }
        @case ('trending-down') {
          <polyline points="4 9 10 15 14 11 20 18" />
          <polyline points="14 18 20 18 20 12" />
        }
        @case ('palette') {
          <path
            d="M12 3a9 9 0 0 0 0 18c1.1 0 2-.8 2-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-5-4.5-8-9-8z"
          />
          <circle cx="8.3" cy="10.5" r="1.1" />
          <circle cx="12" cy="7.3" r="1.1" />
          <circle cx="15.7" cy="10.5" r="1.1" />
          <circle cx="14.2" cy="15" r="1.1" />
        }
        @case ('plug') {
          <line x1="9" y1="2" x2="9" y2="8" />
          <line x1="15" y1="2" x2="15" y2="8" />
          <path d="M6 8h12l-1 4a5 5 0 0 1-5 4h0a5 5 0 0 1-5-4L6 8z" />
          <line x1="12" y1="18" x2="12" y2="22" />
        }
        @case ('package') {
          <path d="M21 8l-9-5-9 5 9 5 9-5z" />
          <path d="M3 8v8l9 5 9-5V8" />
          <line x1="12" y1="13" x2="12" y2="21" />
        }
        @case ('more-horizontal') {
          <circle cx="5" cy="12" r="1.4" />
          <circle cx="12" cy="12" r="1.4" />
          <circle cx="19" cy="12" r="1.4" />
        }
        @case ('shield') {
          <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
        }
        @case ('inbox') {
          <path d="M4 12h4l2 3h4l2-3h4" />
          <path d="M5 5h14l2 7v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7l2-7z" />
        }
        @case ('layout-dashboard') {
          <rect x="3" y="3" width="8" height="8" rx="1.2" />
          <rect x="13" y="3" width="8" height="5" rx="1.2" />
          <rect x="13" y="10" width="8" height="11" rx="1.2" />
          <rect x="3" y="13" width="8" height="8" rx="1.2" />
        }
        @case ('eye') {
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="3" />
        }
        @case ('filter') {
          <line x1="4" y1="6" x2="20" y2="6" />
          <circle cx="9" cy="6" r="2" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <circle cx="15" cy="12" r="2" />
          <line x1="4" y1="18" x2="20" y2="18" />
          <circle cx="10" cy="18" r="2" />
        }
        @case ('calendar') {
          <rect x="3" y="5" width="18" height="16" rx="1.5" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="8" y1="3" x2="8" y2="7" />
          <line x1="16" y1="3" x2="16" y2="7" />
        }
        @case ('external-link') {
          <path d="M14 4h6v6" />
          <line x1="20" y1="4" x2="11" y2="13" />
          <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
        }
        @case ('layers') {
          <polygon points="12 3 21 8 12 13 3 8" />
          <polyline points="3 13 12 18 21 13" />
        }
        @case ('star') {
          <path d="M12 3l2.5 5.5 6 .8-4.5 4.2 1.1 6-5.1-2.9-5.1 2.9 1.1-6L3.5 9.3l6-.8z" />
        }
        @case ('dollar-sign') {
          <line x1="12" y1="3" x2="12" y2="21" />
          <path
            d="M16 7c0-1.7-1.8-3-4-3s-4 1.1-4 2.7c0 3.6 8 1.8 8 5.3 0 1.7-1.8 3-4 3s-4-1.3-4-3"
          />
        }
      }
    </svg>
  `,
})
export class NwIconComponent {
  readonly name = input.required<NwIconName>();
  readonly size = input<number>(20);
  readonly strokeWidth = input<number>(1.75);
}
