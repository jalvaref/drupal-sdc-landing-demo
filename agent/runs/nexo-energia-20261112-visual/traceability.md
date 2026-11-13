# Trazabilidad · Nexo Energía

- Ejecución: `nexo-energia-20261112-visual`
- Estado: `html_draft` / `awaiting_html_approval`
- Briefing: `brief.json`
- Propuesta: `proposal.json`
- Visual desktop: `design/desktop.jpg`
- Visual mobile: `design/mobile.jpg`
- Creatividad editorial: `assets/nexo-energia-hero.jpg`
- HTML de revisión: `preview/index.html`
- Paquete SDC: `sdc-package/`

## Fuentes consultadas

- `knowledge/component-catalog.yaml`
- `knowledge/component-catalog.md`
- `knowledge/design-system.md`
- `knowledge/operational-runbook.md`
- `agent/contracts/brief.schema.json`
- `agent/contracts/landing-proposal.schema.json`
- `PLANS.md`
- `agent/prompts/briefing-campana-movilidad.md` como referencia de proceso y restricciones de demostración
- Contratos reales de `hero`, `rich-text`, `feature-grid`, `image-text`, `stats`, `steps`, `accordion`, `cta-banner`, `offer-card` y `card-grid`

## Componentes reutilizados del catálogo

| ID | Componente | Variante | Uso en la propuesta |
| --- | --- | --- | --- |
| C01 | Hero | `split` | Beneficio principal, único `h1`, CTA primaria y alternativa |
| C02 | RichText | `medium` | Contexto editorial de la propuesta |
| C04 | FeatureGrid | `with-icons` | Tres ventajas homogéneas |
| C06 | Stats | `highlighted` | Tres indicadores marcados como demostrativos |
| C03 | ImageText | `image-right` | Bloque editorial con vivienda y vehículo |
| C07 | Steps | `numbered` | Tres pasos posteriores a solicitar información |
| C09 | Accordion | `faq` | Cuatro preguntas frecuentes |
| C10 | CtaBanner | `standard` | Cierre con CTA principal y retorno a comparación |

`C00 site-header` y `C99 site-footer` se mantienen como elementos globales del tema y no entran en Canvas.

## Candidatos nuevos experimentales

### C11 · Plan comparison

**Necesidad y carencia del catálogo.** La experiencia exige comparar tres alternativas al mismo tiempo por filas y columnas, indicar una opción recomendada, permitir seleccionar una opción y ofrecer una acción para continuar. `offer-card.component.yml` solo representa una oferta individual con precio, etiqueta y CTA. `card-grid.component.yml` agrupa tarjetas independientes. Ninguno garantiza semántica tabular, lectura por criterios ni selección coordinada; forzarlos ocultaría precisamente la comparación que pide el briefing.

**Responsabilidad.** Renderizar una tabla comparativa de tres planes, encabezados y criterios, badge de recomendación, estado de selección y CTA por plan. **Fuera de alcance:** calcular precios reales, validar elegibilidad, contratar, enviar datos o resolver la recomendación del asistente.

**Contrato preliminar mínimo.** `title`, `description`, `plans[]` (id, name, price, price_note, recommended, highlight, action_label, action_url), `criteria[]` (id, label, values[]), `selected_plan` y `selection_label`. La propuesta usa tres planes y cuatro criterios ficticios.

**Estados y responsive.** Estado inicial sin selección, plan recomendado resaltado, plan seleccionado, foco/hover, y estado de CTA disponible tras seleccionar. En escritorio se muestran las tres columnas; en móvil la tabla conserva la lectura simultánea dentro de un contenedor desplazable con encabezado y primera columna identificables.

**Accesibilidad y contenido alternativo.** Tabla semántica con `caption`, `thead`, `tbody`, encabezados asociados, `aria-selected` o equivalente para selección, foco visible, botones con nombre distinguible y recomendación expresada también con texto, no solo color. No requiere imagen; si se añade iconografía será decorativa con texto equivalente.

**Estado.** `experimental`; no se incorpora al catálogo estable ni a Drupal sin aprobación de la fase correspondiente.

**Reutilización del sistema visual.** Usa tokens existentes de navy, coral, superficie clara, líneas suaves, radios y espaciado. Reutiliza patrones de CTA y tipografía del tema; no duplica `offer-card` ni `card-grid`.

### C12 · Recommendation wizard

**Necesidad y carencia del catálogo.** El recorrido debe mantener respuestas, mostrar estado de paso, validar campos, permitir volver atrás y producir un resultado condicionado. `steps` solo comunica una secuencia estática; `accordion` oculta contenido; `rich-text` no gestiona formularios. No hay un componente estable de formulario/asistente en el catálogo.

**Responsabilidad.** Orquestar tres pasos ficticios (vivienda, patrón de recarga y zona), validar respuestas obligatorias, navegar atrás/adelante y resolver un resultado demostrativo mediante reglas explícitas. **Fuera de alcance:** persistencia, conexión a CRM, recomendación comercial real, cálculo de consumo, autenticación o envío de formularios.

**Contrato preliminar mínimo.** `title`, `steps[]` (id, label, field, type, options, required), `result_rules[]`, `result_title`, `result_body`, `primary_label` y `primary_url`. El contrato debe admitir estados internos `idle`, `step_1`, `step_2`, `step_3`, `validation_error` y `result`.

**Estados y responsive.** Indicador de progreso con paso actual, paso completado, error de validación, navegación atrás/adelante y resultado final. En escritorio se propone un panel de pasos junto al formulario; en móvil una sola columna con controles táctiles de ancho cómodo y el resultado debajo.

