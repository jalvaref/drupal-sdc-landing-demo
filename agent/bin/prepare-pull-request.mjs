#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';

const run = promisify(execFile);
const runPath = resolve(process.argv[2] || 'agent/examples/energia-move');
const proposal = JSON.parse(await readFile(resolve(runPath, 'proposal.json'), 'utf8'));
const slug = process.argv.includes('--slug') ? process.argv[process.argv.indexOf('--slug') + 1] : proposal.run_id.split('-').slice(0, -1).join('-');
const branch = `codex/landing-${slug}`;
const title = `Landing: ${proposal.run_id}`;
const body = `## Resumen\n\n- Ejecución: \`${proposal.run_id}\`\n- Estado: \`${proposal.status}\`\n- Componentes reutilizados: ${proposal.components.filter((component) => component.status === 'catalog').map((component) => component.component_id).join(', ')}\n- Componentes candidatos: ${proposal.components.filter((component) => component.status !== 'catalog').map((component) => component.component_id).join(', ') || 'ninguno'}\n- Drupal: crear como draft\n\n## Validaciones\n\n- HTML responsive generado\n- Inspector de componentes incluido\n- Aprobación humana registrada\n- El agente no publica automáticamente\n`;

await git('status', '--short');
const status = await git('status', '--porcelain');
if (status.trim()) {
  console.error('[ERROR] El repositorio tiene cambios no relacionados. Haz commit o limpia el working tree antes de preparar la pull request.');
  process.exit(1);
}
await git('switch', '-c', branch);
await git('add', runPath);
await git('commit', '-m', title);
await git('push', '--set-upstream', 'origin', branch);

const remote = (await git('remote', 'get-url', 'origin')).trim();
const match = remote.match(/github\.com[/:]([^/]+)\/([^/.]+?)(?:\.git)?$/i);
if (!match || !process.env.GITHUB_TOKEN) {
  console.log(JSON.stringify({ branch, pushed: true, pull_request: null, message: 'Rama publicada. Falta GITHUB_TOKEN para crear la pull request automáticamente.' }, null, 2));
  process.exit(0);
}

const response = await fetch(`https://api.github.com/repos/${match[1]}/${match[2]}/pulls`, {
  method: 'POST',
  headers: {
    accept: 'application/vnd.github+json',
    authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'x-github-api-version': '2022-11-28',
    'content-type': 'application/json'
  },
  body: JSON.stringify({ title, head: branch, base: 'main', body })
});
if (!response.ok) {
  console.error(`[ERROR] GitHub no pudo crear la pull request: ${response.status} ${await response.text()}`);
  process.exit(1);
}
const pullRequest = await response.json();
console.log(JSON.stringify({ branch, pushed: true, pull_request: pullRequest.html_url }, null, 2));

async function git(...args) {
  const result = await run('git', args, { cwd: process.cwd(), encoding: 'utf8' });
  return result.stdout;
}
