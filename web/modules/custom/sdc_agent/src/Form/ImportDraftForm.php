<?php

namespace Drupal\sdc_agent\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\sdc_agent\Service\DraftImporter;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Administrative form for importing an approved proposal as a draft.
 */
final class ImportDraftForm extends FormBase {

  public function __construct(private readonly DraftImporter $importer) {}

  public static function create(ContainerInterface $container): self {
    return new self($container->get('sdc_agent.importer'));
  }

  public function getFormId(): string {
    return 'sdc_agent_import_draft_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state): array {
    $form['proposal_file'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Ruta de la propuesta JSON'),
      '#default_value' => 'agent/examples/energia-move-with-candidate/proposal.json',
      '#description' => $this->t('Ruta relativa a la raíz del proyecto. La propuesta debe estar aprobada.'),
      '#required' => TRUE,
    ];
    $form['title'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Título opcional'),
      '#description' => $this->t('Si se deja vacío, se usa el título del HeroPromotional.'),
    ];
    $form['actions']['#type'] = 'actions';
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Crear draft'),
      '#button_type' => 'primary',
    ];
    return $form;
  }

  public function submitForm(array &$form, FormStateInterface $form_state): void {
    try {
      $node = $this->importer->import(
        $form_state->getValue('proposal_file'),
        $form_state->getValue('title') ?: NULL,
      );
      $this->messenger()->addStatus($this->t('Draft creado: node/@id.', ['@id' => $node->id()]));
      $form_state->setRedirect('entity.node.edit_form', ['node' => $node->id()]);
    }
    catch (\Throwable $exception) {
      $this->messenger()->addError($this->t('No se pudo crear el draft: @message', ['@message' => $exception->getMessage()]));
    }
  }

}
