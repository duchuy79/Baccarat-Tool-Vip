import { decisionEngine } from './engine.js';
import { history, add, undo } from './storage.js';

const decisionLog=[];

function render(){
  const d = decisionEngine(history);

  const core = document.getElementById('core');
  core.innerHTML = `
    <div class="label">DECISION</div>
    <div class="decision ${d.action==='WAIT'?'wait':d.pred==='B'?'banker':'player'}">
      ${d.action==='WAIT'?'WAIT':d.pred==='B'?'BANKER':'PLAYER'}
    </div>
    <div class="label">STATE</div>
    <div>${d.state}</div>
    <div class="label">ENGINE</div>
    <div>${d.engine}</div>
  `;

  decisionLog.push(`${d.action} | ${d.state} | ${d.engine}`);
  if(decisionLog.length>10) decisionLog.shift();

  document.getElementById('status').textContent =
    d.reason + '\n\nLAST DECISIONS:\n' + decisionLog.join('\n');

  document.getElementById('history').textContent =
    history.join(' ');
}

document.getElementById('bB').onclick=()=>{ add('B'); render(); };
document.getElementById('bP').onclick=()=>{ add('P'); render(); };
document.getElementById('bU').onclick=()=>{ undo(); render(); };

render();
