/* G2M / PAGE 02: shared navigation, editorial reveals, shared footer. */
(()=>{
 const nav=document.getElementById('mainNav');const mobile=document.getElementById('mobileLinks');const toggle=document.getElementById('mobileToggle');
 const update=()=>nav.classList.toggle('floating',window.scrollY>90);
 window.addEventListener('scroll',update,{passive:true});update();
 if(toggle && mobile){toggle.addEventListener('click',()=>{const open=mobile.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'×':'☰';});mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobile.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰';}));}
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!reduced && 'IntersectionObserver' in window){document.documentElement.classList.add('js-animations');const obs=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');obs.unobserve(entry.target);}})},{threshold:.10,rootMargin:'0px 0px -25px 0px'});document.querySelectorAll('.reveal-on-view').forEach(el=>obs.observe(el));}
})();
/* ============================================================
   SECTION 07 / FOOTER — SCROLL-LINKED WORDMARK + NAV REVEAL
   Based on approved Footer Motion Study 01. No demo controls.
   CSS vars on #g2mFooter govern animation. Honors reduced motion.
   ============================================================ */
(()=>{
  const footer=document.getElementById('g2mFooter');
  if(!footer)return;
  const stage=footer.querySelector('#wordmarkStage');
  const main=footer.querySelector('#footerMain');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=n=>Math.max(0,Math.min(1,n));
  let raf=0;
  function update(){
    raf=0;
    if(reduce.matches){
      footer.style.setProperty('--wordmark-shift','0');
      footer.style.setProperty('--wordmark-opacity','1');
      footer.style.setProperty('--footer-enter','1');
      return;
    }
    const vh=window.innerHeight;
    const r=stage.getBoundingClientRect();
    const progress=clamp((vh*.92-r.top)/(vh*.55));
    const smooth=progress*progress*(3-2*progress);
    footer.style.setProperty('--wordmark-shift',(1-smooth).toFixed(4));
    footer.style.setProperty('--wordmark-opacity',clamp(progress*2.1).toFixed(4));
    const m=main.getBoundingClientRect();
    const enter=clamp((vh*.91-m.top)/(vh*.54));
    footer.style.setProperty('--footer-enter',enter.toFixed(4));
  }
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(update)};
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  if(reduce.addEventListener)reduce.addEventListener('change',schedule);
  else if(reduce.addListener)reduce.addListener(schedule);
  const year=footer.querySelector('#year');
  if(year)year.textContent=new Date().getFullYear();
  update();
})();


