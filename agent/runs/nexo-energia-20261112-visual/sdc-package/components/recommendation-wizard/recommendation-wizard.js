(function (Drupal) {
  Drupal.behaviors.recommendationWizardExperimental = {
    attach(context) {
      context.querySelectorAll?.('[data-component-id="C12"]').forEach((component) => {
        if (component.dataset.wizardReady) return;
        component.dataset.wizardReady = 'true';
        const form = component.querySelector('form');
        const steps = [...component.querySelectorAll('[data-wizard-step]')];
        const progress = [...component.querySelectorAll('[data-wizard-progress]')];
        const error = component.querySelector('.recommendation-wizard__error');
        const result = component.querySelector('[data-wizard-result]');
        let current = 0;
        const render = () => {
          steps.forEach((step, index) => { step.hidden = index !== current; });
          progress.forEach((item, index) => item.toggleAttribute('aria-current', index === current));
        };
        component.querySelector('[data-wizard-next]')?.addEventListener('click', () => {
          const field = steps[current].querySelector('input:checked, select');
          if (!field || !field.value) { error.textContent = 'Selecciona una opción para continuar.'; field?.focus(); return; }
          error.textContent = '';
          if (current < steps.length - 1) { current += 1; render(); steps[current].querySelector('input, select')?.focus(); return; }
          form.hidden = true; result.hidden = false; progress.forEach((item) => item.removeAttribute('aria-current'));
        });
        component.querySelector('[data-wizard-back]')?.addEventListener('click', () => { if (current > 0) { current -= 1; render(); } });
        render();
      });
    }
  };
})(Drupal);
