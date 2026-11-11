# Trazabilidad — energia-en-movimiento-20261111-134540

## Estado

`blocked` — transporte de artefactos inválido.

## Evidencia

El diagnóstico confirma que `proposal.json`, `preview/index.html`, los JPG y el paquete SDC llegaron con tamaño cero al repositorio remoto. No se debe reutilizar esta ejecución para importar Drupal.

## Decisión

Esta ejecución queda conservada como evidencia histórica. Debe generarse un nuevo `run_id` con artefactos no vacíos, validarse localmente y verificarse en GitHub antes de crear otra PR.

## Siguiente acción

Regenerar briefing, propuesta visual JPG, HTML y paquete SDC en una ejecución nueva. Mantener `site-header` y `site-footer` fuera de Canvas y no ejecutar el handoff hasta que el preflight remoto confirme tamaños y JSON válido.
