# Catálogo SDC para Drupal Canvas

La fuente estructurada es `knowledge/component-catalog.yaml`. Este documento resume las reglas que debe aplicar el agente al componer una página Canvas. Los `.component.yml` desplegados son la autoridad final.

## Regla de selección

1. Reutilizar un componente existente.
2. Reutilizar sus campos y variantes existentes.
3. Combinar varios componentes antes de proponer una extensión.
4. Solo crear una variante o componente nuevo si la necesidad no puede resolverse con el catálogo; explicar la carencia y pedir aprobación.

## Composición canónica

El header y el footer son globales del tema y no se insertan dentro de una página Canvas. El contenido recomendado es:

`Hero → Rich text → Feature grid → Image-text → Stats → Steps → Card grid → Quote → Accordion → CTA banner`

## Referencias visuales

Cada entrada del catálogo tiene una referencia JPG en `docs/component-visuals/`. La fase visual debe usarla para definir la composición y la fase HTML debe reproducirla. La existencia de un contrato SDC no autoriza a sustituir el diseño por una tarjeta, rejilla o layout genérico.

| ID | Referencia JPG |
|---|---|
| C00 / C99 | `site-header.jpg` / `site-footer.jpg` |
| C01 | `hero.jpg` |
| C02 | `rich-text.jpg` |
| C03 | `image-text.jpg` |
| C04 | `feature-grid.jpg` |
| C05 | `card-grid.jpg` |
| C06 | `stats.jpg` |
| C07 | `steps.jpg` |
| C08 | `quote.jpg` |
| C09 | `accordion.jpg` |
| C10 | `cta-banner.jpg` |
| C11 / C12 | `plan-comparison.jpg` / `recommendation-wizard.jpg` |

No todos los bloques son obligatorios: la composición depende del briefing.

## Componentes disponibles

| ID | Componente | Cuándo usarlo | Campos principales |
| --- | --- | --- | --- |
| C00 | Site header | Global del tema | `brand_name`, `navigation`, `primary_cta` |
| C01 | Hero | Propuesta de valor principal | `eyebrow`, `title`, `description`, `image_src`, `image_alt`, `primary_label`, `primary_url`, `secondary_label`, `secondary_url` |
| C02 | Rich text | Contexto o contenido editorial | `eyebrow`, `title`, `body`, `alignment`, `width` |
| C03 | Image-text | Explicación visual de una idea | `eyebrow`, `title`, `description`, `image_src`, `image_alt`, `cta_label`, `cta_url` |
| C04 | Feature grid | Capacidades o beneficios homogéneos | `title`, `item_1_*`, `item_2_*`, `item_3_*`, `columns`, `variant` |
| C05 | Card grid | Soluciones o contenidos navegables | `title`, `cards`, `variant` |
| C06 | Stats | Datos destacados | `stat_1_*`, `stat_2_*`, `stat_3_*`, `stat_4_*`, `variant` |
| C07 | Steps | Procesos y fases ordenadas | `step_1_*`, `step_2_*`, `step_3_*`, `step_4_*`, `variant` |
| C08 | Quote | Cita o mensaje editorial | `quote`, `author`, `role`, `image` |
| C09 | Accordion | Preguntas frecuentes | `title`, `question_1`/`answer_1` … `question_4`/`answer_4`, `default_open` |
| C10 | CTA banner | Cierre y conversión | `title`, `primary_label`, `primary_url`, `theme` |
| C99 | Site footer | Global del tema | `columns`, `legal_links`, `copyright` |

## Candidatos experimentales de la prueba Nexo Energía

Los siguientes candidatos se han añadido como extensión experimental controlada. No son estables ni deben utilizarse fuera de la POC sin completar contrato, pruebas y despliegue.

| ID | Componente | Necesidad | Estado |
| --- | --- | --- | --- |
| C11 | PlanComparison | Tabla simultánea de tres alternativas con recomendación, selección y acción | `experimental` |
| C12 | RecommendationWizard | Recorrido con estado, validación, navegación y resultado condicionado | `experimental` |

La justificación, el contrato preliminar, los estados, responsive y accesibilidad están en `knowledge/experimental-candidates.md` y en el paquete de la ejecución.

## Reglas de contenido

- Un solo `h1`, dentro de `Hero`.
- Máximo un CTA principal por sección.
- Todas las imágenes tienen texto alternativo.
- Las imágenes nunca pueden conservar rutas del prototipo como `preview/...`; deben resolver a un activo público del tema o a una referencia Drupal/Media válida.
- Cifras, testimonios y claims ficticios se marcan como ilustrativos o `pending_validation`.
- No se inventan precios, logos, partners, teléfonos o condiciones comerciales.
- El contenido debe ser profesional y estar alineado con el briefing.

## Canvas

Cada componente debe usar únicamente las props declaradas en su `.component.yml`. Los campos obligatorios tienen ejemplos para que Canvas pueda inicializar el formulario. Las variantes son enums cerrados y los arrays tienen límites de cardinalidad.

### Contratos anidados críticos

- `C01 Hero`: en Canvas usa `image_src`/`image_alt` y `primary_label`/`primary_url`; no envíes `primary_cta` ni la ruta temporal `preview/...`.
- `C03 ImageText`: en Canvas usa `image_src`/`image_alt` y `cta_label`/`cta_url`.
- `C02 RichText`: `body` es HTML filtrado; para párrafos debe utilizarse, por ejemplo, `<p>Texto editorial.</p>`.
- `C04 FeatureGrid`: cada item usa `title` y `text`. `description` es la descripción del componente, no el texto interno del item.
- `C06 Stats`: cada item usa `value` y `label`; las cifras ficticias deben marcarse como ilustrativas.
- `C10 CtaBanner`: `primary_cta` requiere `label` y `url`; `secondary_cta` es opcional y no debe declararse si no aparece en el diseño aprobado.

Estos ejemplos son reglas de control para evitar errores de composición; la validación final siempre debe hacerse contra el `.component.yml` real cargado como fuente de conocimiento.

Tras generar una landing, el agente debe comprobar que los componentes aparecen en la biblioteca, que sus props se editan, que la página se guarda y que el estado queda como draft.

## Límites de Canvas y despliegue

- `site-header` y `site-footer` son globales del tema: no forman parte del árbol Canvas, pero deben aparecer en la plantilla global que envuelve `page.content`.
- El inspector superpuesto solo se entrega en el HTML de revisión; no se importa en Drupal.
- Tras un despliegue Pantheon hay que esperar el build de Composer y validar `terminus drush <site>.dev -- status` antes de reconstruir cachés o importar.
- Si el editor muestra `Unexpected token '<'`, revisar que `/canvas/api/v0/layout/...` devuelva JSON y no HTML de Cloudflare, login o error 403.
