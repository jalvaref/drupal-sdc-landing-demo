# Informe de validación SDC · Nexo Energía

- Run: `nexo-energia-20261112-visual`
- Estado: `sdc_approved` / handoff externo pendiente
- Drupal target: `draft` (`status: 0`)
- Clasificación de paquete: `code_deploy_required` pendiente de decisión operativa, porque incluye dos candidatos experimentales con archivos de componente que no existen en el tema estable desplegado.

## 1. Validación estructural local

- `proposal.json` raíz y copia de paquete parsean como JSON.
- `canvas-composition.yaml` contiene 10 instancias de contenido, en el orden aprobado.
- `C00 site-header` y `C99 site-footer` no aparecen en el árbol Canvas; se mantienen globales.
- `C01`, `C02`, `C03`, `C04`, `C06`, `C07`, `C09` y `C10` están marcados `catalog` y usan `include` del catálogo.
- `C11` y `C12` están marcados `experimental` y referencian contratos preliminares en `candidate-components.yaml`.
- Los activos `assets/nexo-energia-hero.jpg`, `design/desktop.jpg` y `design/mobile.jpg` existen y no son rutas temporales.
- `preview/index.html` se conserva solo como artefacto de revisión; el inspector no forma parte del árbol Canvas.

## 2. Validación contra contratos reales

- `C01 Hero / split`: props comprobadas contra `hero.component.yml`; `image_src`, `image_alt`, `primary_label`, `primary_url`, `secondary_label`, `secondary_url`, `variant` y `theme` usan nombres y enums reales.
- `C02 RichText / medium`: `body` es HTML filtrado; `alignment=center` y `width=medium` son enums reales.
- `C04 FeatureGrid / with-icons`: usa tres grupos escalares `item_n_*`, `columns=3`, `variant=with-icons` y `theme=light`.
- `C06 Stats / highlighted`: usa tres grupos escalares `stat_n_value`, `stat_n_label` y `stat_n_context`; cifras marcadas como demostrativas.
- `C03 ImageText / image-right`: usa `image_src`, `image_alt`, `cta_label`, `cta_url`, `image_position=right` y `theme=light`.
- `C07 Steps / numbered`: usa tres pasos escalares y `variant=numbered`.
- `C09 Accordion / faq`: usa cuatro preguntas/respuestas, HTML en respuestas, `default_open=0` y `variant=faq`.
- `C10 CtaBanner / standard`: usa CTA principal, CTA secundario, `theme=dark` y `variant=standard`.
- No se han modificado Twig, CSS, JavaScript ni `.component.yml` de componentes estables.

## 3. Validación de candidatos experimentales

### C11 · Plan comparison

El contrato preliminar define tres planes, criterios con tres valores, selección y acción. El Twig usa tabla semántica; el CSS conserva lectura horizontal en móvil. Queda pendiente validar el contrato definitivo, integración Canvas y comportamiento de selección dentro de Drupal.

### C12 · Recommendation wizard

El contrato preliminar define tres pasos, tipos de campo, opciones, reglas ficticias y resultado. El Twig, CSS y JS incluyen estructura de formulario, estados básicos y responsive. Queda pendiente validar el contrato definitivo, integración Canvas y comportamiento de resultado dentro de Drupal.

## 4. Validación bloqueada

- No se puede afirmar que los candidatos estén disponibles en la biblioteca Canvas del entorno Dev: todavía no se ha solicitado ni ejecutado handoff externo.
- No se puede importar esta composición hasta que se apruebe el paquete SDC y se confirme cómo se desplegarán los dos componentes experimentales.
- No se ha solicitado PR, despliegue Pantheon ni importación Drupal; el gateway no está conectado.
- La landing no está publicada y no existe evidencia de escritura externa.

## Resultado

Paquete local preparado para revisión SDC. Los componentes estables reutilizan el catálogo; los únicos añadidos son `C11` y `C12`, explícitamente experimentales, con responsabilidades, límites, contratos preliminares, estados, responsive y accesibilidad documentados.

## Paridad visual

El HTML generado (`preview/index.html`) es la referencia principal para la implementación Canvas. Las plantillas y estilos SDC se ajustan a su contenedor, escala tipográfica, espaciado, paleta, botones, tarjetas, tabla y wizard responsive sin modificar los contratos de props.
