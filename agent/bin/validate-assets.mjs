#!/usr/bin/env node

import { readFile, stat } from 'node:fs/promises';
import { basename, join, resolve, sep } from 'node:path';

const runPath = resolve(process.argv[2] || 'agent/examples/energia-move');
const proposal = JSON.parse(await readFile(join(runPath, 'proposal.json'), 'utf8'));
const themeImages = resolve(process.cwd(), 'web/themes/custom/sdc_landing/images');
const errors = [];

async function isNonEmptyFile(path) {
  try {
    const info = await stat(path);
    return info.isFile() && info.size > 0;
  }
  catch {
    return false;
  }
}

function imageSource(component) {
  const props = component.props || {};
  return props.image?.src || props.image_src || '';
}

for (const componentId of ['C01', 'C03']) {
  const component = proposal.components.find((item) => item.component_id === componentId);
  if (!component) continue;
  const source = imageSource(component);
  if (!source) {
    errors.push(`${componentId}: falta la referencia de imagen.`);
    continue;
  }
  if (/^(?:preview\/|file:\/\/|https?:\/\/[^/]*\/.*(?:temporary|tmp))/i.test(source)) {
    errors.push(`${componentId}: referencia de imagen no permitida: ${source}`);
    continue;
  }
  if (/^https?:\/\//i.test(source)) continue;

  let targetName;
  if (source.startsWith('/themes/custom/sdc_landing/images/')) {
    targetName = basename(source);
  }
  else {
    const sourcePath = resolve(runPath, source);
    if (!await isNonEmptyFile(sourcePath)) {
      errors.push(`${componentId}: el asset de origen no existe o está vacío: ${source}`);
      continue;
    }
    targetName = basename(source);
  }

  const targetPath = join(themeImages, targetName);
  if (!targetPath.startsWith(themeImages + sep) || !await isNonEmptyFile(targetPath)) {
    errors.push(`${componentId}: el asset no está disponible en el tema con el nombre final ${targetName}. Se esperaba: ${targetPath}`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `[ERROR] ${error}`).join('\n'));
  process.exit(1);
}

console.log(`[OK] Assets de ${proposal.run_id}: referencias de imagen resolubles en el tema desplegable.`);
