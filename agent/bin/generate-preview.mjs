#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

const [, , briefPath, ...rest] = process.argv;
const outFlag = rest.indexOf('--out');
const outPath = outFlag >= 0 && rest[outFlag + 1]
  ? resolve(rest[outFlag + 1])
  : resolve('agent/runs/preview');
const runIdFlag = rest.indexOf('--run-id');
const requestedRunId = runIdFlag >= 0 ? rest[runIdFlag + 1] : null;

if (!briefPath) {
  console.error('Uso: node agent/bin/generate-preview.mjs <brief.json> [--out <directorio>]');
  process.exit(1);
}

const brief = JSON.parse(await readFile(resolve(briefPath), 'utf8'));
const slug = brief.slug || slugify(brief.campaign_name);
const runId = requestedRunId || `${slug}-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}`;
const components = buildComponents(brief);
const proposal = {
  run_id: runId,
  briefing_ref: briefPath,
  status: 'visual_draft',
  visuals: {
    desktop: 'design/desktop.svg',
    mobile: 'design/mobile.svg'
  },
  components,
  html_artifact: 'preview/index.html',
  traceability_artifact: 'traceability.md',
  assumptions: [
    'El contenido de la demo puede ser ficticio y debe validarse antes de publicar.',
    'Se utiliza el catálogo actual de sdc_landing sin proponer componentes nuevos para esta primera ejecución.'
  ],
  open_questions: [
    '¿Qué condiciones comerciales definitivas deben sustituir al contenido de demo?',
    '¿Qué activos visuales aprobados deben sustituir a los placeholders?'
  ],
  blockers: [],
  approval: { approved: false }
};

await mkdir(join(outPath, 'preview'), { recursive: true });
await mkdir(join(outPath, 'design'), { recursive: true });
await writeFile(join(outPath, 'proposal.json'), JSON.stringify(proposal, null, 2) + '\n');
await writeFile(join(outPath, 'preview', 'index.html'), renderHtml(brief, components));
await writeFile(join(outPath, 'design', 'desktop.svg'), renderDesign(brief, false));
await writeFile(join(outPath, 'design', 'mobile.svg'), renderDesign(brief, true));
await writeFile(join(outPath, 'traceability.md'), renderTraceability(brief, proposal));

console.log(JSON.stringify({ run_id: runId, status: proposal.status, output: outPath, components: components.length }, null, 2));

function buildComponents(briefing) {
  const offer = briefing.offer || {};
  return [
    component('C00', 'SiteHeader', 'Utility', {
      brand_name: 'Energía en Movimiento',
      utility_label: 'Ver ofertas',
      utility_url: '#offers-title',
      phone_label: 'Te llamamos',
      phone_url: '#contact'
    }, 'Identifica la marca y ofrece acceso a la acción principal.'),
    component('C01', 'HeroPromotional', 'Partner', {
      eyebrow: 'Propuesta de demo',
      title: offer.name || briefing.campaign_name,
      description: offer.description || briefing.objective,
      benefits: offer.benefits || [],
      primary_label: cta(briefing, 'primary', 'Quiero contratar'),
      primary_url: '#offers-title',
      secondary_label: cta(briefing, 'secondary', 'Quiero que me llaméis'),
      secondary_url: '#contact',
      visual_label: 'Ilustración de movilidad eléctrica'
    }, 'Presenta la propuesta de valor y dirige a la conversión.'),
    component('C10', 'TrustStrip', 'PendingValidation', {
      label: 'Dato destacado',
      value: 'Contenido de demo pendiente de validación',
      source: 'Briefing ficticio de la POC'
    }, 'Hace visible el estado de validación de un claim.'),
    component('C03', 'OfferCard', 'Luz', {
      title: offer.name || 'Oferta principal',
      description: offer.description || 'Descripción pendiente de completar.',
      price: offer.price || '[PRECIO PENDIENTE]',
      price_note: (offer.conditions || ['Condiciones pendientes de validación.']).join(' '),
      cta_label: cta(briefing, 'primary', 'Quiero contratar'),
      cta_url: '#contact',
      badge: 'Demo'
    }, 'Presenta la oferta principal sin ocultar datos pendientes.'),
    component('C05', 'BenefitsGrid', '3-up', {
      title: 'Por qué puede encajarte',
      items: (offer.benefits || ['Una propuesta sencilla', 'Información clara', 'Acción digital']).slice(0, 4).map((text, index) => ({
        title: `Beneficio ${index + 1}`,
        text
      }))
    }, 'Resume beneficios en bloques fáciles de escanear.'),
    component('C09', 'FaqAccordion', 'Default', {
      title: 'Preguntas frecuentes',
      items: [
        { question: '¿Qué incluye la propuesta?', answer: offer.description || 'Respuesta pendiente de validación.' },
        { question: '¿Qué condiciones debo conocer?', answer: (offer.conditions || ['Condiciones pendientes de validación.']).join(' ') },
        { question: '¿Cómo puedo solicitar información?', answer: 'Puedes utilizar el formulario o pedir que te llamemos.' }
      ]
    }, 'Resuelve objeciones y deja visibles las preguntas pendientes.'),
    ...(briefing.candidate_components || []).map((candidate) => component(
      candidate.id,
      candidate.name,
      candidate.variant || 'Experimental',
      candidate.props || {},
      candidate.justification || 'Necesidad no cubierta por el catálogo actual.',
      'candidate'
    )),
    component('C99', 'SiteFooter', 'Default', {
      legal_label: 'Contenido ficticio para demostración. Revisar antes de publicar.'
    }, 'Cierra la página y diferencia la demo del contenido publicable.')
  ];
}

