import { FOLDER_FILES, resolveFolders, ResolvedComponent } from './component-map';
import { renamePrefix } from './rename';

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface GeneratedLibrary {
  files: GeneratedFile[];
  components: ResolvedComponent[];
}

const ASSET_BASE = '/ngwave-ui-src';

async function fetchText(path: string): Promise<string> {
  const resp = await fetch(path);
  if (!resp.ok) throw new Error(`Couldn't load ${path} (${resp.status}). Please try again.`);
  return resp.text();
}

function buildPublicApi(components: ResolvedComponent[], prefix: string): string {
  const lines = [`/* Public API surface of @${prefix}/ui */`, ''];
  for (const { folder } of components) lines.push(`export * from './lib/${folder}';`);
  return lines.join('\n') + '\n';
}

/**
 * Fetches the real NgWave source for every folder a PrimeNG scan needs
 * (dependencies resolved), renames the "nw" prefix throughout, and returns
 * a ready-to-zip file list plus which components were included and why.
 */
export async function generateLibrary(
  usedTags: string[],
  prefix: string,
): Promise<GeneratedLibrary> {
  const components = resolveFolders(usedTags);
  const files: GeneratedFile[] = [];

  for (const { folder } of components) {
    for (const filename of FOLDER_FILES[folder] ?? []) {
      const raw = await fetchText(`${ASSET_BASE}/lib/${folder}/${filename}`);
      files.push({ path: `lib/${folder}/${filename}`, content: renamePrefix(raw, prefix) });
    }
  }

  const [tokens, tailwindConfig] = await Promise.all([
    fetchText(`${ASSET_BASE}/styles/tokens.css`),
    fetchText(`${ASSET_BASE}/tailwind.config.js`),
  ]);
  files.push({ path: 'styles/tokens.css', content: renamePrefix(tokens, prefix) });
  files.push({ path: 'tailwind.config.js', content: renamePrefix(tailwindConfig, prefix) });
  files.push({ path: 'public-api.ts', content: buildPublicApi(components, prefix) });

  return { files, components };
}
