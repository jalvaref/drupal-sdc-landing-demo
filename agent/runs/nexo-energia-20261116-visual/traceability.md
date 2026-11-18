# Trazabilidad — Nexo Energía · Hogar y movilidad

## Estado

`handoff_authorized` — propuesta visual, HTML y paquete SDC aprobados; la creación de PR, despliegue Dev e importación de draft están autorizados. La publicación sigue prohibida.

## Briefing resuelto

- Objetivo: explicar, comparar, orientar y facilitar una conversación demostrativa sobre hogar, consumo y movilidad eléctrica.
- Audiencia: personas adultas que desean comprender su consumo, valorar la recarga y comparar alternativas.
- Mensaje principal: **La energía de tu hogar también puede acompañar tus trayectos.**
- CTA principal: **Explorar mi orientación**; CTA final: **Solicitar una conversación**.
- Restricción de contenido: todo es ficticio, ilustrativo y sin valor comercial; no hay referencias a TotalEnergies.

## Diseño entregado

| Vista | Artefacto | Decisión de diseño |
| --- | --- | --- |
| Escritorio | `design/desktop.jpg` | Hero dividido, comparativa simultánea de tres columnas, orientador en bloque azul y proceso horizontal. |
| Móvil | `design/mobile.jpg` | Jerarquía en una columna, alternativas como tarjetas, orientador con controles de gran tamaño y CTA de ancho completo. |

El patrón visual conserva los rasgos de las referencias del catálogo: hero editorial dividido, feature grid con iconos, tabla legible, orientador con progreso y estados, escena image-text, pasos numerados, FAQ en filas y CTA final oscuro.

## Componentes reutilizados

| ID | Componente | Estado | Motivo |
| --- | --- | --- | --- |
| C01 | Hero | Estable | Único H1, propuesta y CTA principal. |
| C02 | RichText | Estable | Explicación editorial. |
| C04 | FeatureGrid | Estable | Tres ventajas homogéneas. |
| C11 | PlanComparison | Experimental existente | Comparación simultánea de tres alternativas. |
| C12 | RecommendationWizard | Experimental existente | Preguntas, validación y orientación condicionada. |
| C03 | ImageText | Estable | Escena editorial cotidiana. |
| C07 | Steps | Estable | Qué sucede tras solicitar información. |
| C09 | FAQ accordion | Estable del tema | Seis respuestas con estructura FAQ accesible. |
| C10 | CtaBanner | Estable | Cierre de conversión no vinculante. |

No hay candidatos nuevos: C11 y C12 ya están registrados como experimentales. El contrato real de `faq-accordion` prevalece sobre el resumen de C09 del catálogo y permite una colección de preguntas.

## Supuestos y controles

- Las fotos de las maquetas son generadas e ilustrativas; no se usan aún como `image_src` de Canvas.
- Se reservará un activo público del tema o una referencia Media Drupal antes de cualquier importación; no se usarán rutas `preview/` ni rutas locales.
- El orientador recoge vivienda, frecuencia de recarga y prioridad (simplicidad, equilibrio diario o flexibilidad/movilidad) en tres pasos, que son la cardinalidad disponible en C12.
- El resultado explica de forma visible que no es una recomendación comercial real ni contratación.
- El diseño muestra una sola H1 en hero; los títulos de bloques posteriores son H2/H3 en la siguiente fase.

## Validación visual previa

- `brief.json` y `proposal.json` siguen sus contratos de estructura.
- Se contrastaron IDs, props y enums con los `.component.yml` de C01, C02, C03, C04, C07, C09, C10, C11 y C12. C02, C03, C09, C11 y C12 no declaran una prop `variant` real: su descriptor de propuesta es informativo y no se enviará a Canvas; C02 usa `width`, C03 usa `image_position` y C11/C12 su estado experimental.
- Todos los precios/condiciones propuestos incluyen la marca orientativa, ilustrativa o de demostración.
- Header y footer son globales del tema y no aparecen en el árbol Canvas propuesto.
- Los JPG existen en las rutas declaradas.

## Próxima puerta

## Fase HTML

- Prototipo: `preview/index.html`, con CSS y JavaScript incluidos, responsive, semántico y con inspector activable.
- Activos locales ilustrativos: `assets/nexo-energia-hero.png` y `assets/nexo-energia-rutina.png`; no se usan rutas remotas ni temporales.
- Inspector: muestra ID, nombre, variante/descripción de variante, props, estado y justificación de C01, C02, C03, C04, C07, C09, C10, C11 y C12. Está explícitamente fuera de la futura composición Canvas.
- Interacciones: comparativa seleccionable, orientador de tres pasos con validación y resultado ficticio, acordeones nativos operables con teclado y foco visible.

