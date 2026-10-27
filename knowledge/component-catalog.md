# Catálogo de componentes SDC

Este documento describe el catálogo que utiliza la POC de generación de landings. La fuente estructurada para el agente es [`component-catalog.yaml`](component-catalog.yaml); este Markdown está pensado para revisión humana, diseño y negocio.

## Objetivo

El catálogo permite que un agente seleccione y componga componentes existentes del tema `sdc_landing` sin inventar contenido comercial. Cada componente tiene un ID estable, un include SDC, props compatibles con su `.component.yml`, reglas de uso, accesibilidad y restricciones de contenido.

## Orden de composición recomendado

`C00 SiteHeader` → `C01 HeroPromotional` → `C10 TrustStrip` → `C03 OfferCard` → `C05 BenefitsGrid` → `C09 FaqAccordion` → `C99 SiteFooter`

Son obligatorios `C01` y `C99`. El resto se incorpora según el objetivo de la landing y la disponibilidad de contenido validado.

## Reglas para el agente

1. Preferir un componente del catálogo antes de proponer uno nuevo.
2. Mantener un único `HeroPromotional` y un único `h1`.
3. No inventar precios, descuentos, porcentajes, ahorros, claims, teléfonos, logos, partners ni condiciones.
4. Marcar como `pending_validation` cualquier contenido sin fuente aprobada; no presentarlo como un hecho publicable.
5. Si falta un dato necesario para decidir, formular una pregunta abierta.
6. Conservar siempre las etiquetas y URLs de los CTAs.
7. Incluir `SiteFooter` como último bloque, salvo que el host proporcione un footer global equivalente.

## Componentes

### C00 · SiteHeader

Cabecera de identidad, navegación y contacto. Include: `sdc_landing:site-header`. Props: `brand_name`, `brand_url`, `utility_label`, `utility_url`, `phone_label` y `phone_url`. No usar un teléfono por defecto en una landing real sin validarlo. Variante de la POC: `Utility`.

### C01 · HeroPromotional

Bloque principal de propuesta de valor y conversión. Include: `sdc_landing:hero-promotional`. Props: `eyebrow`, `title`, `description`, `benefits`, `primary_label`, `primary_url`, `secondary_label`, `secondary_url` y `visual_label`.

Debe aparecer como máximo una vez y su `title` es el único `h1`. La alternativa del visual debe ser significativa y los CTAs deben tener destinos explícitos. Variante de la POC: `Partner`.

### C10 · TrustStrip

Franja de evidencia, métrica o señal de confianza. Include: `sdc_landing:trust-strip`. Props: `label`, `value` y `source`. Si el dato no tiene fuente o fecha, el estado debe ser `pending_validation`. Variante de la POC: `PendingValidation` para demostrar el bloqueo de claims no verificados.

### C03 · OfferCard

Tarjeta para presentar o comparar ofertas. Include: `sdc_landing:offer-card`. Props: `title`, `description`, `price`, `price_note`, `cta_label`, `cta_url` y `badge`. Solo se utiliza cuando existe una oferta o decisión comercial real. Nunca se debe completar un precio o condición por inferencia. Variantes de la POC: `Luz` y `ConPartner`.

### C05 · BenefitsGrid

Rejilla de beneficios o argumentos de valor. Include: `sdc_landing:benefits-grid`. Props: `title` e `items`; cada item contiene `title` y `text`. La composición de referencia es `3-up`, con dos a cuatro beneficios. Los iconos decorativos siempre necesitan un equivalente textual.

### C09 · FaqAccordion

Acordeón para resolver preguntas y objeciones. Include: `sdc_landing:faq-accordion`. Props: `title` e `items`; cada item contiene `question` y `answer`. Se apoya en `details/summary`, por lo que debe conservarse la operabilidad con teclado. Las respuestas deben tener una fuente aprobada.

### C99 · SiteFooter

Pie de página y cierre legal de la landing. Include: `sdc_landing:site-footer`. Prop: `legal_label`. Debe ser el último componente y distinguir el texto legal real del texto de demostración.

## Contrato de salida recomendado

Cuando el agente proponga una landing, debe devolver una estructura equivalente a esta:

```json
{
  "landing_goal": "Captación de clientes para una oferta de energía",
  "components": [
    {
      "component_id": "C01",
      "variant": "Partner",
      "props": {
        "title": "Título pendiente de validación",
        "primary_label": "Ver ofertas",
        "primary_url": "#offers-title"
      },
      "content_status": "pending_validation",
      "source_requirements": ["Propuesta de valor aprobada"]
    }
  ],
  "open_questions": ["¿Cuál es el precio y la condición comercial vigente?"]
}
```

El agente debe separar siempre la selección de componentes de la validación del contenido. La ausencia de una fuente no impide construir la maqueta, pero sí debe impedir que el contenido se presente como listo para publicar.
