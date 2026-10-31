
/* ================================================================
   JAVASCRIPT — G2M MOTION CONFIGURATION
   All ranges are 0–1 scroll progress THROUGH THEIR OWN STICKY SECTION.
   Larger intervals = slower animations over more scrolling distance.
   To change total scroll distance, edit .hero-story and #pipeline .story height in CSS.
   ================================================================ */
const G2M_MOTION_CONFIG={
 hero:{compressEnd:.22,exitStart:.16,exitEnd:.73,signals:[.17,.25,.33,.41],signalLength:.08,wordsStart:.58,wordsEnd:.93}
};
/* SECTION 00 + SECTION 01 / NAVIGATION AND HERO — logic retained from Foundation 02. */
(()=>{'use strict';
const $=sel=>document.querySelector(sel),$$=sel=>[...document.querySelectorAll(sel)],clamp=n=>Math.max(0,Math.min(1,n)),ease=n=>{n=clamp(n);return n*n*(3-2*n)},phase=(p,a,b)=>ease((p-a)/(b-a)),mix=(a,b,t)=>a+(b-a)*t;
const nav=$('#mainNav'),mobile=$('#mobileLinks'),menu=$('#mobileToggle'),hero=$('#home'),heroMoving=$('#heroMoving'),heroFrame=$('#heroFrame'),signals=$$('.signal'),words=[];
$('#statement').querySelectorAll('.statement-line').forEach(line=>{const raw=line.textContent.trim();line.textContent='';raw.split(/(\s+)/).forEach(part=>{if(!part)return;if(/^\s+$/.test(part)){line.append(document.createTextNode(part));return}const w=document.createElement('span');w.className='statement-word';w.textContent=part;w.dataset.target=line.classList.contains('phrase-purple')?'#7861a5':(['becomes','visible.'].includes(part)?'#43836a':'#18342c');line.append(w);words.push(w)})});
const hParts=$('#heroSubline'), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function color(a,b,t){return 'rgb('+a.map((v,i)=>Math.round(mix(v,b[i],t))).join(',')+')'}

function initHeroSignals(){
  const svg=document.querySelector('.hero-signal-svg');
  const layer=document.getElementById('heroClustersLayer');
  if(!svg || !layer) return;
  const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ns='http://www.w3.org/2000/svg';
  const colors={lavender:'rgba(179,136,255,1)',sky:'rgba(111,208,255,1)',gold:'rgba(255,205,87,1)',orange:'rgba(255,154,87,1)',white:'rgba(255,255,255,0.95)'};
  const configs=[
    { pathId:'heroPath1', duration:7.8, delay:0.0, color:'gold', size:12, tail:28, secondaryCount:3, pulseScale:1.0 },
    { pathId:'heroPath1', duration:7.8, delay:2.9, color:'gold', size:10, tail:24, secondaryCount:2, pulseScale:0.9 },
    { pathId:'heroPath2', duration:6.2, delay:1.3, color:'lavender', size:8.5, tail:18, secondaryCount:3, pulseScale:1.0 },
    { pathId:'heroPath3', duration:5.8, delay:2.0, color:'sky', size:8.5, tail:16, secondaryCount:2, pulseScale:0.95 },
    { pathId:'heroPath4', duration:10.0, delay:0.4, color:'orange', size:7.5, tail:12, secondaryCount:1, pulseScale:0.75 },
    { pathId:'heroPath5', duration:8.8, delay:1.6, color:'white', size:7.5, tail:14, secondaryCount:2, pulseScale:0.78 }
  ];
  const makeEl=(name,attrs={})=>{const el=document.createElementNS(ns,name);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));return el;};
  function createCluster(cfg){
    const path=document.getElementById(cfg.pathId); if(!path || !path.getTotalLength) return null;
    const total=path.getTotalLength();
    const g=makeEl('g',{class:'hero-cluster',filter:'url(#heroSoftGlow)'});
    const tail=makeEl('ellipse',{rx:cfg.tail,ry:cfg.size*.62,fill:colors[cfg.color],opacity:.08});
    const halo=makeEl('circle',{r:cfg.size*1.65,fill:colors[cfg.color],opacity:.18});
    const core=makeEl('circle',{r:cfg.size,fill:colors[cfg.color],opacity:.96});
    const sparkle=makeEl('circle',{r:cfg.size*.18,fill:'rgba(255,255,255,0.95)',opacity:.85});
    g.append(tail,halo,core,sparkle);
    const secondaries=[];
    for(let i=0;i<cfg.secondaryCount;i++){const s=makeEl('circle',{r:Math.max(1.8,cfg.size*(.18-i*.02)),fill:colors[cfg.color],opacity:.66-i*.12});g.appendChild(s);secondaries.push(s);}
    layer.appendChild(g);
    return {cfg,path,total,g,tail,halo,core,sparkle,secondaries};
  }
  const clusters=configs.map(createCluster).filter(Boolean);
  const clamp01=n=>Math.max(0,Math.min(1,n));
  const easeIO=n=>n<.5?2*n*n:-1+(4-2*n)*n;
  function pointAndAngle(path,total,t){const len=total*t;const p=path.getPointAtLength(len);const p2=path.getPointAtLength(Math.min(total,len+.8));const angle=Math.atan2(p2.y-p.y,p2.x-p.x)*180/Math.PI;return {x:p.x,y:p.y,angle};}
  let start=null;
  function tick(ts){
    if(!start) start=ts;
    const elapsed=(ts-start)/1000;
    clusters.forEach((obj,index)=>{
      const dur=prefersReduced?obj.cfg.duration*2.5:obj.cfg.duration;
      const raw=((elapsed-obj.cfg.delay)%dur+dur)%dur;
      const t=raw/dur;
      const eased=easeIO(t);
      const pa=pointAndAngle(obj.path,obj.total,eased);
      obj.g.setAttribute('transform',`translate(${pa.x}, ${pa.y}) rotate(${pa.angle})`);
      const pulse=.9+Math.sin((elapsed*2.9+index)*Math.PI)*.08;
      obj.core.setAttribute('r',obj.cfg.size*pulse*obj.cfg.pulseScale);
      obj.halo.setAttribute('r',obj.cfg.size*1.6*(.95+Math.sin(elapsed*1.7+index)*.07));
      obj.tail.setAttribute('rx',obj.cfg.tail*(.92+Math.sin(elapsed*1.25+index)*.06));
      obj.tail.setAttribute('opacity',String(.05+.03*(Math.sin(elapsed*2+index)+1)));
      obj.sparkle.setAttribute('cx',(-obj.cfg.size*.35).toFixed(2));
      obj.sparkle.setAttribute('cy',(-obj.cfg.size*.28).toFixed(2));
      obj.secondaries.forEach((s,i)=>{
        const spread=(i+1)*(obj.cfg.size*1.25);
        s.setAttribute('cx',String(-spread-(Math.sin(elapsed*2.2+i+index)*3)));
        s.setAttribute('cy',String(Math.cos(elapsed*2.0+i+index)*2.5));
        s.setAttribute('opacity',String(.4-i*.09+.12*Math.sin(elapsed*3.0+i+index)));
      });
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

let scheduled=false;
function render(){scheduled=false;nav.classList.toggle('floating',scrollY>90);if(reduced)return;
const r=hero.getBoundingClientRect(),h=Math.max(1,hero.offsetHeight-innerHeight),p=clamp(-r.top/h),H=G2M_MOTION_CONFIG.hero,compress=phase(p,0,H.compressEnd),exit=phase(p,H.exitStart,H.exitEnd);
heroFrame.style.transform=`scale(${(1-.15*compress).toFixed(4)})`;heroMoving.style.transform=`translateY(${(-123*exit).toFixed(2)}vh)`;
signals.forEach((s,i)=>{let v=phase(p,H.signals[i],H.signals[i]+H.signalLength);s.style.opacity=v;s.style.transform=`translateY(${((1-v)*16).toFixed(1)}px)`});
words.forEach((w,i)=>{const t=phase(p,H.wordsStart+i/words.length*(H.wordsEnd-H.wordsStart),H.wordsStart+(i+1)/words.length*(H.wordsEnd-H.wordsStart));const hex=w.dataset.target.slice(1),c=[0,2,4].map(j=>parseInt(hex.slice(j,j+2),16));w.style.color=color([190,198,190],c,t)});
const ht=phase(p,.75,.92);hParts.style.opacity=ht;hParts.style.transform=`translateY(${(18*(1-ht)).toFixed(1)}px)`;}
function request(){if(!scheduled){scheduled=true;requestAnimationFrame(render)}}
menu.addEventListener('click',()=>{const open=mobile.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'});
$$('.mobile-links a').forEach(a=>a.addEventListener('click',()=>{mobile.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}));
initHeroSignals();
/* Foundation 04 service card controller below (SECTION 05). */
addEventListener('scroll',request,{passive:true});addEventListener('resize',request);render();
})();

/* SECTION 02 / GROWTH ENGINE — approved Concept 04 headline animation on Concept 03 pipeline. */
/* SECTION 02 / ENGINE CONTROLLER — Adjustable animation timing below. */
(()=>{
 const story=document.getElementById('engineStory'),stage=document.getElementById('engineStage');
 const el=id=>document.getElementById(id),clamp=n=>Math.min(1,Math.max(0,n));
 const ease=n=>{n=clamp(n);return n*n*(3-2*n)};
 const between=(p,a,b)=>ease((p-a)/(b-a));
 const scenes=[['01 / ACTIVITY','The pipeline looks busy.','Signals move left to right. Commercial activity appears healthy on the surface.'],['02 / FRICTION','The problems start to surface.','The flow continues, but stalled deals, absent champions and uncertain next steps become visible.'],['03 / OPEN','Look beneath the pipeline.','The outer pipeline opens and fades, exposing the commercial factors that affect its performance.'],['04 / REVEAL','The problem may begin elsewhere.','Investigate the six interconnected factors rather than treating pipeline symptoms as root causes.']];

 /* Headline changes align with each scene. Words rise in; individual letters
    sweep from purple to dark ink. Reversible because all values derive from p. */
 const titleHost=el('headlineWords');
 const sceneStarts=[0,.20,.49,.76];
 const sceneEnds=[.20,.49,.76,1];
 const wordElements=[];
 let titleScene=-1;
 function buildTitle(i){
   if(titleScene===i)return;
   titleScene=i;
   titleHost.replaceChildren();wordElements.length=0;
   scenes[i][1].split(' ').forEach(word=>{
     const wrap=document.createElement('span');wrap.className='headline-word';
     const face=document.createElement('span');face.className='headline-word-face';
     const letters=[];
     [...word].forEach(ch=>{const span=document.createElement('span');span.className='headline-letter';span.textContent=ch;face.append(span);letters.push(span)});
     wrap.append(face);titleHost.append(wrap);wordElements.push({face,letters});
   });
   el('stageHeadline').setAttribute('aria-label',scenes[i][1]);
 }
 function drawTitle(i,p){
   buildTitle(i);
   const range=sceneEnds[i]-sceneStarts[i];
   const local=clamp((p-sceneStarts[i])/Math.max(range,.001));
   const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   wordElements.forEach(({face,letters},wi)=>{
      const count=wordElements.length;
      // First word responds immediately; remaining words follow as the user scrolls.
      const start=i===3?wi*.04:wi*.095;
      const wordProgress=reduced?1:ease(clamp((local-start)/(i===3?.12:.28)));
      face.style.opacity=String(.18+.82*wordProgress);
      face.style.transform=`translateY(${(1-wordProgress)*18}px)`;
      face.style.clipPath=`inset(${(1-wordProgress)*92}% 0 0 0)`;
      letters.forEach((letter,li)=>{
         const sweep=reduced?1:ease(clamp((local-start-(i===3?.012:.035)-li*(i===3?.004:.024))/(i===3?.08:.24)));
         // Crossfade color from #7861A5 to #18342C one letter at a time.
         const a=[120,97,165],b=[24,52,44];
         letter.style.color=`rgb(${a.map((v,k)=>Math.round(v+(b[k]-v)*sweep)).join(',')})`;
      });
   });
 }
 let manual=null,queued=false,lastP=-1;
 function render(p){p=clamp(p);if(Math.abs(p-lastP)<.0004)return;lastP=p;
 const emerge=between(p,.18,.42), open=between(p,.48,.77),reveal=between(p,.62,.87);
 el('progress').style.width=(p*100)+'%';el('percent').textContent=String(Math.round(p*100)).padStart(3,'0')+'% / SCROLL';
 const w=el('warnings').children;[...w].forEach((item,i)=>{const t=between(p,.17+i*.055,.29+i*.055);item.style.opacity=t;item.style.transform=`translateY(${(1-t)*55}px)`});
 el('pipeUpper').style.transform=`translateY(${-open*95}%)`;el('pipeLower').style.transform=`translateY(${open*95}%)`;
 const fade=1-between(p,.61,.82);el('pipeUpper').style.opacity=fade;el('pipeLower').style.opacity=fade;el('pipeInner').style.opacity=1-between(p,.52,.7);el('pipeStages').style.opacity=1-between(p,.50,.67);
 el('warnings').style.opacity=1-between(p,.50,.70);el('pipeZone').style.opacity=1-between(p,.69,.88);
 el('engineSystem').style.opacity=reveal;el('engineSystem').style.transform=`translateY(${(1-reveal)*25}px) scale(${.98+.02*reveal})`;el('engineSystem').style.pointerEvents=reveal>.8?'auto':'none';// Timing lock: Target activates ONLY AFTER the last letter of 'elsewhere.'
 // has finished its purple-to-ink sweep. Final-scene title timing above is
 // intentionally quicker to reserve scroll distance for five diagnostics.
 // Final scene begins at .76; last letter finishes at local progress about .288.
 // We use .30 to give its final color frame time to settle.
 const finalLocal=clamp((p-sceneStarts[3])/(sceneEnds[3]-sceneStarts[3]));
 if(!userSelected){
   if(p<sceneStarts[3] || finalLocal<.30){
     if(stageActivated){stageActivated=false;st.forEach(e=>{e.classList.remove('active');e.setAttribute('aria-pressed','false')});}
   }else{
     // Hold Target from .30 to .47 of the final scene, then step through issues.
     const idx=finalLocal<.47?0:Math.min(4,1+Math.floor(clamp((finalLocal-.47)/.53)*4));
     if(!stageActivated || selected!==idx){stageActivated=true;selectOriginal(idx);}
   }
 }
 const i=p<.2?0:p<.49?1:p<.76?2:3; const [label,title,desc]=scenes[i];el('narrativeIndex').textContent=label;el('narrativeTitle').textContent=title;el('narrativeText').textContent=desc;drawTitle(i,p);el('stageSubhead').textContent=desc;el('stageStatus').textContent=['01 — PIPELINE IN MOTION','02 — FRICTION EMERGES','03 — OPENING THE PIPELINE','04 — COMMERCIAL FACTORS REVEALED'][i];
 }
 function current(){if(manual!==null)return manual;const r=story.getBoundingClientRect();return clamp(-r.top/Math.max(1,story.offsetHeight-window.innerHeight))}
 function request(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render(current())})}
 document.querySelectorAll('[data-jump]').forEach(btn=>btn.addEventListener('click',()=>{manual=null;const p=+btn.dataset.jump;window.scrollTo({top:window.scrollY+story.getBoundingClientRect().top+p*Math.max(1,story.offsetHeight-window.innerHeight),behavior:'smooth'});}));
 el('restart').addEventListener('click',()=>{manual=null;window.scrollTo({top:window.scrollY+story.getBoundingClientRect().top,behavior:'smooth'})});
 const stageData=[
 {name:'TARGET',question:'Are we focused on the right segments and buyers?',body:'Poor market focus or buyer fit may not become obvious until opportunities begin to stall. Test whether the right demand is entering the system.',levers:[0,1,2]},
 {name:'ENGAGE',question:'Are we creating relevant conversations?',body:'More outreach may create activity without progression when relevance, timing and the message do not connect with buyers.',levers:[1,2,3]},
 {name:'DISCOVER',question:'Are we uncovering a compelling reason to change?',body:'Opportunities can hesitate when urgency, business impact and decision criteria are not established.',levers:[1,3,4]},
 {name:'PROPOSE',question:'Are we building a clear path to a decision?',body:'Proposals may stall when business value, buying roles and decision ownership are unclear.',levers:[2,3,4]},
 {name:'WIN',question:'Can we repeat successful outcomes?',body:'Founder-led or highly individual wins may signal a repeatability problem, rather than simply a pipeline-volume problem.',levers:[3,4,5]}
 ];
 const leverNames=['Market','Buyer','Message','People','Process','Technology'];
 const st=[...document.querySelectorAll('.original-stage')], factors=[...document.querySelectorAll('.original-factor')];
 let selected=0, userSelected=false, stageActivated=true;
 const draw=()=>{
   const svg=el('originalConnectors');if(!svg)return;
   const host=el('originalReveal').getBoundingClientRect();if(!host.width||!host.height)return;
   svg.setAttribute('viewBox',`0 0 ${host.width} ${host.height}`);svg.replaceChildren();
   st.forEach((node,i)=>stageData[i].levers.forEach(j=>{
     const a=node.getBoundingClientRect(),b=factors[j].getBoundingClientRect(),x1=a.left+a.width/2-host.left,y1=a.bottom-host.top,x2=b.left+b.width/2-host.left,y2=b.top-host.top,m=(y1+y2)/2;
     const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',`M${x1} ${y1} C${x1} ${m},${x2} ${m},${x2} ${y2}`);if(i===selected)path.setAttribute('class','active');svg.append(path)
   }));
 };
 function selectOriginal(i,fromUser=false){selected=i;if(fromUser)userSelected=true;const d=stageData[i];st.forEach((e,n)=>{e.classList.toggle('active',i===n);e.setAttribute('aria-pressed',String(i===n))});factors.forEach((e,n)=>e.classList.toggle('active',d.levers.includes(n)));el('originalLabel').textContent=String(i+1).padStart(2,'0')+' / '+d.name;el('originalStep').textContent=String(i+1).padStart(2,'0')+' / 05';el('originalQuestion').textContent=d.question;el('originalAnswer').textContent=d.body;el('originalTags').replaceChildren(...d.levers.map(k=>{const tag=document.createElement('span');tag.textContent=leverNames[k];return tag}));draw();}
 st.forEach((b,i)=>b.addEventListener('click',()=>selectOriginal(i,true)));
 factors.forEach((b,j)=>b.addEventListener('click',()=>{const match=stageData.findIndex((d,i)=>d.levers.includes(j)&&i!==selected);selectOriginal(match>=0?match:selected,true)}));
 selectOriginal(0);window.addEventListener('resize',()=>requestAnimationFrame(draw));
 window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',request);render(current());
})();

/* SECTION 03 / CALCULATOR — Chris's existing model preserved */
(()=>{const models={ae:{title:'More sellers',subtitle:'First-year AE investment',fields:[['count','Number of AEs',1,1,10,1,''],['cost','Annual fully loaded cost per AE',220000,60000,400000,5000,'$']]},sdr:{title:'More SDRs',subtitle:'Annual team investment',fields:[['count','Number of SDRs',2,1,20,1,''],['cost','Annual fully loaded cost per SDR',115000,40000,200000,5000,'$']]},systems:{title:'More GTM systems',subtitle:'CRM, prospect data, enrichment, website visitor identification and other subscriptions',fields:[['cost','Monthly licenses and subscriptions',4500,250,30000,250,'$']]},leader:{title:'More of your time',subtitle:'Annual opportunity cost of executive involvement',fields:[['hours','Additional hours per week',10,1,50,1,''],['rate','Value per hour',250,50,1000,25,'$']]}};const state={};for(const [k,v]of Object.entries(models))state[k]=Object.fromEntries(v.fields.map(f=>[f[0],f[2]]));let current='ae';const fmt=n=>'$'+Math.round(n).toLocaleString();function render(){const m=models[current],st=state[current];document.getElementById('investTitle').textContent=m.title;document.getElementById('investSubtitle').textContent=m.subtitle;const root=document.getElementById('investmentInputs');root.innerHTML='';m.fields.forEach(([id,label,def,min,max,step,prefix])=>{let wrap=document.createElement('label');wrap.className='invest-slider';wrap.style.display='block';wrap.style.marginBottom='18px';const title=document.createElement('div');title.style.cssText='display:flex;justify-content:space-between;gap:12px;margin-bottom:9px';const name=document.createElement('span');name.textContent=label;const val=document.createElement('strong');val.textContent=(prefix||'')+Number(st[id]).toLocaleString();title.append(name,val);const input=document.createElement('input');input.type='range';input.min=min;input.max=max;input.step=step;input.value=st[id];input.style.width='100%';input.setAttribute('aria-label',label);input.addEventListener('input',()=>{st[id]=Number(input.value);render()});wrap.append(title,input);root.append(wrap)});let total=current==='leader'?st.hours*st.rate*50:current==='systems'?st.cost*12:st.count*st.cost;const annual=(key)=>{const x=state[key];return key==='leader'?x.hours*x.rate*50:key==='systems'?x.cost*12:x.count*x.cost};
const cash=annual('ae')+annual('sdr')+annual('systems'),time=annual('leader');
document.getElementById('combinedInvestmentTotal').textContent=fmt(cash+time);
document.getElementById('combinedCash').textContent='Cash investment '+fmt(cash);
document.getElementById('combinedTime').textContent='Leadership time value '+fmt(time);
document.getElementById('investmentTotal').textContent=fmt(total);document.getElementById('investmentFormula').textContent=current==='leader'?'Hours × hourly value × 50 working weeks; opportunity cost, not cash expense.':current==='systems'?'Monthly subscriptions × 12; excludes implementation and internal adoption costs.':'Headcount × fully loaded annual cost; planning estimate, not a return forecast.';document.getElementById('investmentBreakdown').textContent=current==='leader'?`${st.hours} hours/week × ${fmt(st.rate)}/hour`:current==='systems'?`${fmt(st.cost)}/month in subscriptions`:`${st.count} role(s) × ${fmt(st.cost)}/year`;document.querySelectorAll('.invest-choice').forEach(b=>{const active=b.dataset.invest===current;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))})}document.querySelectorAll('.invest-choice').forEach(b=>b.addEventListener('click',()=>{current=b.dataset.invest;render()}));render()})();
/* SECTION 04 / QUESTIONNAIRE — Chris's existing questions and directional readout preserved */
(()=>{const story=document.getElementById('engineScrollStory'),stage=document.getElementById('engineStageScroll');if(story&&stage){let raf=false;const update=()=>{raf=false;const r=story.getBoundingClientRect(),range=Math.max(1,story.offsetHeight-innerHeight),p=Math.max(0,Math.min(1,-r.top/range));const warn=Math.max(0,Math.min(1,(p-.045)/.13))*Math.max(0,Math.min(1,(.49-p)/.12));stage.style.setProperty('--warn',warn.toFixed(3));stage.style.setProperty('--grey',Math.max(0,Math.min(1,(p-.08)/.16)).toFixed(3));stage.style.setProperty('--red',(Math.max(0,Math.min(.65,(p-.13)*4))*Math.max(0,Math.min(1,(.47-p)/.14))).toFixed(3))};addEventListener('scroll',()=>{if(!raf){raf=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',update);update()}
const questions=[['Do you have a clearly defined target customer—and evidence they buy for the reasons you expect?','Customer fit and buying conditions','market'],['Are sales conversations consistently turning into qualified opportunities with clear next steps?','Opportunity progression','process'],['Can your team advance important deals without routine executive intervention?','Team ownership and leadership','people'],['Do your CRM and GTM tools give you a reliable view of accounts, activity and outcomes?','Information and systems','systems'],['Can you connect commercial investment to pipeline quality, revenue and gross profit?','Commercial return and measurement','economics']];let index=0,answers=Array(5).fill(null);const form=document.getElementById('pulseForm'),result=document.getElementById('pulseResult');if(!form)return;function render(){form.hidden=false;result.hidden=true;document.getElementById('pulseCount').textContent=`QUESTION ${index+1} OF 5`;document.getElementById('pulseFill').style.width=((index+1)*20)+'%';document.getElementById('pulseQuestion').textContent=questions[index][0];document.getElementById('pulseHint').textContent='Choose the answer that best describes your current situation.';document.getElementById('pulseBack').disabled=index===0}function finish(){form.hidden=true;result.hidden=false;const gaps=answers.map((a,i)=>({a,i,score:a==='no'?2:a==='somewhat'?1:0})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);document.getElementById('pulseResultTitle').textContent=gaps.length?'There may be more than one growth constraint.':'You report a solid foundation. The next step is to verify it.';document.getElementById('pulseResultSummary').textContent=gaps.length?'Your responses suggest several areas worth examining before committing to more headcount, systems or executive time. These are hypotheses to test, not confirmed causes.':'Your answers indicate confidence across the five dimensions. A focused review can test whether reported conditions match performance data.';const el=document.getElementById('pulseSignals');el.innerHTML='';(gaps.length?gaps.slice(0,3):[{i:0,a:'yes'},{i:4,a:'yes'}]).forEach(({i,a})=>{let d=document.createElement('div');d.className='pulse-signal';const strong=document.createElement('strong');strong.textContent=questions[i][1];const small=document.createElement('span');small.textContent=a==='no'?'Priority to investigate':a==='somewhat'?'Partially established; worth validating':'Reported strength; verify with evidence';d.append(strong,small);el.append(d)})}document.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{answers[index]=b.dataset.answer;if(index===4)finish();else{index++;render()}}));document.getElementById('pulseBack').addEventListener('click',()=>{if(index>0){index--;render()}});function reset(){index=0;answers.fill(null);render()}document.getElementById('pulseRestart').addEventListener('click',reset);document.getElementById('pulseAgain').addEventListener('click',reset);render()})();

/* SECTION 05 — APPROVED SERVICES CARDS / CLICK-TO-FLIP ONLY
   Click or Enter/Space on card to turn; stays flipped until clicked again.
   Links on reverse face navigate without toggling the card. Escape returns. */
(function(){
  document.querySelectorAll('#services .velocity-flip-card').forEach(card=>{
    function setFlipped(flipped){
      card.classList.toggle('is-flipped',flipped);
      card.setAttribute('aria-expanded',String(flipped));
      const link=card.querySelector('.velocity-deep-link');
      if(link){link.tabIndex=flipped?0:-1;}
    }
    setFlipped(false);
    card.addEventListener('click',e=>{
      if(e.target.closest('a'))return;
      setFlipped(!card.classList.contains('is-flipped'));
    });
    card.addEventListener('keydown',e=>{
      if(e.target.closest('a'))return;
      if(e.key==='Enter'||e.key===' '){e.preventDefault();setFlipped(!card.classList.contains('is-flipped'));}
      else if(e.key==='Escape'&&card.classList.contains('is-flipped')){e.preventDefault();setFlipped(false);}
    });
  });
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


/* ============================================================================
   FOUNDATION 12 / SECTION 06B — KEEP IN TOUCH (PREVIEW ONLY)
   This static demonstration intentionally NEVER sends or stores form data.
   Connect a secure ESP signup API, bot protection, consent recordkeeping,
   and confirmed success/error responses before enabling subscriptions.
   ============================================================================ */
(()=>{
  const form=document.getElementById('keepSubscribeForm');
  if(!form)return;
  const status=document.getElementById('keepFormStatus');
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    if(status)status.textContent='This is a design preview. Your details have not been sent or saved. Subscription sign-up will become available when G2M Labs connects its email platform.';
  });
})();