### Revisión de paridad

| Componente | Resultado |
| --- | --- |
| Hero C01 | Reproduce el split editorial, foto a la derecha, título grande y CTA coral. |
| Rich text C02 | Mantiene ancho de lectura controlado y alineación centrada. |
| FeatureGrid C04 | Conserva tres columnas con iconos y divisores; se apila en móvil. |
| PlanComparison C11 | Tabla simultánea con columna destacada; se convierte en tarjetas para móvil, tal como aprueba el diseño móvil. |
| RecommendationWizard C12 | Navegación, estados, validación y resultado condicionado en bloque azul; una columna en móvil. |
| ImageText C03 | Foto amplia a la izquierda y texto/CTA a la derecha; se apila en móvil. |
| Steps C07 | Cuatro pasos numerados sobre una línea; se convierte en recorrido vertical en móvil. |
| FAQ C09 | Filas `details/summary` con control nativo, no una rejilla genérica. |
| CTA C10 | Bloque final azul marino con CTA coral. |

Desviación documentada: las fotos locales ilustrativas generadas reemplazan las fotografías incrustadas en las maquetas aprobadas, manteniendo la misma escena doméstica, tratamiento editorial y composición. En C11 la versión móvil usa tarjetas para evitar scroll horizontal y preservar legibilidad táctil.

## Fase SDC

- Paquete: `sdc-package/` con composición Canvas, propuesta, activos, candidatos, preview, informes y handoff.
- Árbol Canvas: C01 → C02 → C04 → C11 → C12 → C03 → C07 → C09 → C10. C00/C99 siguen globales del tema.
- Activos públicos: `/themes/custom/sdc_landing/images/nexo-energia-20261116-hero.jpg` y `/themes/custom/sdc_landing/images/nexo-energia-20261116-rutina.jpg`.
- Validación: `validate-run`, `validate-assets` y `validate-sdc-package` superadas.
- Clasificación: `code_deploy_required`, porque se añaden activos al tema y la composición usa C11/C12 experimentales.

## Próxima puerta

Tras aprobación SDC explícita y autorización externa explícita se iniciará el handoff mediante `deck_sdc_gateway`: validación, PR, despliegue en Dev e importación como draft. Nunca se publicará la página automáticamente.

## Handoff autorizado

- Autorización explícita recibida para PR, despliegue Dev e importación como borrador.
- PR creado mediante `deck_sdc_gateway`: [#47](https://github.com/jalvaref/drupal-sdc-landing-demo/pull/47), rama `codex/landing-nexo-energia-hogar-movilidad`, commit `cb5da4fdca8dea842ca4ecf634fc90756bd6bd15`.
- El gateway aceptó las solicitudes de validación, despliegue e importación. No se considera finalizado ningún paso externo hasta disponer de una evidencia de resultado.
- La comprobación CI detectó una incompatibilidad de ciclo de vida en `validate-run.mjs`: las rutas `preview/` se rechazaban también en `visual_draft`. Se corrige para permitirlas únicamente antes de SDC y mantener la prohibición desde `sdc_package_draft` en adelante.

## Reconciliación de Pantheon Dev

- La entrega corregida se fusionó en GitHub `main` mediante el PR #48.
- El despliegue seguro rechazó actualizar Pantheon porque `master` tenía correcciones posteriores no presentes en GitHub. Se prepara una PR de reconciliación sin push forzado, integrando ambos historiales.
- Se conservan `drupal_status: 0`, los activos públicos y el árbol Canvas. C11/C12 se alinean con las plantillas reconciliadas del tema.

## Corrección de fidelidad visual · 2026-11-18

- Auditoría completada frente al JPG aprobado y la vista Dev: la divergencia procedía del HTML/SDC previo, no solo de Canvas.
- Se corrigen cabecera y pie globales para la demo Nexo, el hero editorial, la escala vertical, los iconos de ventajas, la composición de orientación, la CTA de cierre y el acordeón.
- Nuevo activo ilustrativo de hero: `nexo-energia-20261118-hero-v2.png`; no contiene marcas ni afirmaciones comerciales reales.
- C11 y C12 continúan diferenciados como componentes experimentales. No se añaden componentes ni props nuevos.
- Preflight local: `validate-run`, `validate-assets` y `validate-sdc-package` correctos.


