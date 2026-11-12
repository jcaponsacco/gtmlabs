(() => {
'use strict';
const stage = document.getElementById('velocityStage');
const diagram = stage.querySelector('.velocity-diagram');
const viewport = stage.querySelector('.diagram-viewport');
const title = document.getElementById('guideTitle');
const copy = document.getElementById('guideCopy');
const kicker = document.getElementById('guideKicker');
const count = document.getElementById('guideCount');
const hint = document.getElementById('guideHint');
const back = document.getElementById('backButton');
const next = document.getElementById('nextButton');
const play = document.getElementById('playButton');
const replay = document.getElementById('replayButton');
const dots = [...document.querySelectorAll('#guideBar span')];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// An ordered pathway: each phase keeps its predecessors softly illuminated.
// Focus holds the explanation's visual target; trail shows accumulated context.
const phases = [
 {title:'Signals reveal what is happening',copy:'Market conditions, buyer behavior, pipeline movement and GTM systems provide the evidence that starts the next commercial decision.',focus:['sources','signalsFlow']},
 {title:'AI identifies patterns and alternatives',copy:'AI-supported analysis interprets the incoming signals, examines relationships, and raises alternative explanations for people to assess.',focus:['analysisGroup','analysisFlow']},
 {title:'The core retains reasoning and context',copy:'The commercial intelligence core holds the findings, past decisions, their rationale, and the knowledge the business has already developed.',focus:['engineGroup']},
 {title:'Leadership turns intelligence into priorities',copy:'Experienced commercial leaders challenge assumptions, set objectives, weigh alternatives and take responsibility for the decision.',focus:['humanGroup','decisionFlow','decisionGroup']},
 {title:'The decision becomes coordinated action',copy:'The chosen priority moves through the people and GTM systems accountable for executing the work.',focus:['executionFlow','executionGroup']},
 {title:'Results return as stronger intelligence',copy:'Outcomes travel back through AI-supported analysis (green), then interpreted learning strengthens the intelligence core (purple).',focus:['resultsGroup','resultsFlow','analysisGroup','learningFlow','engineGroup'],feedback:true},
 {title:'Cycle 1 — Establish direction',copy:'An initial round of evidence, interpretation and human judgment produces an accountable commercial action.',focus:['humanGroup','decisionFlow','decisionGroup','executionFlow','executionGroup'],cycle:1},
 {title:'Cycle 2 — Build understanding',copy:'Results flow back into analysis and the core. Earlier decisions and outcomes now provide more context for the next choice.',focus:['resultsGroup','resultsFlow','analysisGroup','learningFlow','engineGroup'],cycle:2,feedback:true},
 {title:'Cycle 3 — Accelerate response',copy:'The accumulated context supports clearer decisions and a more coordinated response. The increasing pace is illustrative, not a performance promise.',focus:['engineGroup','humanGroup','decisionFlow','decisionGroup','executionFlow','executionGroup'],cycle:3}
];
const visualIds=['sources','signalsFlow','analysisGroup','analysisFlow','engineGroup','humanGroup','decisionFlow','decisionGroup','executionFlow','executionGroup','resultsGroup','resultsFlow','learningFlow'];
const elements = new Map(visualIds.map(id => [id,document.getElementById(id)]));
let index=0,playing=false,timer=null,started=false;
const clearTimer=()=>{if(timer!==null)clearTimeout(timer);timer=null};
function updatePlay(){play.textContent=playing?'Pause':'Play';play.setAttribute('aria-label',playing?'Pause walkthrough':'Play walkthrough');stage.classList.toggle('reduced',reduced || !playing)}
function stop(){playing=false;clearTimer();updatePlay()}
function start(){if(reduced)return;playing=true;updatePlay();schedule()}
function schedule(){clearTimer();if(!playing)return;timer=setTimeout(()=>{if(index<phases.length-1){index++;render();schedule()}else stop()},index<6?4000:4900)}
function scrollIntoFocus(){if(viewport.scrollWidth<=viewport.clientWidth+20)return;
 const targets=['sources','analysisGroup','engineGroup','humanGroup','executionGroup','resultsGroup','humanGroup','resultsGroup','engineGroup'];
 const el=elements.get(targets[index]);if(!el)return;
 const bounds=el.getBBox(),vb=diagram.viewBox.baseVal;
 const scale=diagram.getBoundingClientRect().width/vb.width;
 const center=(bounds.x+bounds.width/2-vb.x)*scale;
 viewport.scrollTo({left:Math.max(0,center-viewport.clientWidth/2),behavior:reduced?'auto':'smooth'});
}
function render(){
 const phase=phases[index];
 title.textContent=phase.title;copy.textContent=phase.copy;
 kicker.textContent=index<6?`GUIDED WALKTHROUGH · STEP ${String(index+1).padStart(2,'0')} OF 06`:'THE LEARNING LOOP';
 count.textContent=`${String(index+1).padStart(2,'0')} / 09`;
 hint.textContent=index<6?'Select Back or Next to explore at your own pace. Manual navigation pauses autoplay.':'Each cycle adds context. Select Replay to see how the intelligence is built.';
 stage.dataset.cycle=String(phase.cycle||0);
 const visited=new Set();
 for(let i=0;i<index;i++)for(const id of phases[i].focus)visited.add(id);
 // During three macro cycles, preserve accumulated context while prioritizing
 // the current business action or feedback flow.
 if(index>=6)for(const id of visualIds)visited.add(id);
 for(const [id,el] of elements){
  if(!el)continue;
  const active=phase.focus.includes(id);
  el.classList.toggle('active',active);
  el.classList.toggle('visited',!active && visited.has(id));
 }
 // Human judgment stays legible while returning to quiet state outside its focus.
 dots.forEach((dot,n)=>{dot.classList.toggle('done',n<index);dot.classList.toggle('current',n===index)});
 back.disabled=index===0;next.disabled=index===phases.length-1;
 scrollIntoFocus();
}
function move(delta){stop();index=Math.min(phases.length-1,Math.max(0,index+delta));render()}
back.addEventListener('click',()=>move(-1));
next.addEventListener('click',()=>move(1));
play.addEventListener('click',()=>{if(playing){stop();return}if(index===phases.length-1){index=0;render()}start()});
replay.addEventListener('click',()=>{stop();index=0;render();start()});
render();updatePlay();
function beginWhenVisible(){if(started||reduced)return;started=true;start();}
if(window.parent!==window){
 window.addEventListener('message',event=>{if(event.data==='g2m-velocity-visible')beginWhenVisible()});
}else if(!reduced && 'IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){
 observer.disconnect();beginWhenVisible();
 }},{threshold:.28});observer.observe(stage);
}else if(!reduced)beginWhenVisible();
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
})();

(()=>{let last=0;function report(){const height=Math.ceil(Math.max(document.documentElement.scrollHeight,document.body.scrollHeight));if(height!==last){last=height;window.parent.postMessage({type:'g2m-velocity-height',height},'*')}};addEventListener('load',report);addEventListener('resize',report);if('ResizeObserver' in window){new ResizeObserver(report).observe(document.body)};report()})();
