/* FOUNDATION 33: auto-size the independent Study 07 canvas inside Page 2.
   Keep iframe isolation so Studio 07's standalone CSS cannot affect existing page UI. */
(()=>{
 const frame=document.getElementById('g2mVelocityFrame');if(!frame)return;
 let currentHeight=480;
 window.addEventListener('message',e=>{
  if(e.source!==frame.contentWindow || !e.data || e.data.type!=='g2m-velocity-height')return;
  const n=Number(e.data.height);
  if(Number.isFinite(n)&&n>250&&n<12000&&Math.abs(n-currentHeight)>1){currentHeight=n;frame.style.height=n+'px';}
 });
 function visible(){try{frame.contentWindow.postMessage('g2m-velocity-visible','*')}catch(_){}}
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){visible();observer.disconnect()}},{threshold:.10});observer.observe(frame)}else visible();
})();
