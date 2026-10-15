# Drupal SDC Landing Demo

Demo ejecutable para la POC de generación de landings: catálogo de componentes reutilizables, composición trazable y contenido gobernado.

## Arranque

```bash
composer install
docker compose up -d
```

Instala Drupal en `http://localhost:8080` con base de datos `db`, usuario `drupal`, contraseña `drupal`, base `drupal`. Después selecciona el tema **SDC Landing Demo**. SDC es core desde Drupal 10.3 y Drupal 11.

## Despliegue en Pantheon

El proyecto incluye `pantheon.upstream.yml`, `.gitignore` y la configuración de Integrated Composer. Antes de subirlo, ejecuta `composer install` en un entorno con PHP 8.3+ y Composer 2, revisa el resultado y commitea también `composer.lock`. Pantheon no debe recibir `web/core`, `vendor` ni módulos/temas contribuidos: los construye durante el deploy.

Con la integración GitHub de Pantheon, conecta este repositorio como repositorio externo. Los pushes a `main` despliegan en Dev y las pull requests pueden crear Multidev, sujeto al plan y permisos de la organización.

## Incluye

- Tema `sdc_landing` con componentes SDC auto-contenidos.
- Header, hero promocional, franja de confianza, tarjeta de oferta, grid de beneficios, FAQ y footer.
- Inventario y manifest de handoff alineados con `C01–C10`.

El precio aparece como `[PRECIO PENDIENTE]`; no se inventan cifras ni condiciones. Los logos e imágenes son placeholders explícitos.
