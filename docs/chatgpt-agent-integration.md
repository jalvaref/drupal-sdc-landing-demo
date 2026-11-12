# Integración con el agente de ChatGPT

La generación de la POC debe ejecutarse desde el agente `SDC Copilot`, no desde el proveedor `openai` del script local. El agente de ChatGPT es el responsable de generar la dirección visual, el HTML y los componentes SDC. Los scripts locales son validadores y ejecutores controlados.

## Configuración del agente

En el Agent Builder:

1. Carga `agent/chatgpt-agent/INSTRUCTIONS.md` como instrucciones principales.
2. Añade como archivos de conocimiento:
   - `knowledge/component-catalog.yaml`.
   - `knowledge/component-catalog.md`.
   - `knowledge/design-system.md`.
   - `agent/contracts/brief.schema.json`.
   - `agent/contracts/landing-proposal.schema.json`.
   - `docs/agent-mvp-roadmap.md`.
   - `knowledge/operational-runbook.md`.
   - Los contratos reales de los SDC utilizados: `hero.component.yml`, `rich-text.component.yml`, `feature-grid.component.yml`, `stats.component.yml` y `cta-banner.component.yml`.
3. Habilita generación de imágenes para generar las referencias visuales desktop/mobile en JPG.
4. Conecta GitHub únicamente al repositorio `jalvaref/drupal-sdc-landing-demo`.
5. Para acciones de escritura, usa un MCP o acción propia con permisos mínimos para crear ramas y pull requests. El conector GitHub estándar puede leer el repositorio, pero no debe considerarse suficiente para hacer push.
6. Si se quiere iniciar ejecuciones desde otro sistema, añade el canal API del Workspace Agent y protege el token fuera del repositorio.

Si el MCP de despliegue no está conectado, el agente debe limitarse a generar y validar artefactos. No debe simular ramas, pull requests, pushes, despliegues ni importaciones Drupal.

## Contrato de salida del agente

El agente debe producir una carpeta de ejecución con:

```text
proposal.json
preview/index.html
design/desktop.jpg
design/mobile.jpg
traceability.md
approval.json
sdc-package/                 # solo después de aprobar el HTML
```

`proposal.json` debe cumplir `agent/contracts/landing-proposal.schema.json`. El estado inicial debe ser `visual_draft` o `awaiting_visual_approval` según la interfaz que consuma el agente.

## Herramientas locales de validación

Después de cada fase aprobada, el agente puede solicitar la ejecución de:

```bash
node agent/bin/validate-run.mjs <run>
node agent/bin/validate-sdc-package.mjs <run>/sdc-package
node agent/bin/prepare-pull-request.mjs <run> --dry-run
```

La importación final en Drupal se realiza con:

```bash
drush sdc-agent:import-draft <run>/proposal.json
```

El agente no debe saltarse las aprobaciones ni ejecutar la importación como contenido publicado. La importación objetivo crea una entidad Drupal Canvas `canvas_page` con su árbol `components`; no debe limitarse a copiar el HTML del preview en un campo `body`.

## Prompts iniciales

- `Genera una landing a partir de este briefing y detente para revisión visual.`
- `Ajusta el HTML aprobado y detente para revisión HTML.`
- `Genera el paquete SDC para los componentes aprobados y detente para revisión técnica.`
- `Prepara la rama y la pull request de la ejecución aprobada y crea la landing como draft en Drupal.`

## Nota de arquitectura

El script `agent/bin/generate-llm-components.mjs` se conserva como fallback técnico y prueba de integración de API. No es el camino principal cuando se usa el agente de ChatGPT; así evitamos duplicar la responsabilidad de generación y mantenemos las decisiones creativas dentro del agente gobernado.
