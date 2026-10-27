#!/usr/bin/env node

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const runPath = resolve(process.argv[2] || 'agent/examples/energia-move');
const outputFlag = process.argv.indexOf('--out');
const outPath = resolve(outputFlag >= 0 && process.argv[outputFlag + 1] ? process.argv[outputFlag + 1] : join(runPath, 'sdc-package'));
const proposal = JSON.parse(await readFile(join(runPath, 'proposal.json'), 'utf8'));

if (proposal.status !== 'html_approved' && proposal.status !== 'sdc_approved') {
  console.error(`[ERROR] El HTML debe estar aprobado antes de generar SDC. Estado actual: ${proposal.status}.`);
  process.exit(1);
}

const candidates = proposal.components.filter((component) => component.status === 'candidate' || component.status === 'experimental');
await mkdir(outPath, { recursive: true });
await rm(join(outPath, 'components'), { recursive: true, force: true });
await writeFile(join(outPath, 'package-manifest.json'), JSON.stringify({
  schema_version: '1.0',
  run_id: proposal.run_id,
  source_proposal: '../proposal.json',
  status: proposal.status === 'sdc_approved' ? 'approved' : 'draft',
  reused_components: proposal.components.filter((component) => component.status === 'catalog').map((component) => component.component_id),
  candidate_components: candidates.map((component) => component.component_id),
  drupal_target: 'draft'
}, null, 2) + '\n');
await writeFile(join(outPath, 'catalog-extension.yaml'), candidates.length
  ? `schema_version: "1.0"\ncomponents:\n${candidates.map((candidate) => `  - id: "${candidate.component_id}"\n    name: "${candidate.name}"\n    status: "experimental"\n    variant: "${candidate.variant}"\n    path: "components/${slugify(candidate.name)}"\n    source_run: "${proposal.run_id}"\n    props: [${Object.keys(candidate.props || {}).map((prop) => `"${prop}"`).join(', ')}]\n`).join('')}`
  : 'schema_version: "1.0"\ncomponents: []\n');

for (const candidate of candidates) {
  const slug = slugify(candidate.name);
  const componentDir = join(outPath, 'components', slug);
  await mkdir(componentDir, { recursive: true });
  await writeFile(join(componentDir, `${slug}.component.yml`), `$schema: https://git.drupalcode.org/project/drupal/-/raw/11.x/core/assets/schemas/v1/metadata.schema.json\nname: ${candidate.name}\nstatus: experimental\nprops:\n  type: object\n  properties:\n${propsToYaml(candidate.props)}`);
  await writeFile(join(componentDir, `${slug}.twig`), `<section class="${slug}" data-component-id="${candidate.component_id}">\n  <h2>{{ title|default('${candidate.name}') }}</h2>\n  <p>{{ description|default('Contenido pendiente de completar.') }}</p>\n  {# Candidate generated from approved HTML. Complete props before cataloguing. #}\n</section>\n`);
  await writeFile(join(componentDir, `${slug}.css`), `.${slug} {\n  padding: var(--sdc-space-6, 2rem);\n  border: 1px solid var(--sdc-line, #d9e2ec);\n  border-radius: var(--sdc-radius-lg, 1rem);\n  background: var(--sdc-surface, #f5f7fa);\n}\n`);
  await writeFile(join(componentDir, `${slug}.stories.json`), JSON.stringify({
    component_id: candidate.component_id,
    name: candidate.name,
    variant: candidate.variant,
    props: candidate.props || {},
    status: 'experimental'
  }, null, 2) + '\n');
  await writeFile(join(componentDir, 'README.md'), `# ${candidate.name}\n\nEstado: experimental.\n\nJustificación: ${candidate.justification}\n\nLa anatomía y los props deben completarse antes de incorporar el componente al catálogo.\n`);
}

await writeFile(join(outPath, 'handoff.md'), `# SDC handoff\n\n- Run: \`${proposal.run_id}\`\n- Estado: \`${proposal.status}\`\n- Componentes reutilizados: ${proposal.components.filter((component) => component.status === 'catalog').map((component) => component.component_id).join(', ') || 'ninguno'}\n- Componentes candidatos: ${candidates.map((component) => component.component_id).join(', ') || 'ninguno'}\n- Destino Drupal: draft\n\n## Decisión\n\nEl paquete solo contiene componentes candidatos o experimentales. Los componentes catalogados se consumen desde el tema existente.\n`);
console.log(JSON.stringify({ run_id: proposal.run_id, status: proposal.status, output: outPath, candidates: candidates.length }, null, 2));

function slugify(value) {
  return String(value).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function propsToYaml(props = {}) {
  const entries = Object.entries(props);
  return entries.length
    ? entries.map(([name, value]) => `    ${name}: { type: ${Array.isArray(value) ? 'array' : 'string'} }`).join('\n') + '\n'
    : '    # Props pendientes de especificación\n';
}
