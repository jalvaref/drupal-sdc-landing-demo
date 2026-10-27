#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const runPath = resolve(process.argv[2] || 'agent/examples/energia-move');
const toFlag = process.argv.indexOf('--to');
const commentFlag = process.argv.indexOf('--comment');
const nextStatus = toFlag >= 0 ? process.argv[toFlag + 1] : '';
const comment = commentFlag >= 0 ? process.argv[commentFlag + 1] || '' : '';
const allowed = ['visual_approved', 'html_approved', 'sdc_approved'];
const proposalFile = resolve(runPath, 'proposal.json');
const proposal = JSON.parse(await readFile(proposalFile, 'utf8'));

if (!allowed.includes(nextStatus)) {
  console.error(`Uso: node agent/bin/approve-run.mjs <run> --to ${allowed.join('|')} [--comment "..."]`);
  process.exit(1);
}

const transitions = {
  visual_draft: 'visual_approved',
  visual_approved: 'html_approved',
  html_draft: 'html_approved',
  html_approved: 'sdc_approved'
};
if (transitions[proposal.status] !== nextStatus) {
  console.error(`[ERROR] Transición no válida: ${proposal.status} -> ${nextStatus}.`);
  process.exit(1);
}

proposal.status = nextStatus;
proposal.approval = {
  approved: true,
  approved_by: process.env.USERNAME || process.env.USER || 'local-user',
  approved_at: new Date().toISOString(),
  comment: comment || 'Aprobado para continuar a la siguiente fase.'
};
await writeFile(proposalFile, JSON.stringify(proposal, null, 2) + '\n');
console.log(`[OK] ${proposal.run_id}: ${nextStatus}`);
