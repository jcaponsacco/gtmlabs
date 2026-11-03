/* G2M / SHARED NAV STUDY 02 — both desktop dropdowns + mobile accordions. */
(()=>{'use strict';
  const groups=[...document.querySelectorAll('.nav-service-group')];
  const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)');
  const controllers=[];
  groups.forEach(group=>{
    const trigger=group.querySelector('.nav-service-toggle');
    const panel=group.querySelector('.nav-service-panel');
    if(!trigger || !panel) return;
    let pinned=false, timer=0, suppressFocus=false;
    const setOpen=(open)=>{group.classList.toggle('is-open',open);trigger.setAttribute('aria-expanded',String(open));panel.setAttribute('aria-hidden',String(!open));};
    const close=()=>{pinned=false;clearTimeout(timer);setOpen(false);};
    const scheduleClose=()=>{clearTimeout(timer);timer=setTimeout(()=>{if(!pinned && !group.contains(document.activeElement))setOpen(false);},170);};
    controllers.push({group,close});
    group.addEventListener('pointerenter',()=>{suppressFocus=false;clearTimeout(timer);if(finePointer.matches)setOpen(true);});
    group.addEventListener('pointerleave',()=>{if(finePointer.matches&&!pinned)scheduleClose();});
    group.addEventListener('focusin',()=>{if(suppressFocus)return;clearTimeout(timer);setOpen(true);});
    group.addEventListener('focusout',e=>{if(!group.contains(e.relatedTarget)){suppressFocus=false;if(!pinned)scheduleClose();}});
    trigger.addEventListener('click',()=>{const next=!pinned;controllers.forEach(c=>{if(c.group!==group)c.close();});suppressFocus=false;pinned=next;setOpen(pinned);});
    panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    group.addEventListener('keydown',e=>{if(e.key==='ArrowDown' && document.activeElement===trigger){e.preventDefault();setOpen(true);panel.querySelector('a')?.focus();}});
    controllers[controllers.length-1].focusTrigger=()=>{suppressFocus=true;trigger.focus();};
  });
  document.addEventListener('pointerdown',e=>controllers.forEach(c=>{if(!c.group.contains(e.target))c.close();}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')controllers.forEach(c=>{if(c.group.classList.contains('is-open')){c.close();c.focusTrigger();}});});
  window.addEventListener('resize',()=>{if(window.innerWidth<=850)controllers.forEach(c=>c.close());});
  const mobile=document.querySelector('#mobileLinks');
  const menu=document.querySelector('#mobileToggle');
  if(mobile && menu){
    const disclosures=[...mobile.querySelectorAll('.mobile-service-group')];
    disclosures.forEach(current=>{
      current.addEventListener('toggle',()=>{if(current.open)disclosures.forEach(other=>{if(other!==current)other.open=false;});});
    });
    mobile.addEventListener('click',e=>{if(e.target.closest('a'))disclosures.forEach(d=>{d.open=false;});});
    menu.addEventListener('click',()=>{if(!mobile.classList.contains('open'))disclosures.forEach(d=>{d.open=false;});});
  }
})();
