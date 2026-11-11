/* STUDY 09 — Scroll-progressive gold reveal of the homepage Velocity headline. */
(() => {
  'use strict';
  const heading = document.querySelector('#velocity h2');
  if (!heading) return;
  const words = Array.from(heading.querySelectorAll('.velocity-scroll-word'));
  if (!words.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let queued = false;
  function update() {
    queued = false;
    const rect = heading.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    // A long visible progression, not a timer. Reverse scrolling reverses the color.
    const start = vh * 0.87;
    const end = vh * 0.37;
    const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
    const lit = reduced.matches ? (progress > 0 ? words.length : 0) : Math.round(progress * words.length);
    words.forEach((word, i) => word.classList.toggle('is-lit', i < lit));
  }
  function schedule() {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener?.('change', schedule);
  update();
})();
