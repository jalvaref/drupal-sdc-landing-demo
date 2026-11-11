# Configuración del handoff SDC

## Estado de la POC

La ejecución `energia-en-movimiento-20261111-161500` está en `visual_draft`. El gateway no debe recibir `confirm=true` hasta que exista una aprobación visual y la propuesta haya pasado por `sdc_approved`.

## Secretos de GitHub Actions

Configurar en `jalvaref/drupal-sdc-landing-demo` los siguientes secretos del repositorio:

- `PANTHEON_DEPLOY_COMMAND`: comando que ejecutará el runner después de configurar el remote SSH. Para el procedimiento actual usa exactamente `git push pantheon HEAD:master`.
- `PANTHEON_GIT_REMOTE`: remote SSH de Codeserver de `sdc-landing-demo.dev`, por ejemplo el que muestra Pantheon como `ssh://...@codeserver.dev....drush.in:2222/~/repository.git`.
- `PANTHEON_SSH_PRIVATE_KEY`: clave privada SSH de despliegue autorizada para ese Codeserver. No es la clave pública ni el machine token de Terminus.
- `DRUPAL_IMPORT_COMMAND`: procedimiento autorizado para ejecutar `sdc-agent:import-draft` contra el entorno Drupal Dev. Debe contener `<run>` para referenciar `agent/runs/<run>/proposal.json`.

Los secretos no deben incluirse en `workflow`, `proposal.json`, el gateway ni el repositorio. El workflow aborta si falta cualquiera de ellos, si la salida no confirma `draft` o si detecta una indicación de publicación.

## Secuencia autorizada

1. Aprobar la propuesta visual.
2. Generar y aprobar HTML.
3. Generar y aprobar el paquete SDC.
4. Enviar al gateway los artefactos no vacíos con `confirm=true`.
5. Ejecutar `validate` y comprobar el workflow.
6. Ejecutar `deploy_pantheon_dev`.
7. Ejecutar `import_drupal_draft`.
8. Verificar en Drupal que la página es editable, permanece como draft y no contiene `site-header` ni `site-footer` dentro de Canvas.

## Bloqueos conocidos

- La API pública de Drupal Canvas no está disponible en la versión instalada; la importación Canvas editable requiere validar el contrato interno de la versión desplegada.
- El gateway devuelve la confirmación de despacho del workflow, no el resultado final del workflow; la verificación final debe consultar GitHub Actions.
