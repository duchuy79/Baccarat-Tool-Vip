import { decisionEngine } from './engine.js';
import { history, add, undo } from './storage.js';

let lastPrediction = null;
let toolWin = 0;
let toolLose = 0;

function render(){
  const d = decisionEngine(history);

  // DECISION
  const decisionEl = document.getElementById('coreDecision');
  decisionEl.className =
    'core-decision ' +
    (d.action === 'WAIT' ? 'wait' : d.pred === 'B' ? 'banker' : 'player');

  decisionEl.textContent =
    d.action === 'WAIT' ? 'WAIT' : d.pred === 'B' ? 'BANKER' : 'PLAYER';

  if(d.action === 'PLAY'){
    lastPrediction = d.pred;
  }

  // TABLE RATE
  const total = history.length || 1;
  const countB = history.filter(x=>x==='B').length;
  const rateB = Math.round((countB / total) * 100);
  const rateP = 100 - rateB;

  document.getElementById('rateB').textContent = rateB + '%';
  document.getElementById('rateP').textContent = rateP + '%';
  document.getElementById('barB').style.width = rateB + '%';
  document.getElementById('barP').style.width = rateP + '%';

  // TOOL RATE
  const totalTool = toolWin + toolLose;
  const toolRate = totalTool === 0 ? 0 : Math.round((toolWin / totalTool) * 100);

  const toolBar = document.getElementById('toolBar');
  document.getElementById('toolRate').textContent = toolRate + '%';
  toolBar.style.width = toolRate + '%';
  toolBar.className = 'rate-fill tool';

  if(toolRate >= 55) toolBar.classList.add('good');
  else if(toolRate >= 50) toolBar.classList.add('mid');
  else toolBar.classList.add('bad');

  document.getElementById('history').textContent = history.join(' ');
}

// BUTTONS
document.getElementById('bB').onclick = ()=>{
  if(lastPrediction){
    lastPrediction === 'B' ? toolWin++ : toolLose++;
    lastPrediction = null;
  }
  add('B');
  render();
};

document.getElementById('bP').onclick = ()=>{
  if(lastPrediction){
    lastPrediction === 'P' ? toolWin++ : toolLose++;
    lastPrediction = null;
  }
  add('P');
  render();
};

document.getElementById('bU').onclick = ()=>{
  undo();
  render();
};

document.getElementById('bR').onclick = ()=>{
  history.length = 0;
  toolWin = 0;
  toolLose = 0;
  lastPrediction = null;
  render();
};

render();
