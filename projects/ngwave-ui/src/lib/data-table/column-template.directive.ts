import { Directive, TemplateRef, inject, input } from '@angular/core';
import { NwTableRow } from './data-table.types';

export interface NwCellContext<T extends NwTableRow> {
  $implicit: T;
  value: unknown;
  column: string;
}

/**
 * Provides custom cell content for a column.
 * Usage: `<ng-template nwColumn="price" let-row let-value="value"> … </ng-template>`
 */
@Directive({ selector: '[nwColumn]' })
export class NwColumnTemplateDirective<T extends NwTableRow = NwTableRow> {
  /** The column field this template renders. */
  readonly nwColumn = input.required<string>();
  readonly template = inject<TemplateRef<NwCellContext<T>>>(TemplateRef);

  static ngTemplateContextGuard<T extends NwTableRow>(
    _dir: NwColumnTemplateDirective<T>,
    _ctx: unknown,
  ): _ctx is NwCellContext<T> {
    return true;
  }
}

export interface NwRowExpansionContext<T extends NwTableRow> {
  $implicit: T;
}

/**
 * Provides the expanded-row content.
 * Usage: `<ng-template nwRowExpansion let-row> … </ng-template>`
 */
@Directive({ selector: '[nwRowExpansion]' })
export class NwRowExpansionDirective<T extends NwTableRow = NwTableRow> {
  readonly template = inject<TemplateRef<NwRowExpansionContext<T>>>(TemplateRef);

  static ngTemplateContextGuard<T extends NwTableRow>(
    _dir: NwRowExpansionDirective<T>,
    _ctx: unknown,
  ): _ctx is NwRowExpansionContext<T> {
    return true;
  }
}
