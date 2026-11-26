# Nexo Energía · hogar y movilidad

Paquete SDC de una landing ficticia y demostrativa. No contiene una oferta comercial real, contratación, persistencia de datos ni llamadas a sistemas externos.

## Estado

- Estado de paquete: `awaiting_sdc_approval`.
- Destino Drupal: `draft`, `drupal_status: 0`.
- Clasificación: `code_deploy_required`.
- Motivo: incorpora activos públicos al tema y utiliza C11/C12, componentes experimentales existentes que deben estar disponibles en Dev antes de importar Canvas.

## Contenido

- `canvas-composition.yaml`: nueve instancias Canvas, sin cabecera ni pie globales.
- `proposal.json`: propuesta aprobada visualmente y en HTML, con el paquete SDC pendiente de aprobación.
- `candidate-components.yaml`: inventario de C11/C12 ya existentes; no se recrean Twig, CSS, JavaScript, fixtures ni contratos.
- `assets/`: activos ilustrativos incluidos en el paquete y disponibles también en el tema.
- `preview/`: HTML aprobado con inspector, exclusivo de revisión.
- `validation-report.md`: validaciones estructurales, contractuales y bloqueos externos.

## Activos públicos

- `/themes/custom/sdc_landing/images/hero-arrival-home.jpg`
- `/themes/custom/sdc_landing/images/editorial-routine.jpg`

## Alcance Canvas

`C01 → C02 → C04 → C11 → C12 → C03 → C07 → C09 → C10`

`site-header` y `site-footer` son globales del tema y no pertenecen al árbol Canvas. El inspector del preview tampoco se importa.
