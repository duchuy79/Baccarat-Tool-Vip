import * as M from './methods.js';
import { detectPhase } from './phase.js';
import { heatBonus } from './heatmap.js';

export function decisionEngine(hist){
  const phase=detectPhase(hist);
  const list=[
    M.trend(hist),
    M.antiTrend(hist),
    M.pattern(hist),
    M.windowVote(hist)
  ].filter(Boolean);

  if(!list.length) return {action:'WAIT',phase};

  list.forEach(r=>r.conf*=heatBonus(phase,r.name));
  list.sort((a,b)=>b.conf-a.conf);
  const best=list[0];

  if(best.conf<.55) return {action:'WAIT',phase};
  return {action:'PLAY',pred:best.pred,method:best.name,phase};
}
