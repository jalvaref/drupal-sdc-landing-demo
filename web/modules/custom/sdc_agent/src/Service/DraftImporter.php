<?php

namespace Drupal\sdc_agent\Service;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Database\Connection;
use Drupal\Core\Session\AccountInterface;
use Drupal\Node\NodeInterface;

/**
 * Creates unpublished Drupal pages from approved agent proposals.
 */
final class DraftImporter {

  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
    private readonly AccountInterface $currentUser,
    private readonly Connection $database,
  ) {}

  public function import(string $proposalFile, ?string $title = NULL): NodeInterface {
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
            $mime = function_exists('mime_content_type') ? mime_content_type($assetPath) : 'image/jpeg';
            $data = base64_encode((string) file_get_contents($assetPath));
            return $imageMatches[1] . 'data:' . $mime . ';base64,' . $data . $imageMatches[3];
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
