# Recommendation wizard · C12

Estado: **experimental**.

## Responsabilidad

Gestionar tres preguntas ficticias sobre vivienda, recarga y zona; mostrar progreso, validar respuestas obligatorias, permitir volver atrás y presentar un resultado condicionado por reglas declarativas.

## Fuera de alcance

No persiste respuestas, no conecta con CRM, no calcula consumo/precio/elegibilidad y no produce una recomendación comercial real.

## Responsive y accesibilidad

En escritorio separa progreso y formulario; en móvil se apila en una columna. Usa `fieldset`/`legend`, labels, `aria-current`, región de error y foco gestionado. Los mensajes de estado no dependen solo del color.

## Reutilización

Reutiliza tokens, botones, espaciado, superficies y la jerarquía visual de `steps`, pero no pretende convertir `Steps` en un formulario interactivo ni duplica su contrato.

Antes de promoverlo a estable hay que cerrar el contrato, validar reglas, registrar pruebas de teclado/lector de pantalla y confirmar la integración real con Canvas.
