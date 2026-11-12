# Runbook operativo de SDC Copilot

## Objetivo

Cerrar cada fase de la POC en una ejecución, con artefactos consistentes y sin prometer operaciones externas que el agente no pueda ejecutar.

## Preflight común

Antes de presentar una fase como preparada:

1. Confirmar el estado de la fase y la aprobación previa.
2. Confirmar que todos los componentes utilizados existen en `component-catalog.yaml`.
3. Validar cada variante y cada prop contra el `.component.yml` real.
4. Validar estructuras anidadas: CTA, imagen, items, HTML y enums.
5. Confirmar un único `h1` y que `site-header`/`site-footer` no están dentro de Canvas.
6. Confirmar que los activos referenciados están incluidos o tienen una referencia Drupal válida.
7. Marcar como ilustrativos los datos ficticios, claims, cifras y activos generados.
8. Registrar supuestos, preguntas abiertas, artefactos y siguiente aprobación.

### Comprobaciones específicas de activos y Canvas

- Rechazar cualquier `src` que empiece por `preview/`, `file://`, una ruta del workspace o una URL temporal.
- Para Hero e Image Text, validar `image_src` e `image_alt` contra sus `.component.yml` reales.
- Comprobar que el activo existe dentro del tema o que se ha creado/referenciado como Media Drupal.
- Comprobar que la plantilla global muestra header y footer alrededor de `page.content`, sin duplicarlos dentro del árbol Canvas.

## Fase visual

Entregar dos imágenes reales en JPG: `design/desktop.jpg` y `design/mobile.jpg`. Una descripción textual no sustituye a las imágenes. Detenerse en `awaiting_visual_approval`.

## Fase HTML

Generar HTML autocontenido y responsive con inspector. El inspector mínimo debe mostrar IDs, nombres, variantes y props. La mejora de superposición contextual —estado de catálogo, justificación y resaltado directo sobre cada componente— queda como evolución post-POC. Detenerse en `awaiting_html_approval`.

## Fase SDC/Canvas

Si los componentes son estables, generar solo la composición Canvas. El paquete debe contener la composición, la propuesta, el inventario de candidatos, los activos y el informe de validación. La importación debe crear una entidad `canvas_page` y persistir sus instancias en el campo `components`; mantener `draft` y `drupal_status: 0`. El HTML del preview y su inspector son únicamente artefactos de revisión. Tras el despliegue Pantheon, esperar el build Composer y ejecutar `terminus drush <site>.dev -- status` antes de `drush cr` y de la importación. Una nueva importación puede devolver una página publicada a draft; publicar es siempre una acción manual posterior.

## Diagnóstico del editor Canvas

Si aparece `Error PARSING_ERROR: Unexpected token '<'` al cargar el layout, el navegador ha recibido HTML donde esperaba JSON. Inspeccionar `GET /canvas/api/v0/layout/{entity_type}/{entity}` y distinguir:

- `403` o HTML de Cloudflare: permitir las rutas Canvas/API o resolver el challenge.
- Redirección/login HTML: renovar la sesión y revisar permisos de edición.
- `500` HTML/Drupal: revisar logs y el contrato del componente; no modificar el árbol a ciegas.

## MCP no conectado

Si no está disponible el MCP de despliegue, entregar un handoff manual con:

- repositorio y rama base;
- nombre de rama propuesta;
- archivos y commit que deben incluirse;
- Pantheon site/environment;
- operación pendiente: PR, despliegue o importación;
- evidencia de la última validación;
- bloqueo explícito: `MCP de despliegue no conectado`.

Nunca afirmar que una escritura externa se ha realizado sin evidencia devuelta por la herramienta correspondiente.
