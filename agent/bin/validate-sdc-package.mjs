#!/usr/bin/env node

import { access, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const packagePath = resolve(process.argv[2] || 'agent/examples/energia-move/sdc-package');
const manifest = JSON.parse(await readFile(join(packagePath, 'package-manifest.json'), 'utf8'));
const errors = [];

for (const file of ['package-manifest.json', 'catalog-extension.yaml', 'handoff.md']) {
  try { await access(join(packagePath, file)); } catch { errors.push(`Falta ${file}.`); }
}

const candidates = manifest.candidate_components || [];
for (const componentId of candidates) {
  const component = await findComponentDirectory(packagePath, componentId);
  if (!component) {
    errors.push(`No se ha encontrado el directorio del candidato ${componentId}.`);
    continue;
  }
  for (const suffix of ['.component.yml', '.twig', '.css', '.stories.json']) {
    try { await access(join(component.path, `${component.name}${suffix}`)); } catch { errors.push(`Falta ${component.name}${suffix}.`); }
  }
  try { await access(join(component.path, 'README.md')); } catch { errors.push(`Falta ${component.name}/README.md.`); }
  try {
    const fixture = JSON.parse(await readFile(join(component.path, `${component.name}.stories.json`), 'utf8'));
    if (fixture.component_id !== componentId) errors.push(`El fixture de ${componentId} no coincide con el ID.`);
  } catch { /* The missing/invalid fixture is reported by the checks above. */ }
  const twig = await readFile(join(component.path, `${component.name}.twig`), 'utf8');
  if (!twig.includes(`data-component-id="${componentId}"`)) errors.push(`El Twig de ${componentId} no expone data-component-id.`);
}

if (errors.length) {
  console.error(errors.map((error) => `[ERROR] ${error}`).join('\n'));
  process.exit(1);
}
console.log(`[OK] Paquete SDC ${manifest.run_id}: ${candidates.length} candidatos con YAML, Twig, CSS, fixture y README.`);

async function findComponentDirectory(root, componentId) {
  const catalog = await readFile(join(root, 'catalog-extension.yaml'), 'utf8');
  const match = new RegExp(`id: "${componentId}"[\\s\\S]*?path: "components/([^"/]+)"`).exec(catalog);
  return match ? { path: join(root, 'components', match[1]), name: match[1] } : null;
}