**Accesibilidad y contenido alternativo.** `fieldset`/`legend` por grupo, labels asociados, `aria-current` en el paso activo, errores junto al campo y anunciados con región viva, foco gestionado al cambiar de paso, orden de teclado lógico, contraste suficiente y mensajes que no dependan solo del color. No requiere imagen; cualquier icono debe tener nombre accesible o ser decorativo.

**Estado.** `experimental`; no se incorpora al catálogo estable ni a Drupal sin aprobación de la fase correspondiente.

**Reutilización del sistema visual.** Usa la jerarquía de encabezados, tokens, botones, líneas de progreso, radios, espaciado y superficies existentes. Reutiliza la semántica visual de `steps` sin copiar su contrato ni presentarlo como si ya soportara interacción.

## Supuestos y contenido

- La marca, precios, cifras, condiciones y resultados son ficticios y se rotulan como demostrativos.
- La imagen generada es una creatividad editorial sin texto, logos, marcas reales ni personas identificables; su alt está documentado en `proposal.json`.
- La ruta `assets/nexo-energia-hero.jpg` es un artefacto optimizado del run para la propuesta. Antes de Canvas deberá resolverse a un activo público del tema o a una referencia Media Drupal válida.
- Los destinos de CTA se limitan a anclas documentadas: `#comparativa`, `#recomendacion` y `#contacto`.
- El inspector no se genera en esta fase y, cuando exista en el HTML, quedará fuera del paquete Canvas.

## Preflight de fase visual

- Estado: briefing disponible; aprobación visual aún pendiente.
- Componentes catalogados: contratos reales consultados para cada componente estable utilizado.
- Candidatos nuevos: separados, justificados y marcados `experimental`.
- H1: uno, reservado a C01 Hero.
- Header/footer: globales del tema, fuera de Canvas.
- Activos: creatividad copiada al run; alt descriptivo previsto.
- Datos ficticios: marcados como demostrativos en la propuesta y en la composición visual.
- HTML, paquete SDC, PR, despliegue e importación Drupal: no iniciados por la puerta de aprobación.

## Fase HTML

- Aprobación visual recibida explícitamente por el usuario antes de iniciar esta fase.
- `preview/index.html` es autocontenido, responsive y accesible; incluye el inspector exclusivamente para revisión.
- La comparativa `C11` usa una tabla semántica con `caption`, encabezados de columna/fila, selección por radio y recomendación textual.
- El asistente `C12` incluye progreso, navegación atrás/adelante, validación básica, foco y resultado condicionado por respuestas ficticias.
- `C00 site-header` y `C99 site-footer` aparecen solo como envolvente global del prototipo, sin IDs Canvas ni instancias en la composición.
- No se ha generado todavía `sdc-package`, no se han modificado componentes estables y no se han ejecutado acciones externas.

### Preflight HTML

- HTML presente y con un único `h1`.
- Aviso visible de demostración.
- Destinos de CTA documentados: `#comparativa`, `#recomendacion`, `#preguntas` y `#contacto`.
- Imágenes con alt descriptivo y ruta relativa al asset del run.
- Inspector con ID, nombre, variante, estado de catálogo, props y motivo de uso.
- Responsive: una columna en móvil; comparativa con desplazamiento horizontal contenido.
- Accesibilidad: foco visible, controles nativos, `aria-current`, `aria-live`, `role=alert`, labels y navegación por teclado.

## Fase SDC

- Aprobación HTML recibida explícitamente antes de generar el paquete.
- Composición Canvas escrita en `sdc-package/canvas-composition.yaml` con estado previsto `draft` y `drupal_status: 0`.
- Copias de `proposal.json`, `preview/index.html`, JPGs y creatividad incluidas en el paquete.
- Componentes estables consumidos desde el tema; no se recrean sus Twig, CSS, JS ni `.component.yml`.
- Candidatos `C11` y `C12` generados como archivos experimentales separados y registrados en `candidate-components.yaml`.
- Catálogo actualizado en `knowledge/component-catalog.yaml`, `knowledge/component-catalog.md` y `knowledge/experimental-candidates.md` con estado `experimental`.
- Informe separado en validación estructural, contratos reales y validación bloqueada.
- Handoff externo no iniciado; no hay PR, despliegue Pantheon ni importación Drupal.

## Fase de handoff

- Aprobación SDC recibida explícitamente por el usuario.
- Clasificación: `code_deploy_required`, por los candidatos experimentales con archivos de runtime.
- Handoff manual: `handoff-manual.md`.
- Secuencia externa documentada: `validate_landing_run` → `create_github_pull_request` → `deploy_pantheon_dev` → `import_drupal_draft` → comprobación de draft/Canvas.
- Bloqueo: `MCP_TOKEN rechazado por deck_sdc_gateway` (`Unauthorized`).
- Autorización explícita para la secuencia externa: recibida; no ejecutada porque `validate_landing_run` no ha sido autorizado.
- No se han escrito sistemas externos ni se ha publicado Drupal.

## Siguiente puerta

La referencia visual para los ajustes Canvas es `preview/index.html`; los JPG desktop/mobile se mantienen como control de composición aprobada.

## Ajuste de paridad visual · 2026-11-13

- Se alinean los SDC Canvas con el HTML en contenedor, espaciado, escala tipográfica, colores, botones, superficies, tarjetas, tabla comparativa y wizard responsive.
- C11 y C12 conservan los contratos escalares y la interacción existente; el cambio es de composición Twig/CSS y no añade props.
- El asset `nexo-energia-hero.jpg` se incluye en el tema con el mismo nombre final que resuelve el importador.
- El preflight de assets y la verificación post-import de imágenes quedan incorporados al proceso antes de aceptar otro handoff.
