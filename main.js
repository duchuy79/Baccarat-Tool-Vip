import { decisionEngine } from './engine.js';
import { initHeat, heatMap } from './heatmap.js';

const history=[], toolLog=[];
let pending=null;

initHeat(
  ['TREND','ANTI_TREND','PATTERN','WINDOW','MIRROR'],
  ['TREND','TRANSITION','NOISE','UNKNOWN']
);

function bind(id,fn){
  const e=document.getElementById(id);
  e.addEventListener('click',fn);
  e.addEventListener('touchstart',ev=>{
    ev.preventDefault();fn();
  },{passive:false});
}

function render(){
  const d=decisionEngine(history,toolLog);
  const el=document.getElementById('decision');

  if(d.action==='WAIT'){
    el.className='core-decision wait';
    el.textContent=d.locked?'LOCK':'WAIT';
    pending=null;
  }else{
    el.className='core-decision '+(d.pred==='B'?'banker pulse':'player pulse');
    el.textContent=d.pred;
    pending=d;
  }

  const total=history.length||1;
  const b=history.filter(x=>x==='B').length;
  document.getElementById('rateB').textContent=Math.round(b/total*100)+'%';
  document.getElementById('rateP').textContent=100-Math.round(b/total*100)+'%';
  document.getElementById('barB').style.width=b/total*100+'%';
  document.getElementById('barP').style.width=(1-b/total)*100+'%';

  const wins=toolLog.filter(x=>x==='WIN').length;
  const tr=toolLog.length?Math.round(wins/toolLog.length*100):0;
  const tb=document.getElementById('toolBar');
  document.getElementById('toolRate').textContent=tr+'%';
  tb.style.width=tr+'%';
  tb.className=tr>=55?'good':tr>=50?'mid':'bad';

  const h=document.getElementById('history');
  h.innerHTML='';
  history.forEach(v=>{
    const d=document.createElement('div');
    d.className='his-item '+(v==='B'?'his-b':'his-p');
    d.textContent=v;
    h.appendChild(d);
  });
}

bind('btnB',()=>{
  if(pending){
    const r=pending.pred==='B'?'WIN':'LOSE';
    toolLog.push(r);
    const h=heatMap[pending.phase][pending.method];
    r==='WIN'?h.w++:h.l++;
  }
  history.push('B'); render();
});

bind('btnP',()=>{
  if(pending){
    const r=pending.pred==='P'?'WIN':'LOSE';
    toolLog.push(r);
    const h=heatMap[pending.phase][pending.method];
    r==='WIN'?h.w++:h.l++;
  }
  history.push('P'); render();
});

bind('btnU',()=>{history.pop();toolLog.pop();pending=null;render();});
bind('btnR',()=>{history.length=0;toolLog.length=0;pending=null;render();});

render();
