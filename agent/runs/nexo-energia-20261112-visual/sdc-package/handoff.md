# SDC handoff

- Run: `nexo-energia-20261112-visual`
- Estado: `sdc_approved` / handoff externo pendiente
- Componentes reutilizados desde el tema estable: `C01`, `C02`, `C03`, `C04`, `C06`, `C07`, `C09`, `C10`
- Candidatos experimentales incluidos: `C11`, `C12`
- Destino Drupal: `draft` (`status: 0`)
- Handoff externo: no solicitado; gateway no conectado
- Clasificación provisional: `code_deploy_required`, porque el paquete introduce archivos de componentes experimentales que no están en el tema desplegado

## Decisión de despliegue

El paquete está aprobado para handoff, pero el gateway requerido no está conectado en esta sesión. Si se mantiene la composición completa con `C11` y `C12`, el flujo externo debe conservar el despliegue por ser `code_deploy_required`.

## Seguridad

No se incluyen credenciales ni tokens. Drupal debe quedar como borrador y la publicación sigue siendo manual.
