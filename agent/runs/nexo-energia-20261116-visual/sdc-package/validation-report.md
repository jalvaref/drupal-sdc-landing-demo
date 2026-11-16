# Informe de validación SDC

## Validación estructural

- Composición Canvas declarada con nueve instancias y sin C00/C99 dentro del árbol.
- Página objetivo declarada como `draft` y `drupal_status: 0`.
- Un único H1 está reservado al Hero C01 en el prototipo aprobado.
- El inspector es exclusivo de `preview/index.html` y no forma parte de `canvas-composition.yaml`.
- C11 y C12 se empaquetan con metadata, Twig, CSS, JavaScript, fixtures y README existentes.

## Validación contra contratos reales

| Componente | Estado | Resultado |
| --- | --- | --- |
| C01 Hero | estable | Props y enums `split`/`light` conformes; imagen pública y alt definidos. |
| C02 RichText | estable | `body` HTML no vacío; `alignment=center`, `width=medium`. |
| C04 FeatureGrid | estable | Tres ítems escalares; `columns=3`, `variant=with-icons`, `theme=light`. |
| C11 PlanComparison | experimental | Solo props escalares declaradas en su `.component.yml`; tres planes y cuatro criterios. |
| C12 RecommendationWizard | experimental | Tres pasos y tipos `radio`; reglas y CTA con nombres exactos del contrato. |
| C03 ImageText | estable | `image_position=left`, `theme=light`, imagen pública y alt definidos. |
| C07 Steps | estable | Cuatro pasos y `variant=numbered`. |
| C09 FAQ accordion | estable | Se aplica el contrato real `title` + `items[]`, que prevalece sobre el resumen del catálogo. |
| C10 CtaBanner | estable | `theme=dark`, `variant=standard` y dos CTA como máximo. |

## Validación bloqueada / pendiente de operaciones externas

- `validate_landing_run`: pendiente de autorización para iniciar handoff externo.
- PR, despliegue Pantheon Dev e importación Canvas: pendientes de aprobación SDC y autorización explícita.
- Confirmación de biblioteca Canvas, props editables, respuesta Dev e imágenes 2xx: solo se puede ejecutar después de despliegue e importación.

## Clasificación

`code_deploy_required`: se añaden activos al tema y se usan componentes experimentales. No se debe solicitar `import_drupal_draft` antes de que el código esté desplegado en Dev.

