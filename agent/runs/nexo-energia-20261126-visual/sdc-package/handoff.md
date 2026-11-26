# Handoff externo solicitado

- Repositorio: `https://github.com/jalvaref/drupal-sdc-landing-demo.git`
- Base: `main`
- Rama creada: `codex/landing-nexo-energia-hogar-movilidad-20261126`
- Pull request: `https://github.com/jalvaref/drupal-sdc-landing-demo/pull/55`
- Commit: `583b53e2307c8dc3f46f3763d774dde9222071ef`
- Pantheon Dev: `sdc-landing-demo.dev`
- Clasificación: `code_deploy_required`
- Estado Drupal requerido: `draft` / `status: 0`

## Evidencia del gateway

- `validate_landing_run`: solicitud aceptada para `nexo-energia-20261126-visual`.
- `create_github_pull_request`: completada; PR #55 abierta con 16 archivos verificados.
- `deploy_pantheon_dev`: solicitud aceptada por el workflow `sdc-handoff.yml`.
- `import_drupal_draft`: solicitud aceptada por el workflow `sdc-handoff.yml`.

## Verificación pendiente

El gateway no ha devuelto aún una URL Dev, estado de despliegue, ID/URL de la entidad Drupal, confirmación `draft`/`status: 0`, editabilidad Canvas ni comprobación HTTP de imágenes. No se declara el handoff completado hasta recibir esa evidencia.

## Corrección de validación

- El reintento ejecutado sobre `main` falló en el job `validate`; Pantheon e importación fueron omitidos: [workflow 133](https://github.com/jalvaref/drupal-sdc-landing-demo/actions/runs/45801103077).
- Corrección mínima creada como [PR #56](https://github.com/jalvaref/drupal-sdc-landing-demo/pull/56): añade los JPG de diseño requeridos por el workflow y `catalog-extension.yaml` vacío para la compatibilidad del validador legacy, sin modificar la landing ni recrear C11/C12.
- Tras fusionar PR #56, se debe relanzar el despliegue y la importación mediante `deck_sdc_gateway`.

## Segundo reintento

- PR #56 quedó fusionada en `main` (commit `30eb1cb33c08295d4c977f3c6bf2686dfda605ee`).
- Despliegue Dev: completado correctamente; validación y job Pantheon correctos en [workflow 134](https://github.com/jalvaref/drupal-sdc-landing-demo/actions/runs/45802146486).
- Importación Drupal: falló en el paso «Importar landing como draft mediante el procedimiento autorizado», después de autenticar Terminus, en [workflow 135](https://github.com/jalvaref/drupal-sdc-landing-demo/actions/runs/45802159673).
- La descarga de logs de Actions requiere privilegios de administración del repositorio. Sin el mensaje del fallo no se reintenta para evitar duplicar o alterar un borrador Drupal de forma insegura.

## Corrección de importación

- El registro proporcionado por Pantheon identifica la causa: `agent/runs/nexo-energia-20261126-visual/proposal.json` no está presente en el artefacto Composer de Dev.
- Se ha preparado una copia desplegable de la propuesta aprobada en `web/modules/custom/sdc_agent/resources/proposals/nexo-energia-20261126-visual.json`.
- El importador ya resuelve esa ubicación solo como fallback para el mismo `run_id`; no se modifica la composición, los componentes ni los activos públicos.
- Queda pendiente crear, fusionar y desplegar la PR correctiva, y después solicitar de nuevo `import_drupal_draft`.

