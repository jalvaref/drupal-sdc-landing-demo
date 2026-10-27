# Contratos del agente

Esta carpeta contiene los contratos de datos que debe cumplir el agente de generación de landings. No implementa todavía un proveedor LLM concreto; permite conectar el agente a una interfaz web, un asistente corporativo o un proceso CI/CD sin cambiar el modelo de datos.

## Contratos

- `contracts/brief.schema.json`: entrada de campaña.
- `contracts/landing-proposal.schema.json`: propuesta visual, composición, copy y estado de aprobación.

## Principios

- El agente puede generar contenido ficticio para la POC.
- El contenido debe seguir el briefing y mantener un tono profesional.
- El agente debe explicitar supuestos y preguntas abiertas.
- La aprobación es una transición de estado, no un texto informal.
- Drupal siempre recibe una landing en draft.
