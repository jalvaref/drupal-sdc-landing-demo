#!/usr/bin/env node

const pageUrl = process.argv[2]?.replace(/[.,;:]+$/, '');
if (!pageUrl) {
  console.error('Uso: node agent/bin/validate-imported-images.mjs <url-de-la-pagina>');
  process.exit(2);
}

const pageResponse = await fetch(pageUrl, { redirect: 'follow' });
if (!pageResponse.ok) {
  throw new Error(`La página importada no responde correctamente: HTTP ${pageResponse.status} (${pageUrl}).`);
}
const html = await pageResponse.text();
const sources = [...html.matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]);
if (!sources.length) {
  throw new Error(`La página importada no contiene imágenes que validar: ${pageUrl}.`);
}

for (const source of [...new Set(sources)]) {
  if (/^data:/i.test(source)) continue;
  const imageUrl = new URL(source, pageUrl).href;
  const response = await fetch(imageUrl, { redirect: 'follow' });
  const contentType = response.headers.get('content-type') || '';
  if (!response.ok || !contentType.toLowerCase().startsWith('image/')) {
    throw new Error(`Imagen no resoluble: ${imageUrl} (HTTP ${response.status}, ${contentType || 'sin content-type'}).`);
  }
  console.log(`[OK] ${imageUrl} (${contentType})`);
}

console.log(`[OK] ${sources.length} imágenes verificadas en ${pageUrl}.`);
