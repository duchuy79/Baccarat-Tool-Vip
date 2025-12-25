import { decisionEngine } from './engine.js';
import { initHeat, updateHeat } from './heatmap.js';
import { tick, reset } from './session.js';

const history = [];
let pending = null;
let toolLog = [];

initHeat(['TREND','ANTI-TREND','PATTERN','WINDOW']);

/* ========= MOBILE SAFE BIND ========= */
function bind(id, fn){
  const el = document.getElementById(id);
  if(!el) return;
  el.addEventListener('click', fn);
  el.addEventListener('touchstart', e=>{
    e.preventDefault();
    fn();
  }, { passive:false });
}

/* ========= RENDER ========= */
function render(){
  const d = decisionEngine(history);
  const el = document.getElementById('coreDecision');

  if(d.action === 'WAIT'){
    el.className = 'core-decision wait';
    el.textContent = 'WAIT';
  }else{
    el.className = 'core-decision ' + (d.pred === 'B' ? 'banker pulse' : 'player pulse');
    el.textContent = d.pred === 'B' ? 'BANKER' : 'PLAYER';
    pending = { pred:d.pred, method:d.method, phase:d.phase };
  }

  // Table rate
  const total = history.length || 1;
  const b = history.filter(x=>x==='B').length;
  const rb = Math.round(b / total * 100);

  document.getElementById('rateB').textContent = rb + '%';
  document.getElementById('rateP').textContent = (100 - rb) + '%';
  document.getElementById('barB').style.width = rb + '%';
  document.getElementById('barP').style.width = (100 - rb) + '%';

  // Tool rate
  const wins = toolLog.filter(x=>x.r === 'WIN').length;
  const tr = toolLog.length ? Math.round(wins / toolLog.length * 100) : 0;

  const tb = document.getElementById('toolBar');
  document.getElementById('toolRate').textContent = tr + '%';
  tb.style.width = tr + '%';
  tb.className =
    'rate-fill tool ' +
    (tr >= 55 ? 'good' : tr >= 50 ? 'mid' : 'bad');
}

/* ========= RESOLVE ========= */
function resolve(actual){
  if(!pending) return;
  const r = pending.pred === actual ? 'WIN' : 'LOSE';
  toolLog.push({ r, ...pending });
  updateHeat(pending.phase, pending.method, r);
  pending = null;
}

/* ========= BUTTONS ========= */
bind('bB', ()=>{
  resolve('B');
  history.push('B');
  tick();
  render();
});

bind('bP', ()=>{
  resolve('P');
  history.push('P');
  tick();
  render();
});

bind('bU', ()=>{
  history.pop();
  toolLog.pop();
  pending = null;
  render();
});

bind('bR', ()=>{
  history.length = 0;
  toolLog.length = 0;
  pending = null;
  reset();
  render();
});

render();
