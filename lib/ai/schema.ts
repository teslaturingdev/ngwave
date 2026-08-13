/** JSON schema for Claude structured output (output_config.format). */
export const AI_MIGRATE_SCHEMA = {
  type: 'object',
  properties: {
    html: {
      type: 'string',
      description:
        'The finished NgWave template. Every PrimeNG p-* element resolved to its NgWave equivalent. Empty string if no template was given.',
    },
    ts: {
      type: 'string',
      description:
        'The finished TypeScript companion (component class members, imports, service calls) if a .ts was provided; otherwise an empty string. Only include code you actually changed or added context for — do not invent unrelated code.',
    },
    changes: {
      type: 'array',
      description: 'One entry per meaningful change you made.',
      items: {
        type: 'object',
        properties: {
          summary: { type: 'string', description: 'Short label, e.g. "Built [columns] array from header/body templates".' },
          detail: { type: 'string', description: 'One sentence of why/how.' },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
        },
        required: ['summary', 'detail', 'confidence'],
        additionalProperties: false,
      },
    },
    unresolved: {
      type: 'array',
      description:
        'Things you could NOT migrate because NgWave does not support them (frozen columns, inline edit, row grouping, per-cell button/link markup, etc.). Short TODO strings. Never fake an API to avoid listing something here.',
      items: { type: 'string' },
    },
  },
  required: ['html', 'ts', 'changes', 'unresolved'],
  additionalProperties: false,
} as const;

export interface AiMigrateOutput {
  html: string;
  ts: string;
  changes: { summary: string; detail: string; confidence: 'high' | 'medium' | 'low' }[];
  unresolved: string[];
}
