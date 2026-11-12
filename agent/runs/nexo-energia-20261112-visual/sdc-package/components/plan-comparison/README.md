# Plan comparison · C11

Estado: **experimental**.

## Responsabilidad

Representar tres alternativas en una tabla semántica con lectura simultánea por criterios, precios orientativos, indicación textual de la opción recomendada, selección y acción por plan.

## Fuera de alcance

No calcula precios, ahorros o elegibilidad; no contrata ni envía datos; no ejecuta la lógica de recomendación de `C12`.

## Responsive y accesibilidad

En escritorio muestra las tres columnas. En móvil usa desplazamiento horizontal contenido, mantiene `caption`, encabezados de columna/fila y controles táctiles. La recomendación se expresa con texto y color, nunca solo con color.

## Reutilización

Usa los tokens visuales del tema y los patrones de botones, espaciado y líneas. No duplica `offer-card` ni `card-grid`, porque ninguno cubre la semántica de comparación.

Antes de promoverlo a estable hay que cerrar el contrato, validar el comportamiento de selección en Canvas y registrar pruebas con teclado y lector de pantalla.
