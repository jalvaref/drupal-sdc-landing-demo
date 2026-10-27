#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const runPath = resolve(process.argv[2] || 'agent/examples/energia-move');
const proposal = JSON.parse(await readFile(join(runPath, 'proposal.json'), 'utf8'));
const html = await readFile(join(runPath, 'preview', 'index.html'), 'utf8');
let runManifest = null;
try { runManifest = JSON.parse(await readFile(join(runPath, 'run-manifest.json'), 'utf8')); } catch { /* Example artifacts may not have an orchestration manifest. */ }
const requiredIds = ['C00', 'C01', 'C03', 'C05', 'C09', 'C10', 'C99'];
const errors = [];

if (!['visual_draft', 'visual_approved', 'html_draft', 'html_approved', 'sdc_package_draft', 'sdc_approved'].includes(proposal.status)) errors.push(`Estado de ejecución no reconocido: ${proposal.status}.`);
if (proposal.components.length < requiredIds.length) errors.push('La propuesta debe contener los siete componentes catalogados.');
for (const id of requiredIds) {
  const item = proposal.components.find((component) => component.component_id === id);
  if (!item) errors.push(`Falta ${id}.`);
  if (item && (!item.name || !item.variant || !item.justification)) errors.push(`${id} no tiene metadatos completos.`);
  if (!html.includes(`data-component-id="${id}"`)) errors.push(`El HTML no identifica ${id}.`);
}
if ((html.match(/<h1\b/g) || []).length !== 1) errors.push('El HTML debe contener un único h1.');
if (!html.includes('Mostrar inspector')) errors.push('El HTML no contiene el inspector.');
if (runManifest && runManifest.run_id !== proposal.run_id) errors.push('run-manifest.json y proposal.json no comparten run_id.');
for (const file of ['design/desktop.svg', 'design/mobile.svg', 'traceability.md']) {
  try { await readFile(join(runPath, file)); } catch { errors.push(`Falta el artefacto ${file}.`); }
}

if (errors.length) {
  console.error(errors.map((error) => `[ERROR] ${error}`).join('\n'));
  process.exit(1);
}

console.log(`[OK] Ejecución ${proposal.run_id}: ${proposal.components.length} componentes, un h1, inspector y artefactos desktop/mobile.`);
