(function (Drupal, once) {
  Drupal.behaviors.sdcLandingHeader = {
    attach(context) {
      once('sdc-landing-header', '.site-header__toggle', context).forEach((toggle) => {
        const navigation = document.getElementById(toggle.getAttribute('aria-controls'));
        toggle.addEventListener('click', () => {
          const open = toggle.getAttribute('aria-expanded') === 'true';
          toggle.setAttribute('aria-expanded', String(!open));
          navigation.classList.toggle('is-open', !open);
        });
      });
    },
  };
})(Drupal, once);
