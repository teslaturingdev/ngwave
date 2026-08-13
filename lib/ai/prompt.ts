import { NGWAVE_API_REFERENCE } from './api-reference.js';

export interface DeterministicResult {
  code: string;
  imports: string[];
  report: { mapped: string[]; manual: string[]; unsupported: string[] };
}

export interface PromptInput {
  /** Original PrimeNG template the user pasted. */
  html: string;
  /** Optional PrimeNG component TypeScript. */
  ts?: string;
  /** Output of the deterministic codemod (already ran, in the browser). */
  deterministic: DeterministicResult;
}

/** Stable system prompt — prompt-cache this (the API reference never changes per request). */
export function buildSystem(): string {
  return `You are NgWave Migrate, an expert at converting Angular PrimeNG code to the NgWave (@ngwave/ui) library.

A deterministic codemod has already done the mechanical attribute/tag mapping. Your job is to FINISH the parts it could not:
- Turn PrimeNG DataTable column templates (<ng-template pTemplate="header|body|footer|caption">) into a proper NgWave [columns] array (an NwColumn<T>[]). Add a matching component-side "columns" array in the .ts when a .ts is provided.
- Migrate the TypeScript companion: PrimeNG service calls (MessageService.add -> NwToastService.show, ConfirmationService.confirm -> NwConfirmationService.confirm), the p-autoComplete completeMethod handler signature (NgWave (complete) passes a query STRING), component imports (add the Nw* classes from '@ngwave/ui', remove PrimeNG imports/modules), and any wiring the template change requires.
- Preserve everything that already works. Do not rewrite correct code.

HARD RULES:
- Only use real NgWave props/components/services from the reference below. NEVER invent an attribute, input, output, or component that is not listed.
- If PrimeNG used a feature NgWave does not support (frozen columns/rows, cell/row inline editing, row grouping, per-cell button/link markup inside a table, editable/virtual-scroll dropdown, full-screen dialog), DO NOT fake it. Leave a clear TODO comment in the code AND add a short string to "unresolved".
- Keep the user's own expressions, bindings, variable names, and business logic intact.
- Output must be valid Angular 22 that compiles against @ngwave/ui. No leftover p-* elements or PrimeNG imports.
- Be surgical. If there is no .ts to migrate, return an empty string for "ts".

${NGWAVE_API_REFERENCE}`;
}

/** Per-request user message. */
export function buildUser(input: PromptInput): string {
  const { html, ts, deterministic } = input;
  const parts: string[] = [];

  parts.push('## Original PrimeNG template\n```html\n' + html.trim() + '\n```');

  if (ts && ts.trim()) {
    parts.push('## Original PrimeNG component TypeScript\n```ts\n' + ts.trim() + '\n```');
  }

  parts.push(
    '## Deterministic NgWave output so far (finish this)\n```html\n' +
      (deterministic.code || '').trim() +
      '\n```',
  );

  if (deterministic.imports.length) {
    parts.push('Imports the codemod already detected: ' + deterministic.imports.join(', '));
  }

  const flagged = [
    ...deterministic.report.manual.map((m) => '⚠ ' + m),
    ...deterministic.report.unsupported.map((u) => '✗ ' + u),
  ];
  if (flagged.length) {
    parts.push('## Items still needing work\n' + flagged.map((f) => '- ' + f).join('\n'));
  }

  parts.push(
    'Finish the migration. Return the completed html, the completed ts (empty string if none was given), a list of the changes you made, and a list of anything genuinely unsupported.',
  );

  return parts.join('\n\n');
}

/** Follow-up used by the verify/self-correct round when p-* tags remain. */
export function buildCorrection(leftoverTags: string[]): string {
  return (
    'Your previous output still contains unmigrated PrimeNG elements: ' +
    leftoverTags.join(', ') +
    '. Migrate those too (or, if NgWave genuinely does not support them, remove them and add a clear TODO + an "unresolved" entry). Return the corrected result in the same schema.'
  );
}
