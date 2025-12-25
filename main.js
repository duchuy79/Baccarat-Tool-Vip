function render(){
  const d = decisionEngine(history);

  // ===== DECISION =====
  const decisionEl = document.getElementById('coreDecision');
  decisionEl.className = 'core-decision ' +
    (d.action === 'WAIT' ? 'wait' : d.pred === 'B' ? 'banker' : 'player');

  decisionEl.textContent =
    d.action === 'WAIT' ? 'WAIT' : d.pred === 'B' ? 'BANKER' : 'PLAYER';

  // ===== TABLE RATE =====
  const total = history.length || 1;
  const countB = history.filter(x=>x==='B').length;
  const countP = history.filter(x=>x==='P').length;

  const rateB = Math.round((countB / total) * 100);
  const rateP = 100 - rateB;

  document.getElementById('rateB').textContent = rateB + '%';
  document.getElementById('rateP').textContent = rateP + '%';

  // ===== HISTORY =====
  document.getElementById('history').textContent = history.join(' ');
}
