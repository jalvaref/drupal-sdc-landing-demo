<?php

namespace Drupal\sdc_agent\Commands;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Session\AccountInterface;
use Drush\Commands\DrushCommands;

/**
 * Imports an approved agent proposal as an unpublished Drupal page.
 */
final class SdcAgentCommands extends DrushCommands {

  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
    private readonly AccountInterface $currentUser,
  ) {
    parent::__construct();
  }

  /**
   * Creates a Drupal page in draft status from a proposal JSON file.
   *
   * @command sdc-agent:import-draft
   * @param string $proposal_file Absolute or project-relative proposal path.
   * @option title Optional node title override.
   * @usage drush sdc-agent:import-draft agent/examples/energia-move/proposal.json
   * @aliases sdc-import-draft
   */
  public function importDraft(string $proposal_file, array $options = ['title' => NULL]): void {
    $path = str_starts_with($proposal_file, DIRECTORY_SEPARATOR)
      ? $proposal_file
      : DRUPAL_ROOT . '/../' . ltrim($proposal_file, DIRECTORY_SEPARATOR);
    if (!is_file($path)) {
      throw new \InvalidArgumentException(sprintf('No existe el proposal: %s', $path));
    }

    $proposal = json_decode((string) file_get_contents($path), TRUE, 512, JSON_THROW_ON_ERROR);
    if (!in_array($proposal['status'] ?? NULL, ['sdc_approved', 'html_approved'], TRUE)) {
      throw new \InvalidArgumentException('La propuesta debe estar en html_approved o sdc_approved.');
    }
    if (empty($proposal['run_id'])) {
      throw new \InvalidArgumentException('La propuesta no contiene run_id.');
    }

    $hero = array_values(array_filter($proposal['components'] ?? [], static fn (array $component): bool => ($component['component_id'] ?? '') === 'C01'))[0] ?? [];
    $title = $options['title'] ?: ($hero['props']['title'] ?? 'Landing generada por agente');
    $summary = $hero['props']['description'] ?? 'Landing generada por el agente SDC.';
    $body = $this->buildBody($proposal, $path, $summary);
    $format = $this->entityTypeManager->getStorage('filter_format')->load('full_html') ? 'full_html' : 'basic_html';

    $node = $this->entityTypeManager->getStorage('node')->create([
      'type' => 'page',
      'title' => $title,
      'body' => [
        'value' => $body,
        'format' => $format,
      ],
      'uid' => $this->currentUser->id() ?: 1,
      'status' => 0,
    ]);
    $node->save();
    $this->logger()->success(sprintf('Draft creado: node/%d (run %s).', $node->id(), $proposal['run_id']));
  }

  /**
   * Reuses the approved preview body when it is available and safe to import.
   */
  private function buildBody(array $proposal, string $proposalPath, string $summary): string {
    $preview = !empty($proposal['html_artifact'])
      ? dirname($proposalPath) . DIRECTORY_SEPARATOR . $proposal['html_artifact']
      : '';
    if ($preview && is_file($preview)) {
      $html = (string) file_get_contents($preview);
      if (preg_match('/<body[^>]*>(.*)<\/body>/is', $html, $matches)) {
        $body = preg_replace('/<script\b[^>]*>.*?<\/script>/is', '', $matches[1]);
        $body = preg_replace('/\s+on[a-z]+\s*=\s*(["\']).*?\1/is', '', $body);
        if (is_string($body) && trim($body) !== '') {
          return $body;
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
