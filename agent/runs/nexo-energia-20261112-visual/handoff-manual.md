# Handoff manual · Nexo Energía

Estado: `sdc_approved` · autorización externa recibida · operaciones no ejecutadas.

## Clasificación

`code_deploy_required`

La contribución incluye los candidatos experimentales `C11` y `C12` con `.component.yml`, Twig, CSS y JavaScript. Por tanto, no es estrictamente `canvas_only`: el runtime de los candidatos debe llegar al entorno Dev antes de intentar una composición Canvas que los use.

## Destinos por defecto

- Repositorio: `https://github.com/jalvaref/drupal-sdc-landing-demo.git`
- Base: `main`
- Rama propuesta: `codex/landing-nexo-energia-movilidad`
- Pantheon: `sdc-landing-demo.dev`
- Dev: `https://dev-sdc-landing-demo.pantheonsite.io/`
- Drupal: importar como borrador, `status: 0`; publicar queda fuera de esta ejecución

## Archivos del paquete

- `agent/runs/nexo-energia-20261112-visual/sdc-package/canvas-composition.yaml`
- `agent/runs/nexo-energia-20261112-visual/sdc-package/proposal.json`
- `agent/runs/nexo-energia-20261112-visual/sdc-package/candidate-components.yaml`
- `agent/runs/nexo-energia-20261112-visual/sdc-package/components/plan-comparison/`
- `agent/runs/nexo-energia-20261112-visual/sdc-package/components/recommendation-wizard/`
- `agent/runs/nexo-energia-20261112-visual/sdc-package/assets/`
- `agent/runs/nexo-energia-20261112-visual/sdc-package/design/`
- `agent/runs/nexo-energia-20261112-visual/sdc-package/preview/index.html`
- `agent/runs/nexo-energia-20261112-visual/sdc-package/validation-report.md`

## Secuencia pendiente con `deck_sdc_gateway`

1. Ejecutar `validate_landing_run`.
2. Crear la contribución con `create_github_pull_request`.
3. Solicitar `deploy_pantheon_dev` por ser `code_deploy_required`.
4. Solicitar `import_drupal_draft`.
5. Comprobar que Drupal queda en borrador y que Canvas muestra los componentes editables.

## Evidencia local

- Validación oficial: `validate-sdc-package.mjs` superada para dos candidatos.
- Preflight local: paquete completo, composición con ocho componentes estables y dos experimentales, activos presentes, sin `C00`/`C99` en Canvas y sin rutas temporales.
- La propuesta visual y el HTML fueron aprobados explícitamente por el usuario.

## Bloqueo

`MCP de despliegue no conectado`.

No se han creado PRs, commits remotos, despliegues ni importaciones. No se han usado credenciales ni se ha guardado ningún token.

Autorización explícita para la secuencia externa: recibida. El endpoint responde, pero rechaza el `MCP_TOKEN` del entorno con `Unauthorized`.
