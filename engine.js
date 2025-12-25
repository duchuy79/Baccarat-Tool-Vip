const MODE = 'NORMAL'; // SAFE | NORMAL | STRICT

export function decisionEngine(hist){
  if(hist.length < 6)
    return wait('UNKNOWN','Chưa đủ dữ liệu');

  if(isNoise(hist))
    return wait('NOISE','Cầu nhiễu – Checker chặn');

  const s = streak(hist);

  if(MODE === 'SAFE'){
    if(s>=3 && s<=5)
      return play('STABLE','TREND','SAFE – Trend đẹp', hist.at(-1));
    return wait('SAFE','SAFE MODE – chờ');
  }

  if(isStable(s)){
    if(s<=6)
      return play('STABLE','TREND','Cầu ổn định – bám Trend', hist.at(-1));
    return wait('STABLE','Chuỗi dài – tránh đuổi');
  }

  if(isTransition(hist,s)){
    if(confirmTransition(hist))
      return play('TRANSITION','MIRROR','Gãy cầu thật – bắt đảo', opposite(hist.at(-1)));
    return wait('TRANSITION','Gãy giả – chờ');
  }

  return wait('UNKNOWN','Không đủ điều kiện');
}

/* helpers */

function isNoise(h){
  let alt=0;
  for(let i=1;i<h.length;i++)
    if(h[i]!==h[i-1]) alt++;
  return alt/(h.length-1)>0.6;
}

function streak(h){
  let s=1;
  for(let i=h.length-2;i>=0;i--){
    if(h[i]===h.at(-1)) s++;
    else break;
  }
  return s;
}

function isStable(s){ return s>=3 }

function isTransition(h,s){
  return s>=3 && h.at(-1)!==h.at(-2);
}

function confirmTransition(h){
  let c=0;
  for(let i=2;i<h.length;i++){
    if(h[i]!==h[i-1] && h[i-1]===h[i-2]) c++;
  }
  return c>=2;
}

function opposite(x){ return x==='B'?'P':'B' }

function play(state,engine,reason,pred){
  return { action:'PLAY', state, engine, reason, pred };
}

function wait(state,reason){
  return { action:'WAIT', state, engine:'NONE', reason };
}
