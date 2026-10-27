# SDC Landing System

Tema y catálogo visual de la PoC de generación de landings.

## Principios

- Composición por componentes SDC pequeños y reutilizables.
- Un contrato de props explícito por componente para facilitar la generación automática.
- Accesibilidad por defecto: landmarks, un único `h1`, foco visible y controles nativos cuando es posible.
- Contenido pendiente claramente marcado para evitar publicar datos sin fuente o validación.
- Los componentes no contienen lógica de negocio ni llamadas externas; reciben datos ya normalizados.

## Tokens

Los tokens globales viven en `css/global.css` como variables `--sdc-*`:

- Color: `ink`, `brand`, `action`, `success`, `surface` y `line`.
- Forma: `radius-md` y `radius-lg`.
- Elevación: `shadow-sm` y `shadow-md`.
- Espaciado: escala `space-2` a `space-8`.
- Layout: `content-width`.

## Catálogo inicial

| ID | Componente | Uso en la PoC | Estado |
| --- | --- | --- | --- |
| C00 | `site-header` | Marca, navegación de utilidad y teléfono | Catalogado |
| C01 | `hero-promotional` | Propuesta de valor y CTAs principales | Catalogado |
| C03 | `offer-card` | Comparación de ofertas o tarifas | Catalogado |
| C05 | `benefits-grid` | Argumentos de valor escaneables | Catalogado |
| C09 | `faq-accordion` | Resolución de objeciones | Catalogado |
| C10 | `trust-strip` | Datos de confianza con fuente pendiente | Catalogado |
| C99 | `site-footer` | Legal, estado de la demo y retorno | Catalogado |

## Contrato para generación de landings

Una landing generada debe proporcionar, como mínimo:

1. Un `hero-promotional` con título, descripción, beneficios y dos CTAs.
2. Una o más `offer-card` cuando exista una decisión comercial.
3. Un `trust-strip` para cualquier dato cuantitativo que requiera fuente.
4. Un `faq-accordion` para preguntas y condiciones.
5. El estado editorial de cada dato: validado, pendiente o bloqueado.

Los componentes se pueden incluir directamente desde Twig con la sintaxis SDC:

```twig
{% include 'sdc_landing:offer-card' with {
  title: 'Luz',
  description: 'Una propuesta clara para tu hogar.',
  price: '[PRECIO PENDIENTE]',
  price_note: 'Fuente y fecha requeridas.',
  cta_label: 'Ver condiciones',
  cta_url: '#faq-title',
  badge: 'Demo'
} %}
```
