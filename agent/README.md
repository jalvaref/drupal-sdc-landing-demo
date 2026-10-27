# Contratos del agente

Esta carpeta contiene los contratos de datos que debe cumplir el agente de generación de landings. No implementa todavía un proveedor LLM concreto; permite conectar el agente a una interfaz web, un asistente corporativo o un proceso CI/CD sin cambiar el modelo de datos.

El punto de entrada de la POC es `bin/run-agent.mjs`. El proveedor `deterministic` genera una propuesta reproducible a partir del briefing y permite validar el flujo completo sin credenciales externas. En una siguiente iteración se puede sustituir por un adaptador LLM que devuelva los mismos contratos.

## Contratos

- `contracts/brief.schema.json`: entrada de campaña.
- `contracts/landing-proposal.schema.json`: propuesta visual, composición, copy y estado de aprobación.

## Ejecución local

```bash
node agent/bin/run-agent.mjs agent/examples/energia-move-brief.json --out agent/runs/energia-move
node agent/bin/validate-run.mjs agent/runs/energia-move
```

El agente termina en `awaiting_visual_approval`. La aprobación debe realizarse explícitamente antes de generar el paquete SDC.

## Principios

- El agente puede generar contenido ficticio para la POC.
- El contenido debe seguir el briefing y mantener un tono profesional.
- El agente debe explicitar supuestos y preguntas abiertas.
- La aprobación es una transición de estado, no un texto informal.
- Drupal siempre recibe una landing en draft.
