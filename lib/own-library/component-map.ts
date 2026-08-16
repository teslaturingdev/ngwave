/**
 * Which real files live in each @ngwave/ui component folder, which PrimeNG
 * tags map to which folder, and which folders need which other folders
 * (e.g. Dialog's confirm-dialog imports Button). Hand-maintained, verified
 * against the actual projects/ngwave-ui/src/lib/ contents — same style as
 * @ngwave/migrate's SUPPORTED_PRIMENG_TAGS.
 */

export const FOLDER_FILES: Record<string, string[]> = {
  autocomplete: ['autocomplete.component.ts', 'autocomplete.component.spec.ts', 'index.ts'],
  button: ['button.component.ts', 'button.component.spec.ts', 'index.ts'],
  checkbox: ['checkbox.component.ts', 'checkbox.component.spec.ts', 'index.ts'],
  'data-table': [
    'data-table.component.ts',
    'data-table.component.spec.ts',
    'data-table.types.ts',
    'column-template.directive.ts',
    'index.ts',
  ],
  dialog: [
    'dialog.component.ts',
    'dialog.component.spec.ts',
    'confirm-dialog.component.ts',
    'confirmation.service.ts',
    'confirmation.service.spec.ts',
    'index.ts',
  ],
  dropdown: [
    'dropdown.component.ts',
    'dropdown.component.spec.ts',
    'dropdown.types.ts',
    'index.ts',
  ],
  input: [
    'input-text.component.ts',
    'input-text.component.spec.ts',
    'input-number.component.ts',
    'input-number.component.spec.ts',
    'textarea.component.ts',
    'textarea.component.spec.ts',
    'index.ts',
  ],
  radio: ['radio.component.ts', 'radio.component.spec.ts', 'index.ts'],
  spinner: [
    'spinner.component.ts',
    'spinner.component.spec.ts',
    'skeleton.component.ts',
    'index.ts',
  ],
  tabs: ['tabs.component.ts', 'tabs.component.spec.ts', 'index.ts'],
  toast: ['toast.component.ts', 'toast.component.spec.ts', 'toast.service.ts', 'index.ts'],
};

export const TAG_TO_FOLDER: Record<string, string> = {
  'p-button': 'button',
  pButton: 'button',
  'p-table': 'data-table',
  'p-dropdown': 'dropdown',
  'p-select': 'dropdown',
  'p-multiSelect': 'dropdown',
  'p-dialog': 'dialog',
  'p-sidebar': 'dialog',
  'p-tabView': 'tabs',
  'p-tabPanel': 'tabs',
  'p-checkbox': 'checkbox',
  'p-radioButton': 'radio',
  'p-progressSpinner': 'spinner',
  'p-skeleton': 'spinner',
  'p-toast': 'toast',
  'p-inputNumber': 'input',
  'p-autoComplete': 'autocomplete',
  pInputText: 'input',
  pInputTextarea: 'input',
};

/** Folder → other folders it imports from and must be bundled alongside. */
export const FOLDER_DEPENDENCIES: Record<string, string[]> = {
  dialog: ['button'],
};

export interface ResolvedComponent {
  folder: string;
  /** True if the scan directly found a matching PrimeNG tag; false if pulled in as a dependency. */
  direct: boolean;
}

/** Resolves which NgWave folders are needed for a set of used PrimeNG tags, including dependencies. */
export function resolveFolders(usedTags: string[]): ResolvedComponent[] {
  const direct = new Set<string>();
  for (const tag of usedTags) {
    const folder = TAG_TO_FOLDER[tag];
    if (folder) direct.add(folder);
  }

  const all = new Set(direct);
  for (const folder of direct) {
    for (const dep of FOLDER_DEPENDENCIES[folder] ?? []) all.add(dep);
  }

  return [...all].sort().map((folder) => ({ folder, direct: direct.has(folder) }));
}
