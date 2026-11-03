# Catálogo SDC para Drupal Canvas

La fuente estructurada es `knowledge/component-catalog.yaml`. Este documento resume las reglas que debe aplicar el agente al componer una página Canvas.

## Regla de selección

1. Reutilizar un componente existente.
2. Reutilizar sus campos y variantes existentes.
3. Combinar varios componentes antes de proponer una extensión.
4. Solo crear una variante o componente nuevo si la necesidad no puede resolverse con el catálogo; explicar la carencia y pedir aprobación.

## Composición canónica

El header y el footer son globales del tema y no se insertan dentro de una página Canvas. El contenido recomendado es:

`Hero → Rich text → Feature grid → Image-text → Stats → Steps → Card grid → Quote → Accordion → CTA banner`

No todos los bloques son obligatorios: la composición depende del briefing.

## Componentes disponibles

| ID | Componente | Cuándo usarlo | Campos principales |
| --- | --- | --- | --- |
| C00 | Site header | Global del tema | `brand_name`, `navigation`, `primary_cta` |
| C01 | Hero | Propuesta de valor principal | `eyebrow`, `title`, `description`, `image`, CTAs |
| C02 | Rich text | Contexto o contenido editorial | `eyebrow`, `title`, `body`, `alignment`, `width` |
| C03 | Image-text | Explicación visual de una idea | `eyebrow`, `title`, `description`, `image`, `cta` |
| C04 | Feature grid | Capacidades o beneficios homogéneos | `title`, `items`, `columns`, `variant` |
| C05 | Card grid | Soluciones o contenidos navegables | `title`, `cards`, `variant` |
| C06 | Stats | Datos destacados | `items`, `variant` |
| C07 | Steps | Procesos y fases ordenadas | `items`, `variant` |
| C08 | Quote | Cita o mensaje editorial | `quote`, `author`, `role`, `image` |
| C09 | Accordion | Preguntas frecuentes | `title`, `items`, `default_open` |
| C10 | CTA banner | Cierre y conversión | `title`, `primary_cta`, `theme` |
| C99 | Site footer | Global del tema | `columns`, `legal_links`, `copyright` |

## Reglas de contenido

- Un solo `h1`, dentro de `Hero`.
- Máximo un CTA principal por sección.
- Todas las imágenes tienen texto alternativo.
- Cifras, testimonios y claims ficticios se marcan como ilustrativos o `pending_validation`.
- No se inventan precios, logos, partners, teléfonos o condiciones comerciales.
- El contenido debe ser profesional y estar alineado con el briefing.

## Canvas

Cada componente debe usar únicamente las props declaradas en su `.component.yml`. Los campos obligatorios tienen ejemplos para que Canvas pueda inicializar el formulario. Las variantes son enums cerrados y los arrays tienen límites de cardinalidad.

Tras generar una landing, el agente debe comprobar que los componentes aparecen en la biblioteca, que sus props se editan, que la página se guarda y que el estado queda como draft.
