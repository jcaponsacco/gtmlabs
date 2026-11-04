
/* G2M Cards Study 02 — progressive enhancement only.
   Static links remain available without JavaScript or with reduced motion. */
(() => {
  const section = document.querySelector('.g2m-deal-section');
  if (!section || !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cards = [...section.querySelectorAll('.g2m-deal-card')];
  // Only hide cards when the observer can activate; no hidden-by-default content.
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        cards.forEach(card => card.classList.add('dealt'));
        observer.disconnect();
        break;
      }
    }
  }, {threshold: 0.12});
  section.classList.add('deal-ready');
  observer.observe(section);
})();

