/** The syntactic form of an Angular template attribute/binding. */
export type AttrKind =
  | 'input' // [prop]="expr"
  | 'output' // (event)="handler"
  | 'twoway' // [(model)]="expr"
  | 'structural' // *ngIf="expr"
  | 'ref' // #ref
  | 'plain'; // attr="value" or bare attr

export interface ParsedAttr {
  kind: AttrKind;
  /** Attribute name without brackets/parens/star/hash. */
  name: string;
  /** Inner value (without surrounding quotes); undefined for bare attrs. */
  value?: string;
  /** Quote character used in the source (defaults to `"`). */
  quote: '"' | "'";
  /** Original source text of the whole attribute. */
  raw: string;
}

export interface MigrationReport {
  mapped: string[];
  manual: string[];
  unsupported: string[];
}

export interface MigrationResult {
  code: string;
  imports: string[];
  report: MigrationReport;
}
