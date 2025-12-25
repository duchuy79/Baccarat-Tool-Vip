import { decisionEngine } from './engine.js';
import { history, add, undo } from './storage.js';

const log=[];

function render(){
  const d = decisionEngine(history);

  document.getElementById('core').innerHTML = `
    <div class="label">DECISION</div>
    <div class="decision ${d.action==='WAIT'?'wait':d.pred==='B'?'banker':'player'}">
      ${d.action==='WAIT'?'WAIT':d.pred==='B'?'BANKER':'PLAYER'}
    </div>
    <div class="label">STATE</div>
    <div>${d.state}</div>
    <div class="label">ENGINE</div>
    <div>${d.engine}</div>
  `;

  log.push(`${d.action} | ${d.state} | ${d.engine}`);
  if(log.length>10) log.shift();

  document.getElementById('status').textContent =
    d.reason + '\n\nLAST DECISIONS:\n' + log.join('\n');

  document.getElementById('history').textContent =
    history.join(' ');
}

document.getElementById('bB').onclick=()=>{ add('B'); render(); };
document.getElementById('bP').onclick=()=>{ add('P'); render(); };
document.getElementById('bU').onclick=()=>{ undo(); render(); };

render();
