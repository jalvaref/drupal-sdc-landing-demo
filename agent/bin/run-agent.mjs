#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const [, , briefPath, ...args] = process.argv;
const outFlag = args.indexOf('--out');
const providerFlag = args.indexOf('--provider');
const output = resolve(outFlag >= 0 && args[outFlag + 1] ? args[outFlag + 1] : join('agent', 'runs', 'latest'));
const provider = providerFlag >= 0 && args[providerFlag + 1] ? args[providerFlag + 1] : 'deterministic';

if (!briefPath) {
  console.error('Uso: node agent/bin/run-agent.mjs <brief.json> [--out <directorio>] [--provider deterministic|openai]');
  process.exit(1);
}
if (!['deterministic', 'openai'].includes(provider)) {
  console.error(`[ERROR] Proveedor no disponible: ${provider}. Usa deterministic u openai.`);
  process.exit(1);
}

const brief = JSON.parse(await readFile(resolve(briefPath), 'utf8'));
await mkdir(output, { recursive: true });
const startedAt = new Date().toISOString();
const manifest = {
  schema_version: '1.0',
  run_id: `${brief.slug || slugify(brief.campaign_name)}-${Date.now()}`,
  provider,
  source_brief: resolve(briefPath),
  status: 'running',
  stage: 'briefing',
  started_at: startedAt,
  artifacts: []
};
await saveManifest();

manifest.stage = 'visual_generation';
await saveManifest();
const generator = resolve('agent/bin/generate-preview.mjs');
let componentsPath;
if (provider === 'openai') {
  componentsPath = join(output, 'llm-components.json');
  const llmGenerator = resolve('agent/bin/generate-llm-components.mjs');
  await exec(process.execPath, [llmGenerator, resolve(briefPath), '--out', componentsPath], { cwd: process.cwd(), encoding: 'utf8' });
  manifest.artifacts.push('llm-components.json');
  manifest.stage = 'visual_generation';
  await saveManifest();
}
const generatorArgs = [generator, resolve(briefPath), '--out', output, '--run-id', manifest.run_id];
if (componentsPath) generatorArgs.push('--components-file', componentsPath);
await exec(process.execPath, generatorArgs, { cwd: process.cwd(), encoding: 'utf8' });

const validator = resolve('agent/bin/validate-run.mjs');
await exec(process.execPath, [validator, output], { cwd: process.cwd(), encoding: 'utf8' });

manifest.status = 'awaiting_visual_approval';
manifest.stage = 'visual';
manifest.artifacts = [
  'proposal.json',
  'preview/index.html',
  'design/desktop.svg',
  'design/mobile.svg',
  'traceability.md'
];
if (provider === 'openai') manifest.artifacts.push('llm-components.json');
manifest.completed_at = new Date().toISOString();
await saveManifest();
console.log(JSON.stringify({ run_id: manifest.run_id, status: manifest.status, output, next: 'approve visual proposal before generating the SDC package' }, null, 2));

async function saveManifest() {
  await writeFile(join(output, 'run-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
}

function slugify(value) {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
