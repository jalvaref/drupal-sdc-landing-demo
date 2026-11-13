(function (Drupal) {
  Drupal.behaviors.planComparisonExperimental = {
    attach(context) {
      context.querySelectorAll?.('[data-component-id="C11"]').forEach((component) => {
        if (component.dataset.planComparisonReady) return;
        component.dataset.planComparisonReady = 'true';
        component.querySelectorAll('input[name="plan-selection"]').forEach((input) => {
          input.addEventListener('change', () => component.dataset.selectedPlan = input.value);
        });
      });
    }
  };
})(Drupal);
