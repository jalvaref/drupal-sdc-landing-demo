<?php

/**
 * Load services definition file.
 */
$settings['container_yamls'][] = __DIR__ . '/services.yml';

/**
 * Load Pantheon-specific services and settings from the Composer package.
 * This avoids the legacy scaffolded settings file, whose installer redirect
 * detection is not reliable behind Pantheon's reverse proxy.
 */
$pantheon_services_file = __DIR__ . '/services.pantheon.preproduction.yml';
if (
  isset($_ENV['PANTHEON_ENVIRONMENT']) &&
  (($_ENV['PANTHEON_ENVIRONMENT'] === 'live') || ($_ENV['PANTHEON_ENVIRONMENT'] === 'test'))
) {
  $pantheon_services_file = __DIR__ . '/services.pantheon.production.yml';
}
if (file_exists($pantheon_services_file)) {
  $settings['container_yamls'][] = $pantheon_services_file;
}
include \Pantheon\Integrations\Assets::dir() . '/settings.pantheon.php';

/**
 * Skipping permissions hardening will make scaffolding
 * work better, but will also raise a warning when you
 * install Drupal.
 *
 * https://www.drupal.org/project/drupal/issues/3091285
 */
// $settings['skip_permissions_hardening'] = TRUE;

/**
 * If there is a local settings file, then include it
 */
$local_settings = __DIR__ . "/settings.local.php";
if (file_exists($local_settings)) {
  include $local_settings;
}
