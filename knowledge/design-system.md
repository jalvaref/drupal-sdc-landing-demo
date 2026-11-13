# Sistema visual y reglas de composición

## Dirección visual

- Editorial, tecnológica y profesional.
- Base clara para contenido; azul marino para contraste; naranja/coral para acciones y acentos.
- Titulares grandes, compactos y de alto contraste.
- Imágenes editoriales relacionadas con energía, tecnología, personas y operaciones.
- No utilizar elementos de marca no aprobados ni sustituir el contenido por decoración.
- La referencia visual de la primera fase debe ser editorial, limpia y consistente entre desktop y mobile. El resultado debe priorizar claridad, ritmo vertical, espacios amplios y una jerarquía tipográfica reconocible.
- El estilo de referencia validado en el prototipo de Nexo Energía combina hero dividido, superficies claras, bloques de contraste azul marino, acentos coral, tarjetas contenidas, tablas legibles y CTA final oscuro. Se reutiliza como patrón visual, no como copy ni como estructura obligatoria de futuras landings.

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
- Los JPG de diseño se generan antes del HTML. El HTML debe implementar los JPG aprobados; los SDC deben implementar el HTML aprobado conservando la misma composición visual.
- No se permite que una fase cambie unilateralmente la dirección visual, el copy aprobado, el orden de bloques, los tokens, los breakpoints o el tratamiento de imágenes. Cualquier cambio requiere volver a la aprobación de la fase afectada.

## Contrato de fidelidad entre fases

- Diseño: define la composición visual aprobable y entrega `design/desktop.jpg`, `design/mobile.jpg`, `design_direction` y trazabilidad.
- HTML: reproduce el diseño aprobado con estructura semántica, responsive e inspector de revisión. El inspector solo existe en el prototipo.
- SDC/Canvas: reproduce el HTML aprobado con props reales, activos públicos y estilos del tema. Header y footer siguen siendo globales y quedan fuera del árbol Canvas.
- Validación: compara siempre las tres capas por viewport y registra diferencias de layout, tipografía, color, imagen, interacción y contenido.

### Referencia visual por componente

Los JPG de `docs/component-visuals/` son la referencia visual de cada componente durante la fase de diseño. Antes de generar HTML, el agente debe consultar el JPG correspondiente al componente seleccionado y conservar sus rasgos estructurales:

- `hero.jpg`: composición editorial dividida, imagen integrada en el lado derecho y CTA coral.
- `rich-text.jpg`: titular editorial centrado, cuerpo de lectura controlada y lista/acento coral.
- `image-text.jpg`: imagen amplia a la izquierda y contenido alineado a la derecha.
- `feature-grid.jpg`: tres columnas sin tarjetas, iconos circulares y separadores verticales.
- `card-grid.jpg`: tarjetas con imagen superior, contenido inferior y una tarjeta destacada.
- `stats.jpg`: banda oscura, cuatro indicadores grandes y separadores verticales.
- `steps.jpg`: timeline horizontal con nodos numerados e iconografía circular.
- `quote.jpg`: superficie azul clara, comillas coral, cita serif y atribución.
- `accordion.jpg`: título centrado, filas horizontales y controles circulares `+`/`−`.
- `cta-banner.jpg`: fondo azul oscuro, CTA coral y recurso gráfico tecnológico.
- `site-header.jpg` y `site-footer.jpg`: elementos globales del tema, fuera del árbol Canvas.
- `plan-comparison.jpg` y `recommendation-wizard.jpg`: candidatos experimentales; solo se usan si el briefing necesita comparación o recorrido guiado.

El HTML no debe sustituir estas composiciones por una galería genérica de tarjetas. Si el contrato del SDC no permite reproducir una característica visual, el agente debe documentar la adaptación en `traceability.md` y en el informe de validación.

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
