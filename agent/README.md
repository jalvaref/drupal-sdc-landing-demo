# Contratos del agente

Esta carpeta contiene los contratos de datos y el orquestador de la POC de generación de landings. El flujo puede ejecutarse de forma reproducible con el proveedor `deterministic` o generar una dirección visual y una composición con el proveedor `openai`.

El punto de entrada es `bin/run-agent.mjs`. En ambos casos el resultado se valida automáticamente contra el contrato antes de quedar en `awaiting_visual_approval`.

## Contratos

- `contracts/brief.schema.json`: entrada de campaña.
- `contracts/landing-proposal.schema.json`: propuesta visual, composición, copy y estado de aprobación.

## Ejecución local

```bash
node agent/bin/run-agent.mjs agent/examples/energia-move-brief.json --out agent/runs/energia-move
node agent/bin/validate-run.mjs agent/runs/energia-move
```

Para usar el proveedor OpenAI, configura la clave únicamente en el entorno local o en el gestor de secretos del pipeline; no la incluyas en el repositorio:

```powershell
$env:OPENAI_API_KEY = "<clave-local>"
$env:OPENAI_MODEL = "gpt-5.1" # opcional
node agent/bin/run-agent.mjs agent/examples/energia-move-brief.json --provider openai --out agent/runs/energia-move-openai
```

El proveedor OpenAI genera `llm-components.json`, `design_direction` dentro de `proposal.json` y la trazabilidad correspondiente. Si no se dispone de credenciales, `deterministic` permite demostrar el flujo completo de la POC.

El agente termina en `awaiting_visual_approval`. La aprobación debe realizarse explícitamente antes de generar el paquete SDC.

El ejemplo `agent/examples/energia-move-with-candidate-brief.json` demuestra la ruta MVP2: añade `C11` como componente candidato, lo representa en el preview y genera su paquete experimental en `sdc-package/components`.

## Principios

- El agente puede generar contenido ficticio para la POC.
- El contenido debe seguir el briefing y mantener un tono profesional.
- El agente debe explicitar supuestos y preguntas abiertas.
- La aprobación es una transición de estado, no un texto informal.
- Drupal siempre recibe una landing en draft.
