#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const [, , briefPath, ...args] = process.argv;
const outFlag = args.indexOf('--out');
const output = resolve(outFlag >= 0 && args[outFlag + 1] ? args[outFlag + 1] : 'agent/runs/llm-components.json');

if (!briefPath) {
  console.error('Uso: node agent/bin/generate-llm-components.mjs <brief.json> [--out <components.json>]');
  process.exit(1);
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('[ERROR] Falta OPENAI_API_KEY para usar el proveedor openai.');
  process.exit(1);
}

const brief = JSON.parse(await readFile(resolve(briefPath), 'utf8'));
const catalogPath = resolve('knowledge/component-catalog.yaml');
const catalog = await readFile(catalogPath, 'utf8');
const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const model = process.env.OPENAI_MODEL || 'gpt-5.1';

const response = await fetch(`${baseUrl}/responses`, {
  method: 'POST',
  headers: {
    accept: 'application/json',
    authorization: `Bearer ${apiKey}`,
    'content-type': 'application/json'
  },
  body: JSON.stringify({
    model,
    store: false,
    instructions: [
      'Eres un diseñador senior de landings gobernadas para Drupal SDC.',
      'Genera decisiones visuales y de composición directamente a partir del briefing.',
      'Usa exclusivamente componentes catalogados para C00, C01, C03, C05, C09, C10 y C99.',
      'Solo crea componentes candidatos C11-C98 si el briefing tiene una necesidad que el catálogo no cubre.',
      'El contenido puede ser ficticio, pero debe ser profesional, coherente con el briefing y marcarse pending_validation.',
      'Prioriza responsive mobile, claridad de CTA, accesibilidad y trazabilidad.'
    ].join(' '),
    input: [
      {
        role: 'user',
        content: [{ type: 'input_text', text: `BRIEFING JSON:\n${JSON.stringify(brief, null, 2)}\n\nCATÁLOGO YAML:\n${catalog}` }]
      }
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'landing_design',
        // props is intentionally open because each catalog component has its
        // own prop contract. The response is checked again by the local run
        // validator before it can advance to the approval stage.
        strict: false,
        schema: {
          type: 'object',
          additionalProperties: false,
          required: ['components', 'design_direction'],
          properties: {
            design_direction: {
              type: 'object',
              additionalProperties: false,
              required: ['palette', 'layout', 'visual_rationale'],
              properties: {
                palette: { type: 'string' },
                layout: { type: 'string' },
                visual_rationale: { type: 'string' }
              }
            },
            components: {
              type: 'array',
              minItems: 7,
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['component_id', 'name', 'variant', 'props', 'status', 'justification', 'content_status', 'source_requirements'],
                properties: {
                  component_id: { type: 'string', pattern: '^C[0-9]{2}$' },
                  name: { type: 'string' },
                  variant: { type: 'string' },
                  props: { type: 'object', additionalProperties: true },
                  status: { type: 'string', enum: ['catalog', 'experimental', 'candidate'] },
                  justification: { type: 'string' },
                  content_status: { type: 'string', enum: ['validated', 'pending_validation', 'blocked'] },
                  source_requirements: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        }
      }
    }
  })
});

const payload = await response.text();
if (!response.ok) {
  console.error(`[ERROR] El proveedor LLM respondió ${response.status}: ${redact(payload)}`);
  process.exit(1);
}

const result = JSON.parse(payload);
const text = result.output_text || result.output?.flatMap((item) => item.content || []).find((item) => item.type === 'output_text')?.text;
if (!text) {
  console.error('[ERROR] La respuesta del proveedor no contiene output_text.');
  process.exit(1);
}

const generated = JSON.parse(text);
await writeFile(output, JSON.stringify({ model, generated }, null, 2) + '\n');
console.log(JSON.stringify({ output, model, components: generated.components.length }, null, 2));

function redact(value) {
  return value.replace(/Bearer\s+[^\s"']+/gi, 'Bearer [REDACTED]').slice(0, 1200);
}
