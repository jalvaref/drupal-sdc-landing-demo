# Prompts operativos

## Iniciar una landing

Lee `AGENTS.md`, `PLANS.md`, el catálogo, el sistema de diseño, los contratos y el runbook. Analiza el briefing adjunto. Ejecuta solo la fase de briefing y propuesta visual. Genera los dos JPG, muestra los artefactos y detente para aprobación visual.

## Continuar fase aprobada

Lee el estado y la trazabilidad de la ejecución. Comprueba la aprobación explícita de la fase anterior. Ejecuta únicamente la siguiente fase indicada en `AGENTS.md`, valida sus artefactos y detente en la puerta de aprobación correspondiente.

## Ejecutar handoff

Lee `AGENTS.md`, `PLANS.md`, el runbook y la ejecución aprobada. Ejecuta preflight. Usa el MCP `deck_sdc_gateway` para validar, crear la contribución, desplegar Pantheon Dev e importar Drupal como draft. Exige confirmación antes de cada escritura y reporta la evidencia devuelta. No publiques.

## Revisar una salida

Audita la salida contra los contratos reales, el catálogo, el sistema de diseño y el runbook. Corrige solo inconsistencias demostrables. No avances de fase ni escribas en sistemas externos sin aprobación.
