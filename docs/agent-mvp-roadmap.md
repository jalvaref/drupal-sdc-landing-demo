# MVP del agente de generación de landings

## Decisiones de alcance

Este documento convierte las decisiones de la POC en un contrato de implementación. El agente:

- Genera directamente propuestas visuales.
- Usa la documentación de diseño como guía, sin exigir Figma en el MVP.
- Genera el prototipo HTML.
- Puede crear ramas y pull requests automáticamente.
- Requiere aprobación del usuario entre fases.
- Deja la landing en estado draft en Drupal.
- Puede generar contenido ficticio, siempre alineado con el briefing y con tono profesional.
- No incorpora analítica ni el ciclo de vida de componentes en esta POC.
- Puede actualizar el catálogo cuando crea o extiende componentes.

## Flujo de estados

```text
briefing_draft
  -> briefing_approved
  -> visual_draft
  -> visual_approved
  -> html_draft
  -> html_approved
  -> sdc_package_draft
  -> sdc_approved
  -> drupal_draft
```

Cada transición requiere una acción explícita del usuario, excepto las acciones técnicas internas que no cambian de fase. La aprobación significa que la versión actual es suficientemente buena para continuar.

Drupal añade una aprobación separada: un administrador o editor revisa la landing y decide si pasa de draft a publicación. El agente no publica directamente.

## MVP1: diseño, HTML y trazabilidad

### Entradas

- Briefing de campaña.
- Catálogo de componentes SDC.
- Documentación de diseño y marca.
- Activos opcionales.

### Capacidades

1. Validar el briefing y detectar preguntas abiertas.
2. Seleccionar una composición del catálogo.
3. Generar una propuesta visual desktop y mobile.
4. Generar copy profesional alineado con el briefing.
5. Marcar supuestos y contenido pendiente.
6. Esperar aprobación del usuario.
7. Generar un HTML autocontenido y responsive.
8. Añadir un inspector visual de componentes.
9. Generar un informe de trazabilidad.
10. Esperar aprobación del HTML.

### Entregables

- `briefing.json`
- `proposal.json`
- `preview/index.html`
- `preview/assets/`
- `traceability.md`
- `approval.json`

## MVP2: SDC, GitHub y Drupal

### Entradas

- HTML aprobado.
- Inventario de componentes utilizados.
- Candidatos a componente nuevo o extensión.
- Repositorio Git configurado.

### Capacidades

1. Comparar el HTML aprobado con el catálogo existente.
2. Identificar componentes reutilizables y candidatos.
3. Generar componentes SDC candidatos con Twig, YAML, CSS y fixtures.
4. Actualizar `component-inventory.yaml` y el catálogo de conocimiento.
5. Crear una rama `codex/landing-<slug>`.
6. Ejecutar validaciones de YAML, Twig, HTML y accesibilidad básica.
7. Crear un commit descriptivo.
8. Crear una pull request con resumen, decisiones, supuestos y validaciones.
9. Desplegar en Pantheon Dev mediante el flujo Git existente.
10. Crear o actualizar la landing en Drupal en estado draft.

### Entregables

- Paquete de componentes SDC.
- Fixtures y documentación técnica.
- Actualización del catálogo.
- Rama Git.
- Pull request.
- Informe de validación.
- Landing Drupal en draft.

La primera integración Drupal vive en `web/modules/custom/sdc_agent`. Su comando `sdc-agent:import-draft` exige una propuesta aprobada y crea una página `page` con `status: 0`; no publica automáticamente.

## Reglas de aprobación

| Fase | Aprueba | Criterio mínimo |
| --- | --- | --- |
| Briefing | Usuario del agente | Objetivo, audiencia y oferta suficientemente claros |
| Diseño | Usuario del agente | La composición y el copy representan el briefing |
| HTML | Usuario del agente | El prototipo es usable y visualmente válido |
| SDC | Usuario del agente | El paquete es coherente y las validaciones pasan |
| Drupal | Administrador/editor | La landing cumple los criterios de publicación |

## Contratos de integración

Los esquemas JSON de `agent/contracts` son la interfaz común entre el agente y los generadores. El agente debe devolver siempre:

- Identificador de ejecución.
- Estado actual.
- Artefactos generados.
- Supuestos.
- Preguntas abiertas.
- Decisiones aprobadas.
- Errores bloqueantes.

La integración con GitHub debe ser idempotente: si se reintenta una ejecución, el agente reutiliza la rama y la pull request de la misma campaña en lugar de crear duplicados.

## Criterios de aceptación del MVP1

- Un briefing válido produce una composición con componentes catalogados.
- La propuesta visual incluye desktop y mobile.
- El HTML funciona sin dependencias externas obligatorias.
- El inspector identifica cada componente y sus props.
- El agente no oculta preguntas abiertas ni supuestos.
- La aprobación del usuario permite pasar a la siguiente fase.

## Criterios de aceptación del MVP2

- El agente distingue componentes existentes de candidatos.
- Los componentes candidatos incluyen contrato SDC y fixture.
- Todos los YAML pasan validación.
- La rama y la pull request se crean con trazabilidad.
- La landing desplegada en Drupal queda como draft.
- El agente nunca publica automáticamente.

## Backlog inicial

### P0

- Implementar el modelo de ejecución y estados.
- Implementar validación del briefing.
- Conectar el catálogo YAML.
- Generar `proposal.json`.
- Generar preview HTML desktop/mobile.
- Implementar aprobación y rechazo con comentario.

### P1

- Añadir inspector visual.
- Generar informe de trazabilidad.
- Generar paquete SDC desde HTML aprobado.
- Actualizar inventario y catálogo.
- Añadir validaciones automáticas.

### P2

- Integrar GitHub para ramas y pull requests.
- Integrar despliegue Pantheon.
- Integrar creación de landing Drupal en draft.
- Añadir recuperación de ejecuciones y reintentos idempotentes.

## Fuera de alcance de esta POC

- Integración obligatoria con Figma.
- Analítica de componentes.
- Métricas de promoción de componentes experimental a estable.
- Publicación automática en Drupal.
- Automatización completa de revisión legal o de marca.
