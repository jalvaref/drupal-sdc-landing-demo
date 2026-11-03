# Contratos del agente

Esta carpeta contiene los contratos de datos y los validadores de la POC de generación de landings. El camino principal de generación es el agente de ChatGPT `SDC Copilot`, documentado en `agent/chatgpt-agent/INSTRUCTIONS.md`. El proveedor `deterministic` se conserva para pruebas reproducibles y `openai` como fallback técnico de integración.

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

## Gateway de despliegue

`agent/deployment-gateway` contiene el MVP para conectar el agente con la validación, GitHub, Pantheon Dev y la importación de drafts en Drupal. Arranca en modo `dry-run`, restringe el repositorio de la POC y no incluye ninguna operación de publicación. Antes de conectarlo a ChatGPT debe publicarse detrás de HTTPS como custom MCP, configurar autenticación y mantener las acciones de escritura con confirmación.

## Sincronización del agente ChatGPT

La fuente de verdad del comportamiento del agente está en el repositorio. Al actualizar el agente `SDC Copilot`, sincroniza estos archivos como instrucciones y fuentes de conocimiento:

1. `agent/chatgpt-agent/INSTRUCTIONS.md` — instrucciones operativas y reglas de aprobación.
2. `knowledge/component-catalog.md` — catálogo legible por el agente, con los componentes Canvas recomendados.
3. `knowledge/component-catalog.yaml` — contrato estructurado para nombres, props, variantes y reglas Canvas.
4. `knowledge/design-system.md` — dirección visual, tokens, composición, responsive y accesibilidad.
5. `web/themes/custom/sdc_landing/DESIGN-SYSTEM.md` — contrato técnico del tema y de los SDC.
6. `docs/agent-mvp-roadmap.md` — alcance MVP1/MVP2 y fases del flujo.

Después de sincronizar, valida el agente con un briefing de prueba y comprueba que:

- selecciona primero componentes existentes del catálogo;
- reutiliza campos y props existentes antes de proponer extensiones;
- genera contenido Canvas con SDC, sin insertar `site-header` ni `site-footer` dentro de la página;
- mantiene la landing como draft y solicita aprobación antes de avanzar;
- devuelve la composición, el copy, las decisiones visuales y la trazabilidad.

Los cambios del agente se versionan en GitHub; el despliegue de Pantheon solo es necesario cuando cambian el tema Drupal, los SDC o la configuración del sitio.

## Principios

- El agente puede generar contenido ficticio para la POC.
- El contenido debe seguir el briefing y mantener un tono profesional.
- El agente debe explicitar supuestos y preguntas abiertas.
- La aprobación es una transición de estado, no un texto informal.
- Drupal siempre recibe una landing en draft.
