#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

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
const approval = {
  phase: nextStatus,
  approved: true,
  approved_by: process.env.USERNAME || process.env.USER || 'local-user',
  approved_at: new Date().toISOString(),
  comment: comment || 'Aprobado para continuar a la siguiente fase.'
};
proposal.approval = approval;
proposal.approval_history = [...(proposal.approval_history || []), approval];
await writeFile(proposalFile, JSON.stringify(proposal, null, 2) + '\n');
await writeFile(join(runPath, 'approval.json'), JSON.stringify(approval, null, 2) + '\n');
try {
  const traceabilityFile = join(runPath, proposal.traceability_artifact || 'traceability.md');
  const traceability = await readFile(traceabilityFile, 'utf8');
  await writeFile(traceabilityFile, traceability.replace(/- Estado: `[^`]+`/, `- Estado: \`${nextStatus}\``).replace(/\n## Aprobación[\s\S]*$/, '') + `\n## Aprobación\n\n- Fase: \`${nextStatus}\`\n- Aprobado por: ${approval.approved_by}\n- Fecha: ${approval.approved_at}\n- Comentario: ${approval.comment}\n`);
} catch { /* Older example runs may not contain traceability yet. */ }
try {
  const manifestFile = join(runPath, 'run-manifest.json');
  const manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
  manifest.status = nextStatus;
  manifest.stage = nextStatus === 'visual_approved' ? 'html' : nextStatus === 'html_approved' ? 'sdc_package' : 'sdc_approved';
  manifest.artifacts = [...new Set([...(manifest.artifacts || []), 'approval.json'])];
  await writeFile(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
} catch { /* Example artifacts may not have an orchestration manifest. */ }
console.log(`[OK] ${proposal.run_id}: ${nextStatus}`);
