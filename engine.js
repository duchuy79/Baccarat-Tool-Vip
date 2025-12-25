import * as M from './methods.js';
import { detectPhase } from './phase.js';
import { heatBonus } from './heatmap.js';

export function decisionEngine(history, toolLog){
  const phase=detectPhase(history);

  if(toolLog.length>=6){
    const w=toolLog.filter(x=>x==='WIN').length;
    if(w/toolLog.length<0.45)
      return {action:'WAIT',locked:true};
  }

  let list=[
    M.trend(history),
    M.antiTrend(history),
    M.pattern(history),
    M.windowVote(history),
    M.mirror(history)
  ].filter(Boolean);

  if(!list.length) return {action:'WAIT'};

  list.forEach(r=>r.conf*=heatBonus(phase,r.method));
  list.sort((a,b)=>b.conf-a.conf);

  if(list[0].conf<0.55) return {action:'WAIT'};

  return {action:'PLAY',...list[0],phase};
}
