import { decisionEngine } from './engine.js';
import { initHeat, updateHeat } from './heatmap.js';
import { tick, reset } from './session.js';

const history=[];
let pending=null;
let toolLog=[];

initHeat(['TREND','ANTI-TREND','PATTERN','WINDOW']);

function render(){
  const d=decisionEngine(history);
  const el=document.getElementById('coreDecision');
  el.className='core-decision '+(d.action==='WAIT'?'wait':d.pred==='B'?'banker pulse':'player pulse');
  el.textContent=d.action==='WAIT'?'WAIT':d.pred==='B'?'BANKER':'PLAYER';

  if(d.action==='PLAY') pending={pred:d.pred,method:d.method,phase:d.phase};

  const total=history.length||1;
  const b=history.filter(x=>x==='B').length;
  const rb=Math.round(b/total*100);
  document.getElementById('rateB').textContent=rb+'%';
  document.getElementById('rateP').textContent=(100-rb)+'%';
  document.getElementById('barB').style.width=rb+'%';
  document.getElementById('barP').style.width=(100-rb)+'%';

  const wins=toolLog.filter(x=>x.r==='WIN').length;
  const tr=toolLog.length?Math.round(wins/toolLog.length*100):0;
  const tb=document.getElementById('toolBar');
  document.getElementById('toolRate').textContent=tr+'%';
  tb.style.width=tr+'%';
  tb.className='rate-fill tool '+(tr>=55?'good':tr>=50?'mid':'bad');
}

function resolve(a){
  if(!pending) return;
  const r=pending.pred===a?'WIN':'LOSE';
  toolLog.push({r,...pending});
  updateHeat(pending.phase,pending.method,r);
  pending=null;
}

bB.onclick=()=>{resolve('B');history.push('B');tick();render();}
bP.onclick=()=>{resolve('P');history.push('P');tick();render();}
bU.onclick=()=>{history.pop();toolLog.pop();pending=null;render();}
bR.onclick=()=>{history.length=0;toolLog.length=0;pending=null;reset();render();}

render();
