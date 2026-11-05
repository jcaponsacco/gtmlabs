/* G2M LABS — PAGE 2 HERO SIGNAL STUDY 01
   Extends Foundation 26's approved static vortex and SVG centerline.
   Change SIGNAL_SETTINGS below to tune individual colors and motion.
   Page 1 palette is faithfully mirrored here.
   IMPORTANT: Do not change the #p2VortexTrack SVG path unless the image changes.
*/
(()=>{
  'use strict';

  // ================================================================
  // EDIT HERE / SIGNAL CONFIGURATION
  // ================================================================
  const SIGNAL_SETTINGS = {
    // Source: Page 1 main.js hero signal colors. Hex equivalents.
    palette: {
      gold:     '#FFCD57',
      lavender: '#B388FF',
      sky:      '#6FD0FF',
      orange:   '#FF9A57',
      white:    '#FFFFFF'
    },
    durationSeconds: 8.8,  // Lower number = faster complete circuit
    acceleration: 1.19,    // 1 = constant speed; >1 accelerates near star
    fadeInFraction: 0.075,
    fadeOutFraction: 0.09,
    haloOpacity: 0.24,     // Keep glows subordinate to green vortex artwork
    bloomOpacity: 0.30,
    coreOpacity: 0.95,
    // phase = start offset around the loop; 0..1. size is SVG image units.
    signals: [
      {name:'Information / gold',    color:'gold',     phase:0.00, size:5.9, glow:1.00},
      {name:'Judgment / lavender',   color:'lavender', phase:0.19, size:4.9, glow:0.92},
      {name:'Intelligence / sky',    color:'sky',      phase:0.40, size:5.7, glow:0.96},
      {name:'Execution / orange',    color:'orange',   phase:0.61, size:5.0, glow:0.90},
      {name:'Learning / white',      color:'white',    phase:0.81, size:4.8, glow:0.80}
    ]
  };
  // ================================================================

  const svg=document.querySelector('.p2-vortex-motion');
  const track=document.getElementById('p2VortexTrack');
  const layer=document.getElementById('p2VortexParticles');
  if(!svg||!track||!layer)return;
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const ns='http://www.w3.org/2000/svg';
  const total=track.getTotalLength();
  const clamp=x=>Math.max(0,Math.min(1,x));
  const make=(tag,attr={})=>{
    const el=document.createElementNS(ns,tag);
    for(const [key,val] of Object.entries(attr))el.setAttribute(key,String(val));
    return el;
  };
  const particles=SIGNAL_SETTINGS.signals.map((cfg)=>{
    const color=SIGNAL_SETTINGS.palette[cfg.color]||cfg.color;
    const group=make('g',{class:'p2-vortex-particle','aria-hidden':'true'});
    const bloom=make('circle',{
      r:cfg.size*4.9*cfg.glow,fill:color,
      opacity:SIGNAL_SETTINGS.bloomOpacity,filter:'url(#p2OrbGlow)'
    });
    const halo=make('circle',{
      r:cfg.size*2.15*cfg.glow,fill:color,opacity:SIGNAL_SETTINGS.haloOpacity
    });
    const core=make('circle',{
      r:cfg.size,fill:color,opacity:SIGNAL_SETTINGS.coreOpacity
    });
    const glint=make('circle',{
      r:Math.max(1.45,cfg.size*.25),cx:-cfg.size*.22,cy:-cfg.size*.22,
      fill:'#FFFFFF',opacity:.70
    });
    group.append(bloom,halo,core,glint);
    layer.appendChild(group);
    return {group,phase:cfg.phase};
  });

  let active=false,raf=0,last=0,elapsed=0;
  function draw(time){
    if(!active)return;
    if(!last)last=time;
    elapsed+=Math.min(55,Math.max(0,time-last))/1000;
    last=time;
    const cycle=elapsed/Math.max(0.5,SIGNAL_SETTINGS.durationSeconds);
    for(const {group,phase} of particles){
      const t=((cycle+phase)%1+1)%1;
      const distance=Math.pow(t,Math.max(.25,SIGNAL_SETTINGS.acceleration));
      const point=track.getPointAtLength(distance*total);
      const opacity=clamp(t/Math.max(.001,SIGNAL_SETTINGS.fadeInFraction))
        *clamp((1-t)/Math.max(.001,SIGNAL_SETTINGS.fadeOutFraction));
      group.setAttribute('transform',`translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
      group.setAttribute('opacity',opacity.toFixed(3));
    }
    raf=requestAnimationFrame(draw);
  }
  function start(){
    if(active||document.hidden||media.matches)return;
    active=true;last=0;raf=requestAnimationFrame(draw);
  }
  function stop(){
    active=false;
    if(raf)cancelAnimationFrame(raf);
    raf=0;last=0;
  }
  // The reduced-motion preference stops light motion without removing content.
  if(media.matches){layer.replaceChildren();return;}
  const observer=new IntersectionObserver(entries=>{
    if(entries[0]&&entries[0].isIntersecting)start();else stop();
  },{threshold:0});
  observer.observe(svg);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)stop();
    else if(svg.getBoundingClientRect().bottom>0&&svg.getBoundingClientRect().top<innerHeight)start();
  });
  const change=()=>{
    if(media.matches){stop();layer.replaceChildren();}
    else if(!layer.children.length){window.location.reload();}
    else if(svg.getBoundingClientRect().bottom>0&&svg.getBoundingClientRect().top<innerHeight)start();
  };
  if(media.addEventListener)media.addEventListener('change',change);
  else if(media.addListener)media.addListener(change);
})();
