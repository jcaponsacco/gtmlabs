
    /* ============================================================
       INTERACTION — Card expansion / collapse
       Each founder operates independently; no other site scripts.
       ============================================================ */
    document.querySelectorAll('.founder').forEach((card) => {
      const toggle = card.querySelector('.bio-toggle');
      const label = toggle.querySelector('.toggle-label');
      const biography = card.querySelector('.biography');

      toggle.addEventListener('click', () => {
        const expanded = card.classList.toggle('is-expanded');
        toggle.setAttribute('aria-expanded', String(expanded));
        label.textContent = expanded ? 'Back to profile' : 'View bio';
        biography.inert = !expanded;

        if (!expanded) {
          biography.querySelector('.bio-scroll').scrollTop = 0;
        }
      });
    });
  