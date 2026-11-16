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

## Estado de ejecución

- PR creado mediante `deck_sdc_gateway`: [#47](https://github.com/jalvaref/drupal-sdc-landing-demo/pull/47), con commit inicial `cb5da4fdca8dea842ca4ecf634fc90756bd6bd15`.
- El gateway aceptó las solicitudes de validación, despliegue e importación; todavía falta una evidencia de finalización que permita afirmar el resultado de Dev o del borrador Canvas.
- Se ha corregido la validación de ciclo de vida y se actualizará el PR con los JPG obligatorios de diseño para que el workflow pueda verificar el handoff completo.

