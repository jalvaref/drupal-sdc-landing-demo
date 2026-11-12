<?php

namespace Drupal\sdc_agent\Commands;

use Drupal\Core\Url;
use Drupal\sdc_agent\Service\DraftImporter;
use Drush\Commands\DrushCommands;

/**
 * Imports an approved agent proposal as an unpublished Drupal page.
 */
final class SdcAgentCommands extends DrushCommands {

  public function __construct(private readonly DraftImporter $importer) {
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
    $entity = $this->importer->import($proposal_file, $options['title'] ?: NULL);
    if ($entity->getEntityTypeId() === 'canvas_page') {
      $url = Url::fromRoute('entity.canvas_page.canonical', ['canvas_page' => $entity->id()], ['absolute' => TRUE])->toString();
      $editor = Url::fromRoute('entity.canvas_page.edit_form', ['canvas_page' => $entity->id()], ['absolute' => TRUE])->toString();
      $this->logger()->success(sprintf('Draft Canvas creado o actualizado: page/%d. URL: %s. Editor: %s. Estado: draft. Modo: canvas; Canvas editable: sí.', $entity->id(), $url, $editor));
      return;
    }
    $url = Url::fromRoute('entity.node.canonical', ['node' => $entity->id()], ['absolute' => TRUE])->toString();
    $this->logger()->success(sprintf('Draft creado o actualizado: node/%d. URL: %s. Estado: draft. Modo: html_legacy; Canvas editable: no.', $entity->id(), $url));
  }

}
