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

## Catálogo canónico para Drupal Canvas

| ID | Componente | Uso en la PoC | Estado |
| --- | --- | --- | --- |
| C00 | `site-header` | Marca y navegación global | Implementado |
| C01 | `hero` | Propuesta de valor y CTAs principales | Implementado |
| C02 | `rich-text` | Contenido editorial | Implementado |
| C03 | `image-text` | Imagen y explicación editorial | Implementado |
| C04 | `feature-grid` | Beneficios o capacidades | Implementado |
| C05 | `card-grid` | Soluciones o contenidos navegables | Implementado |
| C06 | `stats` | Métricas y datos destacados | Implementado |
| C07 | `steps` | Procesos y fases | Implementado |
| C08 | `quote` | Cita o testimonio | Implementado |
| C09 | `accordion` | Preguntas frecuentes | Implementado |
| C10 | `cta-banner` | Llamada a la acción | Implementado |
| C99 | `site-footer` | Navegación secundaria y legal | Implementado |

Los componentes antiguos (`hero-promotional`, `offer-card`, `benefits-grid`, `faq-accordion` y `trust-strip`) se mantienen como compatibilidad con la demo anterior, pero no forman parte de la API canónica para nuevas landings.

## Compatibilidad con Drupal Canvas

- El tema activa `enforce_prop_schemas: true`.
- Cada componente canónico tiene un fichero `.component.yml` con JSON Schema.
- Las variantes son enumeraciones cerradas, no componentes duplicados.
- Los arrays declaran límites `minItems`/`maxItems` para facilitar formularios de Canvas.
- El agente debe reutilizar props y componentes existentes antes de proponer extensiones.
- Las páginas Canvas deben ensamblarse con el árbol de componentes; header y footer permanecen globales del tema.

## Contrato para generación de landings Canvas

Una landing Canvas generada debe proporcionar, como mínimo:

1. Un único `hero` con un único `h1`, descripción y CTA principal.
2. Componentes de contenido del catálogo según el briefing: `rich-text`, `feature-grid`, `image-text`, `card-grid`, `stats`, `steps`, `quote`, `accordion` y `cta-banner`.
3. `site-header` y `site-footer` como elementos globales del tema, no como bloques dentro del contenido Canvas.
4. Texto alternativo para toda imagen y controles operables con teclado.
5. El estado editorial de cada dato: validado, ilustrativo, `pending_validation` o bloqueado.

El agente debe priorizar la composición existente y los campos existentes. Solo puede proponer una extensión tras explicar por qué no existe una combinación suficiente y obtener aprobación.

## Reglas visuales de referencia

- Contenedor máximo aproximado: 1180px.
- Tipografía sans-serif limpia, titulares grandes con tracking negativo y cuerpo de alto contraste.
- Acción primaria en naranja/coral; azul marino para superficies de contraste y datos destacados.
- Hero dividido: contenido a la izquierda e imagen editorial a la derecha.
- Image-text en dos columnas con imagen dominante y CTA de contorno.
- Feature grid con iconos lineales en círculos claros y divisores verticales.
- Stats y CTA con fondos oscuros, degradados azules y acentos de luz.
- Card grid con imágenes visuales, tarjetas elevadas y una tarjeta destacada.
- Quote sobre superficie azul clara y acordeón con controles nativos.
- En móvil, todas las composiciones pasan a una columna y se mantienen los objetivos táctiles.

Los componentes se pueden incluir directamente desde Twig con la sintaxis SDC. En Canvas, los mismos componentes se descubren desde sus ficheros `.component.yml`; las propiedades deben tener título, ejemplos para campos obligatorios y tipos compatibles con Canvas:

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
