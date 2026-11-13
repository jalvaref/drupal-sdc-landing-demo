# Paquete SDC · Nexo Energía

Run: `nexo-energia-20261112-visual`

Estado: `sdc_package_draft` · pendiente de aprobación SDC.

## Contenido

- `canvas-composition.yaml`: composición prevista para Drupal Canvas; mantiene draft/status 0.
- `proposal.json`: propuesta aprobada en HTML y convertida a borrador de paquete SDC.
- `candidate-components.yaml`: contratos preliminares de los candidatos experimentales.
- `components/plan-comparison`: candidato `C11`.
- `components/recommendation-wizard`: candidato `C12`.
- `assets/nexo-energia-hero.jpg`: creatividad editorial ficticia optimizada para el handoff, con alt documentado en la propuesta.
- `design/desktop.jpg` y `design/mobile.jpg`: evidencias visuales aprobadas.
- `preview/index.html`: prototipo de revisión con inspector; no se importa a Canvas.
- `validation-report.md`: validación estructural, contratos reales y bloqueos.

## Componentes

Se consumen desde el tema estable, sin recrear código: `C01`, `C02`, `C03`, `C04`, `C06`, `C07`, `C09` y `C10`.

Se entregan como experimentales: `C11 Plan comparison` y `C12 Recommendation wizard`. No deben considerarse estables ni publicarse en el catálogo sin validación adicional.

## Seguridad y handoff

Este paquete no ejecuta PR, despliegue ni importación. Drupal debe recibir la landing como borrador (`status: 0`). La decisión de handoff y la clasificación `code_deploy_required` quedan documentadas en `validation-report.md` y `handoff.md`.
