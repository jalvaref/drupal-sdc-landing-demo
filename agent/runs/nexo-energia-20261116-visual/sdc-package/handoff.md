# Handoff SDC pendiente

- Run: `nexo-energia-20261116-visual`
- Estado: `sdc_approved`; handoff externo autorizado
- Destino Drupal: `draft` con `drupal_status: 0`
- Clasificación: `code_deploy_required`

## Motivo de clasificación

La contribución requiere que lleguen a Dev dos activos nuevos bajo `web/themes/custom/sdc_landing/images/`. Además usa C11 y C12, componentes experimentales que deben validarse y estar disponibles en el runtime desplegado. Por tanto no es un paquete `canvas_only`.

## Secuencia posterior a aprobación explícita

1. Preflight y `validate_landing_run` mediante `deck_sdc_gateway`.
2. Crear pull request en la rama `codex/landing-nexo-energia-hogar-movilidad`.
3. Solicitar despliegue en Pantheon Dev.
4. Solicitar importación a Drupal Canvas como borrador.
5. Confirmar estado draft y props editables en Canvas.

No se ha llamado aún al MCP, no hay PR, no hay despliegue y no se ha importado contenido en Drupal.

