/* PAGE 2 HERO STUDY 02 / OPTION 2.
   SVG signals along the centerline of the raster vortex — image and track share
   a 1672 × 941 coordinate system (cover/slice alignment).
   No scroll hijacking; JS only animates light particles. */
(()=>{
  'use strict';
  const svg=document.querySelector('.p2-vortex-motion');
  const track=document.getElementById('p2VortexTrack');
  const layer=document.getElementById('p2VortexParticles');
  if(!svg||!track||!layer)return;
  const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(prefersReduced.matches)return;
  const ns='http://www.w3.org/2000/svg';
  const length=track.getTotalLength();
  const spacing=[0,.19,.40,.61,.81];
  const duration=8.8;
  const particles=spacing.map((phase,i)=>{
    const g=document.createElementNS(ns,'g');g.classList.add('p2-vortex-particle');
    const bloom=document.createElementNS(ns,'circle');
    bloom.setAttribute('r',i%2===0?'28':'24');bloom.setAttribute('fill','#70ffd0');
    bloom.setAttribute('opacity','.40');bloom.setAttribute('filter','url(#p2OrbGlow)');
    const halo=document.createElementNS(ns,'circle');
    halo.setAttribute('r',i%2===0?'12':'10');halo.setAttribute('fill','#67ffc3');halo.setAttribute('opacity','.40');
    const core=document.createElementNS(ns,'circle');
    core.setAttribute('r',i%2===0?'5.9':'4.5');core.setAttribute('fill','#f7fff9');
    g.append(bloom,halo,core);layer.append(g);return {g,phase};
  });
  let active=false, raf=0, started=0, previous=0, elapsed=0;
  const clamp=(x)=>Math.min(1,Math.max(0,x));
  function draw(time){
    if(!active)return;
    if(!previous)previous=time;
    elapsed+=Math.min(55,Math.max(0,time-previous))/1000;
    previous=time;
    const cycle=elapsed/duration;
    for(const {g,phase} of particles){
      const t=(cycle+phase)%1;
      // Gentle acceleration: speed increases toward the convergence point.
      const distance=Math.pow(t,1.19);
      const point=track.getPointAtLength(distance*length);
      const fade=clamp(t/.075)*clamp((1-t)/.09);
      g.setAttribute('transform',`translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
      g.setAttribute('opacity',fade.toFixed(3));
    }
    raf=requestAnimationFrame(draw);
  }
  function start(){if(active||document.hidden||prefersReduced.matches)return;
    active=true;previous=0;raf=requestAnimationFrame(draw);}
  function stop(){active=false;if(raf)cancelAnimationFrame(raf);raf=0;previous=0;}
  const observer=new IntersectionObserver(entries=>{
    if(entries[0]?.isIntersecting)start();else stop();
  },{threshold:0});
  observer.observe(svg);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)stop();else if(svg.getBoundingClientRect().bottom>0 && svg.getBoundingClientRect().top<innerHeight)start();
  });
  if(prefersReduced.addEventListener)prefersReduced.addEventListener('change',()=>{
    if(prefersReduced.matches){stop();layer.replaceChildren();}else if(svg.getBoundingClientRect().bottom>0&&svg.getBoundingClientRect().top<innerHeight){location.reload();}
  });
})();
