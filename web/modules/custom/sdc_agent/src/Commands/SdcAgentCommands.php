<?php

namespace Drupal\sdc_agent\Commands;

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
    $node = $this->importer->import($proposal_file, $options['title'] ?: NULL);
    $this->logger()->success(sprintf('Draft creado o actualizado: node/%d.', $node->id()));
  }

}
