# Trazabilidad — Nexo Energía, hogar y movilidad

## Estado

`awaiting_external_authorization`. La propuesta visual, el HTML y el paquete SDC han sido aprobados. PR, despliegue e importación continúan pendientes de autorización externa explícita.

## Brief y contenido

- Mensaje principal: «La energía de tu hogar también puede acompañar tus trayectos».
- Audiencia: personas adultas que desean comprender el consumo del hogar y su relación con movilidad eléctrica.
- CTA principal: «Explorar mi orientación»; CTA final: «Solicitar una conversación».
- Todo el copy, alternativas, precios, condiciones, imágenes y resultados se identifican como ficticios y demostrativos. No constituyen una oferta comercial real.

## Dirección visual

- Base clara, mucho espacio blanco, tinta `#111827`, azul marino `#142d65` para confianza y coral `#f0442e` para CTA.
- Desktop: hero dividido, lectura editorial, comparativa de cuatro criterios, módulo de orientación oscuro, escena cotidiana, pasos, FAQ y cierre azul marino.
- Mobile: una columna, tarjetas de alternativas, controles grandes y jerarquía conservada.
- Los diseños siguen las referencias del catálogo para Hero, Feature grid, Image and text, Plan comparison, Recommendation wizard, Steps, Accordion y CTA banner.

## Componentes reutilizados

| ID | Componente | Estado | Uso |
| --- | --- | --- | --- |
| C01 | Hero | estable | Único H1, mensaje principal y CTA. |
| C02 | Rich text | estable | Relación hogar–consumo–movilidad. |
| C04 | Feature grid | estable | Tres ventajas. |
| C11 | Plan comparison | experimental existente | Comparativa simultánea de tres alternativas. |
| C12 | Recommendation wizard | experimental existente | Vivienda, recarga y prioridad/preferencia; resultado condicionado. |
| C03 | Image and text | estable | Escena editorial cotidiana. |
| C07 | Steps | estable | Proceso posterior. |
| C09 | Accordion | estable | Seis preguntas frecuentes. |
| C10 | CTA banner | estable | Cierre y acción principal. |

No hay componentes o variantes nuevos propuestos. C11 y C12 son experimentales ya existentes y se han declarado como tales.

## Activos visuales

- `assets/hero-arrival-home.jpg`: imagen editorial generada para el hero; ilustrativa, sin marca ni texto.
- `assets/editorial-routine.jpg`: imagen editorial generada para la escena cotidiana; ilustrativa, sin marca ni texto.
- Ambos están disponibles como activos públicos del tema bajo `web/themes/custom/sdc_landing/images/`; `proposal.json` no referencia ninguna ruta temporal ni del workspace.

## Validaciones de preflight

- Catálogo y contratos consultados antes de la composición.
- Variantes y props comprobados frente a los `.component.yml` seleccionados.
- Un único H1 previsto en C01; cabecera y pie se mantienen globales, fuera de Canvas.
- C11/C12 son experimentales: un paquete final se clasificaría como `code_deploy_required`.
- Los datos y activos ficticios están marcados como demostrativos o pendientes de validación.
- El prototipo HTML se limita a la revisión; no se ha escrito en GitHub, Pantheon ni Drupal.

## Fase HTML

- Artefacto aprobado: `preview/index.html`, autocontenido, responsive y accesible.
- Inspector superpuesto: muestra ID, nombre, variante, props, estado de catálogo y justificación de C01, C02, C03, C04, C07, C09, C10, C11 y C12. Solo existe en el prototipo; no se importará en Canvas.
- Interacciones: selección de alternativa, orientación en tres pasos con validación y resultado ilustrativo, acordeones nativos `details/summary`, foco visible y navegación por teclado.
- Paridad: hero dividido, feature grid con tres columnas/divisores, tabla de comparativa con columna destacada, módulo azul de orientación, imagen y texto a dos columnas, proceso horizontal, FAQ en filas y CTA final azul marino. En móvil, las columnas se apilan, la comparativa se presenta como tarjetas y el proceso se vuelve vertical para mantener la legibilidad táctil.

## Fase SDC

- Paquete: `sdc-package/` con composición Canvas, propuesta, inventario de C11/C12, activos, preview, diseños, informe y handoff.
- Árbol Canvas: `C01 → C02 → C04 → C11 → C12 → C03 → C07 → C09 → C10`.
- C00/C99 y el inspector no se incluyen en Canvas.
- C11/C12 son experimentales existentes en el tema y se reutilizan sin recrear Twig, CSS, JavaScript, fixtures ni contratos.
- Clasificación registrada: `code_deploy_required`; hay activos del tema y componentes experimentales que deben estar disponibles en Dev antes de importar.

## Handoff externo

- Clasificación: `code_deploy_required` por activos del tema y componentes experimentales existentes.
- Secuencia permitida solo tras autorización explícita: `validate_landing_run` → PR → despliegue Pantheon Dev → `import_drupal_draft` → verificación de Canvas e imágenes.
- La página se mantendrá como `draft` / `status: 0`; no se publicará automáticamente.
- Autorización externa recibida el 2026-11-26.
- PR creada mediante `deck_sdc_gateway`: [#55](https://github.com/jalvaref/drupal-sdc-landing-demo/pull/55), rama `codex/landing-nexo-energia-hogar-movilidad-20261126`, commit `583b53e2307c8dc3f46f3763d774dde9222071ef`.
- El gateway aceptó solicitudes de despliegue Dev e importación como draft. No devolvió todavía una evidencia terminal de despliegue, entidad Drupal, estado de borrador, Canvas editable ni imágenes 2xx; esas verificaciones quedan pendientes.
- Reintento posterior a la fusión de PR #55: el workflow en `main` falló durante `Validar ejecución`; los pasos Pantheon y Drupal fueron omitidos. La corrección añade los JPG obligatorios de diseño al artefacto remoto y un índice legacy vacío, sin alterar la landing ni duplicar C11/C12.
- Tras la fusión de PR #56, el workflow de despliegue completó validación y Pantheon Dev correctamente. La importación Drupal falló después de autenticar Terminus, dentro del procedimiento de importación como draft. Los logs de Actions requieren privilegios de administración; no existe evidencia de entidad Drupal creada, estado draft, Canvas editable ni imágenes verificadas.
- Diagnóstico confirmado por el registro de Pantheon: el importador buscó `/code/agent/runs/nexo-energia-20261126-visual/proposal.json`, una carpeta excluida del artefacto Composer de Dev, y no encontró una copia desplegable en `sdc_agent/resources/proposals/`.
- Corrección preparada: `web/modules/custom/sdc_agent/resources/proposals/nexo-energia-20261126-visual.json` contiene la misma propuesta aprobada (`status: sdc_approved`). `DraftImporter::resolveProposalPath()` ya aplica este fallback exclusivamente cuando la ruta original de un run no existe. La corrección no cambia el árbol Canvas, copy, activos ni el estado requerido `draft/status: 0`.

