<?php

namespace Drupal\sdc_agent\Service;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Database\Connection;
use Drupal\Core\Session\AccountInterface;
use Drupal\Node\NodeInterface;
use Drupal\canvas\Entity\Component;

/**
 * Creates unpublished Drupal pages from approved agent proposals.
 */
final class DraftImporter {

  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
    private readonly AccountInterface $currentUser,
    private readonly Connection $database,
  ) {}

  /**
   * Imports an approved proposal as a Canvas page when Canvas is available.
   *
   * The HTML importer remains available as an explicit legacy fallback for
   * installations that do not have Drupal Canvas enabled.
   */
  public function import(string $proposalFile, ?string $title = NULL): EntityInterface {
    if ($this->entityTypeManager->hasDefinition('canvas_page')) {
      return $this->importCanvas($proposalFile, $title);
    }
    return $this->importHtml($proposalFile, $title);
  }

  private function importCanvas(string $proposalFile, ?string $title = NULL): EntityInterface {
    $path = str_starts_with($proposalFile, DIRECTORY_SEPARATOR)
      ? $proposalFile
      : DRUPAL_ROOT . '/../' . ltrim($proposalFile, DIRECTORY_SEPARATOR);
    if (!is_file($path) || filesize($path) === 0) {
      throw new \InvalidArgumentException(sprintf('No existe o está vacío el proposal: %s', $path));
    }
    $proposal = json_decode((string) file_get_contents($path), TRUE, 512, JSON_THROW_ON_ERROR);
    $this->assertApprovedProposal($proposal);
    $hero = array_values(array_filter($proposal['components'], static fn (array $component): bool => ($component['component_id'] ?? '') === 'C01'))[0] ?? [];
    $pageTitle = $title ?: ($hero['props']['title'] ?? 'Landing generada por agente');
    $runMarker = 'SDC_AGENT_RUN:' . $proposal['run_id'];
    $storage = $this->entityTypeManager->getStorage('canvas_page');
    $ids = $storage->getQuery()
      ->condition('description', $runMarker, 'CONTAINS')
      ->accessCheck(FALSE)
      ->execute();
    $page = $ids ? $storage->load(reset($ids)) : $storage->create([
      'title' => $pageTitle,
      'description' => $runMarker . ' ' . ($hero['props']['description'] ?? ''),
      'uid' => $this->currentUser->id() ?: 1,
      'status' => 0,
    ]);
    if (!$page) {
      throw new \RuntimeException('No se pudo crear o cargar la página Canvas.');
    }
    $page->set('title', $pageTitle);
    $page->set('description', $runMarker . ' ' . ($hero['props']['description'] ?? ''));
    $page->setComponentTree($this->buildCanvasTree($proposal));
    $page->setPublished(FALSE);
    $page->save();
    $storage->resetCache([$page->id()]);
    $page = $storage->load($page->id());
    if (!$page || $page->isPublished()) {
      throw new \RuntimeException('La página Canvas no se pudo dejar en estado draft.');
    }
    return $page;
  }

  private function assertApprovedProposal(array $proposal): void {
    if (($proposal['status'] ?? NULL) !== 'sdc_approved') {
      throw new \InvalidArgumentException('La propuesta debe estar en sdc_approved antes de importarla en Drupal.');
    }
    if (empty($proposal['run_id']) || empty($proposal['components']) || !is_array($proposal['components'])) {
      throw new \InvalidArgumentException('La propuesta debe contener run_id y componentes.');
    }
    foreach ($proposal['components'] as $component) {
      if (in_array($component['component_id'] ?? NULL, ['C00', 'C99'], TRUE)) {
        throw new \InvalidArgumentException('C00/C99 son globales del tema y no pueden importarse dentro de Canvas.');
      }
    }
  }

  private function buildCanvasTree(array $proposal): array {
    $componentMap = [
      'C01' => 'hero',
      'C02' => 'rich-text',
      'C03' => 'image-text',
      'C04' => 'feature-grid',
      'C07' => 'steps',
      'C09' => 'accordion',
      'C10' => 'cta-banner',
    ];
    $tree = [];
    foreach ($proposal['components'] as $component) {
      $sourceId = $componentMap[$component['component_id'] ?? ''] ?? NULL;
      if (!$sourceId) {
        throw new \InvalidArgumentException(sprintf('No existe mapeo Canvas para %s.', $component['component_id'] ?? 'desconocido'));
      }
      $componentId = 'sdc.sdc_landing.' . $sourceId;
      $canvasComponent = Component::load($componentId);
      if (!$canvasComponent) {
        throw new \RuntimeException(sprintf('El componente Canvas %s no está disponible en Drupal.', $componentId));
      }
      $inputs = $component['props'] ?? [];
      $this->normalizeCanvasImageInputs($inputs);
      $uuid = \Drupal::service('uuid')->generate();
      $tree[] = [
        'uuid' => $uuid,
        'component_id' => $componentId,
        'component_version' => $canvasComponent->getActiveVersion(),
        'parent_uuid' => NULL,
        'slot' => NULL,
        'inputs' => $inputs,
        'label' => $component['name'] . ' · ' . $component['variant'],
      ];
    }
    return $tree;
  }

  private function normalizeCanvasImageInputs(array &$inputs): void {
    foreach ($inputs as $key => &$value) {
      if ($key === 'image' && is_array($value) && !empty($value['src']) && !str_starts_with((string) $value['src'], '/')) {
        $value['src'] = '/themes/custom/sdc_landing/images/' . rawurlencode(basename((string) $value['src']));
      }
      if (is_array($value)) {
        $this->normalizeCanvasImageInputs($value);
      }
    }
  }

  private function importHtml(string $proposalFile, ?string $title = NULL): NodeInterface {
    $path = str_starts_with($proposalFile, DIRECTORY_SEPARATOR)
      ? $proposalFile
      : DRUPAL_ROOT . '/../' . ltrim($proposalFile, DIRECTORY_SEPARATOR);
    if (!is_file($path)) {
      throw new \InvalidArgumentException(sprintf('No existe el proposal: %s', $path));
    }
    if (filesize($path) === 0) {
      throw new \InvalidArgumentException(sprintf('El proposal está vacío: %s', $path));
    }

    $proposal = json_decode((string) file_get_contents($path), TRUE, 512, JSON_THROW_ON_ERROR);
    if (($proposal['status'] ?? NULL) !== 'sdc_approved') {
      throw new \InvalidArgumentException('La propuesta debe estar en sdc_approved antes de importarla en Drupal.');
    }
    if (empty($proposal['run_id'])) {
      throw new \InvalidArgumentException('La propuesta no contiene run_id.');
    }
    if (empty($proposal['components']) || !is_array($proposal['components'])) {
      throw new \InvalidArgumentException('La propuesta no contiene componentes.');
    }
    foreach ($proposal['components'] as $component) {
      if (in_array($component['component_id'] ?? NULL, ['C00', 'C99'], TRUE)) {
        throw new \InvalidArgumentException('C00/C99 son globales del tema y no pueden importarse dentro de Canvas.');
      }
    }

    $hero = array_values(array_filter($proposal['components'] ?? [], static fn (array $component): bool => ($component['component_id'] ?? '') === 'C01'))[0] ?? [];
    $nodeTitle = $title ?: ($hero['props']['title'] ?? 'Landing generada por agente');
    $summary = $hero['props']['description'] ?? 'Landing generada por el agente SDC.';
    $body = $this->buildBody($proposal, $path, $summary);
    $format = $this->entityTypeManager->getStorage('filter_format')->load('full_html') ? 'full_html' : 'basic_html';

    $nodeStorage = $this->entityTypeManager->getStorage('node');
    $existingIds = $nodeStorage->getQuery()
      ->condition('type', 'landing')
      ->condition('field_agent_run_id', $proposal['run_id'])
      ->accessCheck(FALSE)
      ->execute();
    $node = $existingIds
      ? $nodeStorage->load(reset($existingIds))
      : $nodeStorage->create([
      'type' => 'landing',
      'title' => $nodeTitle,
      'body' => ['value' => $body, 'format' => $format],
      'uid' => $this->currentUser->id() ?: 1,
      'status' => 0,
      'field_agent_run_id' => $proposal['run_id'],
    ]);
    if (!$node) {
      throw new \RuntimeException('No se pudo cargar el draft existente.');
    }
    $node->setTitle($nodeTitle);
    $node->set('body', ['value' => $body, 'format' => $format]);
    $node->set('field_agent_run_id', $proposal['run_id']);
    $node->set('status', 0);
    $node->setUnpublished();
    $node->setPublished(FALSE);
    $node->save();
    // Keep the POC's safety invariant even if another presave handler or
    // workflow restores the entity's publication flag during save.
    $this->database->update('node_field_data')
      ->fields(['status' => 0])
      ->condition('nid', $node->id())
      ->execute();
    $nodeStorage->resetCache([$node->id()]);
    $node = $nodeStorage->load($node->id());
    if (!$node || $node->isPublished()) {
      throw new \RuntimeException('La landing no se pudo dejar en estado draft.');
    }
    return $node;
  }

  private function buildBody(array $proposal, string $proposalPath, string $summary): string {
    $preview = !empty($proposal['html_artifact'])
      ? dirname($proposalPath) . DIRECTORY_SEPARATOR . $proposal['html_artifact']
      : '';
    if ($preview && is_file($preview)) {
      $html = (string) file_get_contents($preview);
      $styles = '';
      if (preg_match_all('/<style\b[^>]*>(.*?)<\/style>/is', $html, $styleMatches)) {
        $styles = implode("\n", $styleMatches[1]);
      }
      if (preg_match('/<body[^>]*>(.*)<\/body>/is', $html, $matches)) {
        $body = preg_replace('/<script\b[^>]*>.*?<\/script>/is', '', $matches[1]);
        $body = preg_replace('/\s+on[a-z]+\s*=\s*(["\']).*?\1/is', '', $body);
        // The inspector is a preview-only aid. Never import its controls or panel into Drupal.
        $body = preg_replace('/<button\b[^>]*\bclass\s*=\s*(["\'])[^"\']*\binspector\b[^"\']*\1[^>]*>.*?<\/button>/is', '', $body);
        $body = preg_replace('/<aside\b[^>]*\bid\s*=\s*(["\'])inspector-panel\1[^>]*>.*?<\/aside>/is', '', $body);
        if (is_string($body) && trim($body) !== '') {
          $body = preg_replace_callback('/(<img\b[^>]*\bsrc\s*=\s*["\'])([^"\']+)(["\'])/i', function (array $imageMatches) use ($proposalPath): string {
            $src = $imageMatches[2];
            if (preg_match('/^(?:data:|https?:|\/)/i', $src)) {
              return $imageMatches[0];
            }
            $assetPath = dirname($proposalPath) . DIRECTORY_SEPARATOR . 'preview' . DIRECTORY_SEPARATOR . basename($src);
            if (!is_file($assetPath)) {
              return $imageMatches[0];
            }
            return $imageMatches[1] . '/themes/custom/sdc_landing/images/' . rawurlencode(basename($src)) . $imageMatches[3];
          }, $body);
          $styleTag = $styles !== '' ? '<style data-sdc-agent="landing">' . $styles . '</style>' : '';
          return $styleTag . $body;
        }
      }
    }

    return sprintf(
      '<p>%s</p><p><strong>Estado:</strong> draft</p><p><strong>Run ID:</strong> %s</p><p><strong>Componentes:</strong> %s</p>',
      htmlspecialchars($summary, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'),
      htmlspecialchars($proposal['run_id'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'),
      htmlspecialchars(implode(', ', array_column($proposal['components'] ?? [], 'component_id')), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'),
    );
  }

}