function component(componentId, name, variant, props, justification, status = 'catalog') {
  return {
    component_id: componentId,
    name,
    variant,
    props,
    status,
    justification,
    content_status: 'pending_validation',
    source_requirements: ['Briefing de campaña', 'Validación del usuario']
  };
}

function renderHtml(briefing, items) {
  const hero = items.find((item) => item.component_id === 'C01');
  const offer = items.find((item) => item.component_id === 'C03');
  const benefits = items.find((item) => item.component_id === 'C05');
  const faq = items.find((item) => item.component_id === 'C09');
  const trust = items.find((item) => item.component_id === 'C10');
  const header = items.find((item) => item.component_id === 'C00');
  const footer = items.find((item) => item.component_id === 'C99');
  const candidates = items.filter((item) => item.status === 'candidate' || item.status === 'experimental');
  const metadata = (item) => `data-component-id="${item.component_id}" data-component-name="${item.name}" data-variant="${item.variant}" data-content-status="${item.content_status}"`;
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(briefing.campaign_name)}</title>
  <style>
    :root{--ink:#102a43;--muted:#52606d;--brand:#087e8b;--action:#f4a261;--surface:#f5f7fa;--line:#d9e2ec;--radius:18px;--shadow:0 12px 32px rgba(16,42,67,.12)}
    *{box-sizing:border-box}body{margin:0;color:var(--ink);font:16px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;background:#fff}a{color:inherit}button,a{outline-offset:4px}.container{width:min(1120px,calc(100% - 40px));margin:auto}.demo-banner{padding:10px 20px;text-align:center;background:#fff3cd;color:#664d03;font-size:14px}.site-header{border-bottom:1px solid var(--line);background:#fff}.header-inner{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:18px 0}.brand{font-weight:800;text-decoration:none}.header-links{display:flex;gap:18px;align-items:center;font-size:14px}.hero{background:linear-gradient(135deg,#e8f6f7,#fff);padding:76px 0}.hero-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:center}.eyebrow{color:var(--brand);font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-size:13px}.hero h1{font-size:clamp(36px,6vw,64px);line-height:1.02;margin:12px 0 18px}.hero p{font-size:20px;color:var(--muted);max-width:650px}.hero ul{padding-left:20px}.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}.button{display:inline-block;padding:13px 18px;border-radius:999px;text-decoration:none;font-weight:700;background:var(--action)}.button.secondary{background:#fff;border:1px solid var(--brand)}.visual{min-height:300px;border-radius:var(--radius);background:linear-gradient(160deg,#006d77,#83c5be);display:grid;place-items:center;color:#fff;font-weight:700;text-align:center;padding:30px;box-shadow:var(--shadow)}section{padding:64px 0}.trust-strip{background:var(--ink);color:#fff}.trust-inner{display:flex;justify-content:space-between;gap:30px;align-items:center}.trust-source{color:#d9e2ec;font-size:14px}.section-title{font-size:34px;margin:0 0 24px}.offers{background:var(--surface)}.offer-card{background:#fff;padding:28px;border-radius:var(--radius);box-shadow:var(--shadow);max-width:540px}.badge{display:inline-block;background:#e8f6f7;color:var(--brand);font-weight:700;padding:5px 10px;border-radius:999px;font-size:13px}.price{font-size:32px;font-weight:800}.price-note{color:var(--muted);font-size:14px}.benefits-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.benefit{padding:22px;border:1px solid var(--line);border-radius:var(--radius)}.benefit h3{margin-top:0}.faq details{border-top:1px solid var(--line);padding:18px 0}.faq summary{cursor:pointer;font-weight:700}.site-footer{background:var(--ink);color:#fff;padding:30px 0}.inspector-on [data-component-id]{outline:2px dashed #e76f51;outline-offset:6px;position:relative}.inspector-on [data-component-id]::after{content:attr(data-component-id) ' · ' attr(data-component-name);position:absolute;top:8px;right:8px;background:#e76f51;color:#fff;padding:4px 7px;border-radius:5px;font-size:11px;z-index:2}.inspector{position:fixed;right:20px;bottom:20px;z-index:10;padding:12px 16px;border:0;border-radius:999px;background:var(--brand);color:#fff;font-weight:700;cursor:pointer}@media(max-width:760px){.container{width:min(100% - 28px,600px)}.header-inner,.trust-inner{align-items:flex-start;flex-direction:column}.header-links{flex-wrap:wrap}.hero{padding:48px 0}.hero-grid{grid-template-columns:1fr;gap:28px}.hero h1{font-size:42px}.benefits-grid{grid-template-columns:1fr}.trust-inner{gap:8px}}
  </style>
</head>
<body>
  <div class="demo-banner">Prototipo generado por el agente · contenido ficticio pendiente de validación</div>
  <header class="site-header" ${metadata(header)}><div class="container header-inner"><a class="brand" href="/">${esc(header.props.brand_name)}</a><nav class="header-links" aria-label="Enlaces de utilidad"><a href="#offers-title">${esc(header.props.utility_label)}</a><a href="#contact">${esc(header.props.phone_label)}</a></nav></div></header>
  <main>
    <section class="hero" ${metadata(hero)}><div class="container hero-grid"><div><div class="eyebrow">${esc(hero.props.eyebrow)}</div><h1>${esc(hero.props.title)}</h1><p>${esc(hero.props.description)}</p><ul>${hero.props.benefits.map((benefit) => `<li>${esc(benefit)}</li>`).join('')}</ul><div class="actions"><a class="button" href="${esc(hero.props.primary_url)}">${esc(hero.props.primary_label)}</a><a class="button secondary" href="${esc(hero.props.secondary_url)}">${esc(hero.props.secondary_label)}</a></div></div><div class="visual" role="img" aria-label="${esc(hero.props.visual_label)}">${esc(hero.props.visual_label)}</div></div></section>
    <section class="trust-strip" ${metadata(trust)}><div class="container trust-inner"><strong>${esc(trust.props.label)}: ${esc(trust.props.value)}</strong><span class="trust-source">Fuente: ${esc(trust.props.source)}</span></div></section>
    <section class="offers" id="offers-title" ${metadata(offer)}><div class="container"><h2 class="section-title">La propuesta</h2><article class="offer-card"><span class="badge">${esc(offer.props.badge)}</span><h3>${esc(offer.props.title)}</h3><p>${esc(offer.props.description)}</p><div class="price">${esc(offer.props.price)}</div><p class="price-note">${esc(offer.props.price_note)}</p><a class="button" href="${esc(offer.props.cta_url)}">${esc(offer.props.cta_label)}</a></article></div></section>
    <section ${metadata(benefits)}><div class="container"><h2 class="section-title">${esc(benefits.props.title)}</h2><div class="benefits-grid">${benefits.props.items.map((item) => `<article class="benefit"><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></article>`).join('')}</div></div></section>
    <section class="faq" id="faq-title" ${metadata(faq)}><div class="container"><h2 class="section-title">${esc(faq.props.title)}</h2>${faq.props.items.map((item) => `<details><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details>`).join('')}</div></section>
    ${candidates.map((candidate) => renderCandidate(candidate, metadata)).join('')}
  </main>
  <footer class="site-footer" id="contact" ${metadata(footer)}><div class="container">${esc(footer.props.legal_label)}</div></footer>
  <button class="inspector" type="button" onclick="document.body.classList.toggle('inspector-on');this.textContent=document.body.classList.contains('inspector-on')?'Ocultar inspector':'Mostrar inspector'">Mostrar inspector</button>
</body>
</html>`;
}

function renderCandidate(candidate, metadata) {
  const fields = Array.isArray(candidate.props.fields) ? candidate.props.fields : ['Nombre', 'Teléfono'];
  return `<section class="candidate-panel" ${metadata(candidate)}><div class="container"><h2 class="section-title">${esc(candidate.props.title || candidate.name)}</h2><p>${esc(candidate.props.description || 'Componente experimental generado para la POC.')}</p><form>${fields.map((field) => `<label>${esc(field)}<input type="text" name="${slugify(field)}"></label>`).join('')}<button class="button" type="button">${esc(candidate.props.submit_label || 'Enviar solicitud')}</button></form></div></section>`;
}

function renderDesign(briefing, mobile) {
  const width = mobile ? 390 : 1440;
  const height = mobile ? 1500 : 900;
  const scale = mobile ? 1 : 1;
  const title = esc(briefing.campaign_name);
  const blocks = mobile
    ? [['C00', 30, 60, 330, 55], ['C01', 30, 135, 330, 370], ['C10', 30, 535, 330, 100], ['C03', 30, 665, 330, 230], ['C05', 30, 925, 330, 220], ['C09', 30, 1175, 330, 220], ['C99', 30, 1425, 330, 45]]
    : [['C00', 60, 50, 1320, 55], ['C01', 60, 135, 1320, 360], ['C10', 60, 525, 1320, 90], ['C03', 60, 655, 630, 180], ['C05', 730, 655, 650, 180], ['C09', 60, 865, 1320, 0], ['C99', 60, 875, 1320, 25]];
  const rects = blocks.map(([id, x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${id === 'C01' ? '#e8f6f7' : id === 'C10' ? '#102a43' : '#ffffff'}" stroke="#087e8b" stroke-width="2"/><text x="${x + 18}" y="${y + 32}" fill="${id === 'C10' ? '#ffffff' : '#102a43'}" font-family="Arial" font-size="18" font-weight="700">${id}</text><text x="${x + 18}" y="${y + 58}" fill="${id === 'C10' ? '#d9e2ec' : '#52606d'}" font-family="Arial" font-size="14">Componente catalogado</text>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#f5f7fa"/><text x="${mobile ? 30 : 60}" y="28" fill="#102a43" font-family="Arial" font-size="16" font-weight="700">${title} · ${mobile ? 'Mobile 390px' : 'Desktop 1440px'}</text>${rects}</svg>`;
}

function renderTraceability(briefing, proposal) {
  return `# Trazabilidad de la propuesta\n\n- Ejecución: \`${proposal.run_id}\`\n- Campaña: ${briefing.campaign_name}\n- Estado: \`${proposal.status}\`\n- Briefing: \`${proposal.briefing_ref}\`\n\n## Decisiones de composición\n\n| ID | Componente | Variante | Justificación | Estado de contenido |\n| --- | --- | --- | --- | --- |\n${proposal.components.map((item) => `| ${item.component_id} | ${item.name} | ${item.variant} | ${item.justification} | ${item.content_status} |`).join('\n')}\n\n## Supuestos\n\n${proposal.assumptions.map((item) => `- ${item}`).join('\n')}\n\n## Preguntas abiertas\n\n${proposal.open_questions.map((item) => `- ${item}`).join('\n')}\n`;
}

function cta(briefing, priority, fallback) {
  return briefing.ctas?.find((item) => item.priority === priority)?.label || fallback;
}

function slugify(value) {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}
