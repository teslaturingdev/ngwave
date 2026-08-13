import { buildSystem, buildUser, buildCorrection, PromptInput } from './prompt.js';
import { AI_MIGRATE_SCHEMA, AiMigrateOutput } from './schema.js';
import { findLeftoverPrimeng } from './verify.js';

export interface RunOptions {
  apiKey: string;
  /** 'deep' uses Opus for the hardest components; default is Sonnet (cheaper). */
  deep?: boolean;
}

export interface RunResult extends AiMigrateOutput {
  model: string;
  corrected: boolean;
  usage: {
    input: number;
    output: number;
    cacheWrite: number;
    cacheRead: number;
    costUsd: number;
  };
}

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}
interface Usage {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
}
interface AnthropicResponse {
  content: { type: string; text?: string }[];
  usage: Usage;
}

const SONNET = 'claude-sonnet-5';
const OPUS = 'claude-opus-5';

// First-party per-MTok rates (Sonnet 5 intro; Opus 5 standard). Rough — display only.
const RATES: Record<string, { in: number; out: number }> = {
  [SONNET]: { in: 2, out: 10 },
  [OPUS]: { in: 5, out: 25 },
};

/** Call the Anthropic Messages API directly (no SDK — keeps the function dependency-free). */
async function callClaude(
  apiKey: string,
  model: string,
  system: string,
  messages: Msg[],
): Promise<AnthropicResponse> {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 8000,
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      output_config: {
        format: { type: 'json_schema', schema: AI_MIGRATE_SCHEMA },
        effort: 'medium',
      },
      messages,
    }),
  });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Anthropic API ${resp.status}: ${body.slice(0, 300)}`);
  }
  return (await resp.json()) as AnthropicResponse;
}

function parseOutput(res: AnthropicResponse): AiMigrateOutput {
  const text = res.content.find((b) => b.type === 'text')?.text;
  if (!text) throw new Error('Model returned no text output');
  return JSON.parse(text) as AiMigrateOutput;
}

export async function runAiMigration(
  input: PromptInput,
  opts: RunOptions,
): Promise<RunResult> {
  const model = opts.deep ? OPUS : SONNET;
  const system = buildSystem();
  const user = buildUser(input);

  const messages: Msg[] = [{ role: 'user', content: user }];
  let res = await callClaude(opts.apiKey, model, system, messages);
  let out = parseOutput(res);

  const usage = {
    input: res.usage.input_tokens,
    output: res.usage.output_tokens,
    cacheWrite: res.usage.cache_creation_input_tokens ?? 0,
    cacheRead: res.usage.cache_read_input_tokens ?? 0,
  };

  // Verify: if PrimeNG tags remain, do exactly one self-correction round.
  let corrected = false;
  const leftover = findLeftoverPrimeng(out.html);
  if (leftover.length) {
    corrected = true;
    messages.push({ role: 'assistant', content: JSON.stringify(out) });
    messages.push({ role: 'user', content: buildCorrection(leftover) });
    res = await callClaude(opts.apiKey, model, system, messages);
    out = parseOutput(res);
    usage.input += res.usage.input_tokens;
    usage.output += res.usage.output_tokens;
    usage.cacheWrite += res.usage.cache_creation_input_tokens ?? 0;
    usage.cacheRead += res.usage.cache_read_input_tokens ?? 0;
  }

  const rate = RATES[model];
  const costUsd =
    (usage.input * rate.in +
      usage.cacheWrite * rate.in * 1.25 +
      usage.cacheRead * rate.in * 0.1 +
      usage.output * rate.out) /
    1e6;

  return { ...out, model, corrected, usage: { ...usage, costUsd } };
}
