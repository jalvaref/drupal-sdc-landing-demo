# Informe de validación SDC

## Validación estructural

- Se declaran nueve instancias en `canvas-composition.yaml`; C00 y C99 están fuera del árbol Canvas.
- La página destino permanece en `draft` con `drupal_status: 0`.
- C01 contiene el único H1 previsto; el inspector vive exclusivamente en `preview/index.html`.
- La composición referencia dos activos públicos del tema y el paquete incluye sus copias.
- La clasificación es `code_deploy_required`: los activos del tema y los componentes experimentales deben existir en Dev antes de importar.

## Validación contra contratos reales

| Componente | Resultado |
| --- | --- |
| C01 Hero | Props reales, `variant: split`, `theme: light`, imagen pública y alt definidos. |
| C02 Rich text | `body` HTML no vacío, `alignment: center`, `width: medium`. |
| C04 Feature grid | Tres ítems escalares, `columns: 3`, `variant: with-icons`, `theme: light`. |
| C11 Plan comparison | Props escalares reales; tres planes y cuatro criterios. Experimental existente, reutilizado sin recrear código. |
| C12 Recommendation wizard | Tres pasos de tipo `radio`, reglas y CTA según su contrato. Experimental existente, reutilizado sin recrear código. |
| C03 Image and text | `image_position: left`, `theme: light`, imagen pública y alt definidos. |
| C07 Steps | Cuatro pasos y `variant: numbered`. |
| C09 Accordion | Seis pares `question_n`/`answer_n`, `default_open: 0`, `variant: faq`. |
| C10 CTA banner | `theme: dark`, `variant: standard` y dos CTA como máximo. |

## Validación bloqueada / externa

- `catalog-extension.yaml` declara un catálogo legacy vacío para que `validate-sdc-package.mjs` valide el paquete sin requerir duplicar C11/C12. Los componentes experimentales existentes permanecen documentados en `candidate-components.yaml`.
- La comprobación de biblioteca Canvas, props editables, URL Dev y respuesta de imágenes requiere despliegue e importación posteriores.
- PR, despliegue Pantheon Dev e importación Drupal no se han solicitado: requieren aprobación SDC y autorización externa explícita.
