#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';

const run = promisify(execFile);
const runPath = resolve(process.argv[2] || 'agent/examples/energia-move');
const proposal = JSON.parse(await readFile(resolve(runPath, 'proposal.json'), 'utf8'));
if (proposal.status !== 'sdc_approved') {
  console.error(`[ERROR] La propuesta debe estar en sdc_approved antes de preparar la pull request. Estado actual: ${proposal.status}.`);
  process.exit(1);
}
const slug = process.argv.includes('--slug') ? process.argv[process.argv.indexOf('--slug') + 1] : proposal.run_id.split('-').slice(0, -1).join('-');
const branch = `codex/landing-${slug}`;
const title = `Landing: ${proposal.run_id}`;
const body = `## Resumen\n\n- Ejecución: \`${proposal.run_id}\`\n- Estado: \`${proposal.status}\`\n- Componentes reutilizados: ${proposal.components.filter((component) => component.status === 'catalog').map((component) => component.component_id).join(', ')}\n- Componentes candidatos: ${proposal.components.filter((component) => component.status !== 'catalog').map((component) => component.component_id).join(', ') || 'ninguno'}\n- Drupal: crear como draft\n\n## Validaciones\n\n- HTML responsive generado\n- Inspector de componentes incluido\n- Aprobación humana registrada\n- El agente no publica automáticamente\n`;

const status = await git('status', '--porcelain');
const unrelated = status.split(/\r?\n/).filter(Boolean).filter((line) => {
  const path = line.slice(3).replace(/^"|"$/g, '').replaceAll('\\', '/');
  const target = runPath.replaceAll('\\', '/').replace(/\/$/, '');
  return !(path === target || path.startsWith(`${target}/`));
});
if (unrelated.length) {
  console.error('[ERROR] El repositorio tiene cambios no relacionados con la ejecución:\n' + unrelated.join('\n'));
  process.exit(1);
}
if (await gitSucceeds('rev-parse', '--verify', branch)) {
  await git('switch', branch);
} else if (await gitSucceeds('rev-parse', '--verify', `origin/${branch}`)) {
  await git('switch', '-c', branch, '--track', `origin/${branch}`);
} else {
  await git('switch', '-c', branch);
}
await git('add', runPath);
if (!(await gitSucceeds('diff', '--cached', '--quiet'))) await git('commit', '-m', title);
await git('push', '--set-upstream', 'origin', branch);

const remote = (await git('remote', 'get-url', 'origin')).trim();
const match = remote.match(/github\.com[/:]([^/]+)\/([^/.]+?)(?:\.git)?$/i);
const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const base = await githubBaseBranch();
if (!match || !githubToken) {
  console.log(JSON.stringify({ branch, pushed: true, pull_request: null, message: 'Rama publicada. Falta GITHUB_TOKEN para crear la pull request automáticamente.' }, null, 2));
  process.exit(0);
}

const headers = {
  accept: 'application/vnd.github+json',
  authorization: `Bearer ${githubToken}`,
  'x-github-api-version': '2022-11-28',
  'content-type': 'application/json'
};
const listResponse = await fetch(`https://api.github.com/repos/${match[1]}/${match[2]}/pulls?state=open&head=${encodeURIComponent(`${match[1]}:${branch}`)}&base=${encodeURIComponent(base)}`, { headers });
if (!listResponse.ok) {
  console.error(`[ERROR] GitHub no pudo consultar pull requests existentes: ${listResponse.status} ${await listResponse.text()}`);
  process.exit(1);
}
const existing = await listResponse.json();
if (existing[0]) {
  console.log(JSON.stringify({ branch, pushed: true, pull_request: existing[0].html_url, reused: true }, null, 2));
  process.exit(0);
}

const response = await fetch(`https://api.github.com/repos/${match[1]}/${match[2]}/pulls`, {
  method: 'POST',
  headers,
  body: JSON.stringify({ title, head: branch, base, body })
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

async function gitSucceeds(...args) {
  try {
    await run('git', args, { cwd: process.cwd(), encoding: 'utf8' });
    return true;
  } catch {
    return false;
  }
}

async function githubBaseBranch() {
  try {
    return (await git('symbolic-ref', '--short', 'refs/remotes/origin/HEAD')).replace(/^origin\//, '').trim();
  } catch {
    return 'main';
  }
}
