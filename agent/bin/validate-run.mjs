#!/usr/bin/env node

import { readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const runPath = resolve(process.argv[2] || 'agent/examples/energia-move');
const proposal = JSON.parse(await readFile(join(runPath, 'proposal.json'), 'utf8'));
const html = await readFile(join(runPath, 'preview', 'index.html'), 'utf8');
let runManifest = null;
try { runManifest = JSON.parse(await readFile(join(runPath, 'run-manifest.json'), 'utf8')); } catch { /* Example artifacts may not have an orchestration manifest. */ }
const requiredIds = ['C01', 'C02', 'C03', 'C04', 'C07', 'C09', 'C10'];
const optionalIds = ['C06', 'C11', 'C12'];
const allowedIds = new Set([...requiredIds, ...optionalIds]);
const errors = [];

if (!['visual_draft', 'visual_approved', 'html_draft', 'html_approved', 'sdc_package_draft', 'sdc_approved'].includes(proposal.status)) errors.push(`Estado de ejecución no reconocido: ${proposal.status}.`);
const componentIds = proposal.components.map((component) => component.component_id);
const duplicateIds = componentIds.filter((id, index) => componentIds.indexOf(id) !== index);
if (duplicateIds.length) errors.push(`La propuesta contiene componentes duplicados: ${[...new Set(duplicateIds)].join(', ')}.`);
const unknownIds = [...new Set(componentIds.filter((id) => !allowedIds.has(id)))];
if (unknownIds.length) errors.push(`La propuesta contiene componentes no catalogados para este flujo: ${unknownIds.join(', ')}.`);
for (const id of requiredIds) {
  const item = proposal.components.find((component) => component.component_id === id);
  if (!item) errors.push(`Falta ${id}.`);
  if (item && (!item.name || !item.variant || !item.justification)) errors.push(`${id} no tiene metadatos completos.`);
  if (!html.includes(`data-component-id="${id}"`)) errors.push(`El HTML no identifica ${id}.`);
}
for (const id of optionalIds) {
  const item = proposal.components.find((component) => component.component_id === id);
  if (!item) continue;
  if (!item.name || !item.variant || !item.justification) errors.push(`${id} no tiene metadatos completos.`);
  if (!html.includes(`data-component-id="${id}"`)) errors.push(`El HTML no identifica ${id}.`);
}
if ((html.match(/<h1\b/g) || []).length !== 1) errors.push('El HTML debe contener un único h1.');
if (!html.includes('Mostrar inspector')) errors.push('El HTML no contiene el inspector.');
if (!proposal.design_direction || !proposal.design_direction.palette || !proposal.design_direction.layout || !proposal.design_direction.visual_rationale) errors.push('Falta design_direction completo.');
if (!html.toLocaleLowerCase('es-ES').includes('concepto de demostración')) errors.push('Falta el aviso obligatorio de demostración.');
if (html.includes('data-component-id="C00"') || html.includes('data-component-id="C99"')) errors.push('C00/C99 no deben estar dentro del contenido Canvas.');
if (runManifest && runManifest.run_id !== proposal.run_id) errors.push('run-manifest.json y proposal.json no comparten run_id.');
for (const file of ['design/desktop.jpg', 'design/mobile.jpg', 'traceability.md']) {
  try {
    const info = await stat(join(runPath, file));
    if (!info.isFile() || info.size === 0) errors.push(`El artefacto ${file} está vacío.`);
  } catch { errors.push(`Falta el artefacto ${file}.`); }
}

for (const component of proposal.components.filter((item) => ['C01', 'C03'].includes(item.component_id))) {
  const source = component.props?.image?.src || component.props?.image_src || '';
  if (!source) errors.push(`${component.component_id} no tiene referencia de imagen.`);
  if (/^(?:preview\/|file:\/\/)/i.test(source)) errors.push(`${component.component_id} usa una ruta de imagen temporal: ${source}.`);
}

if (errors.length) {
  console.error(errors.map((error) => `[ERROR] ${error}`).join('\n'));
  process.exit(1);
}

console.log(`[OK] Ejecución ${proposal.run_id}: ${proposal.components.length} componentes aceptados, un h1, inspector y artefactos desktop/mobile.`);
