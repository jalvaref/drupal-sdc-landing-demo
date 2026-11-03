# Sistema visual y reglas de composición

## Dirección visual

- Editorial, tecnológica y profesional.
- Base clara para contenido; azul marino para contraste; naranja/coral para acciones y acentos.
- Titulares grandes, compactos y de alto contraste.
- Imágenes editoriales relacionadas con energía, tecnología, personas y operaciones.
- No utilizar elementos de marca no aprobados ni sustituir el contenido por decoración.

## Tokens de referencia

- Ink: `#111827`.
- Brand: azul marino `#142d65`.
- Action: naranja/coral `#f0442e`.
- Surface soft: `#f6f8fb`.
- Line: `#d9dee7`.
- Contenedor: aproximadamente `1180px`.
- Radios: `4px` para CTAs y `16–28px` para superficies cuando el componente lo requiera.

## Composición

- Header global, con navegación y CTA.
- Hero dividido: texto a la izquierda, imagen a la derecha.
- Rich text centrado o estrecho para contexto.
- Feature grid de tres columnas con iconos lineales y divisores.
- Image-text en dos columnas.
- Stats sobre fondo oscuro con cifras grandes.
- Steps con línea de recorrido y numeración.
- Card grid de tres columnas con tarjeta destacada.
- Quote sobre fondo azul claro.
- Accordion con `details/summary`.
- CTA final sobre fondo oscuro.
- Footer global con columnas y enlaces legales.

## Responsive

- Desktop: composición en columnas y contenedor centrado.
- Tablet: reducir gaps y mantener jerarquía.
- Mobile: una columna, imágenes con altura reducida, navegación plegable y CTAs táctiles.
- No depender de hover para entender o completar una interacción.

## Accesibilidad

- Un único `h1` por página.
- Orden semántico de headings.
- Alt significativo en imágenes informativas; alt vacío en imágenes puramente decorativas.
- Foco visible y navegación por teclado.
- Contraste suficiente entre texto y fondo.
- Acordeones y menús operables con controles nativos o equivalentes accesibles.

## Drupal Canvas

- Los SDC son la unidad reutilizable del contenido Canvas.
- Header y footer permanecen globales en el tema salvo que se configure expresamente una plantilla Canvas completa.
- El agente debe seleccionar componentes del catálogo y sus props existentes antes de pedir una extensión.
- Toda página creada por el agente queda guardada como draft; la publicación requiere revisión humana.
