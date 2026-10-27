<?php

// Pantheon's reverse proxy may expose the installer through index.php. Make
// the generated Pantheon settings file recognize the original installer path.
$request_path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?: '';
if (strpos($request_path, '/core/install.php') === 0) {
  $_SERVER['SCRIPT_NAME'] = '/core/install.php';
}

// Allow the Drupal installer to render on a new Pantheon environment instead
// of being redirected repeatedly while the database is still empty.
if (($_SERVER['PANTHEON_DATABASE_STATE'] ?? '') === 'empty') {
  $_SERVER['PANTHEON_DATABASE_STATE'] = 'installing';
}

/**
 * Load services definition file.
 */
$settings['container_yamls'][] = __DIR__ . '/services.yml';

/**
 * Include the Pantheon-specific settings file.
 *
 * n.b. The settings.pantheon.php file makes some changes
 *      that affect all environments that this site
 *      exists in.  Always include this file, even in
 *      a local development environment, to ensure that
 *      the site settings remain consistent.
 */
include __DIR__ . "/settings.pantheon.php";

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
