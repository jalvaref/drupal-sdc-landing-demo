# Nexo Energía · Hogar y movilidad

Paquete SDC de una landing completamente ficticia y demostrativa. Todos los precios, condiciones, resultados y activos visuales son ilustrativos; no son válidos para publicación ni contratación.

## Estado y destino

- Estado: `awaiting_sdc_approval`.
- Drupal: `draft`, con `status: 0` obligatorio.
- Clasificación de handoff: `code_deploy_required`.
- El inspector de `preview/index.html` es exclusivo del prototipo y no entra en Canvas.

## Contenido

- `canvas-composition.yaml`: composición Canvas, sin `site-header` ni `site-footer`.
- `proposal.json`: propuesta y contratos de contenido.
- `assets/`: copia de los dos activos ilustrativos.
- `components/`: C11 y C12 experimentales reutilizados sin recrear código.
- `candidate-components.yaml`: alcance y controles de los candidatos.
- `validation-report.md`: resultados, contratos y bloqueos.
- `handoff.md`: clasificación y secuencia externa pendiente.

## Activos públicos requeridos

La composición referencia:

- `/themes/custom/sdc_landing/images/nexo-energia-20261116-hero.jpg`
- `/themes/custom/sdc_landing/images/nexo-energia-20261116-rutina.jpg`

Ambos se han añadido al tema con el mismo basename que la copia del paquete. Al ser activos nuevos del tema, se requiere despliegue antes de importar el draft.

## Componentes

Estables reutilizados: C01, C02, C03, C04, C07, C09 y C10.

Experimentales existentes: C11 (`PlanComparison`) y C12 (`RecommendationWizard`). Mantienen `status: experimental`; no se promueven a estables ni se les inventan props.

