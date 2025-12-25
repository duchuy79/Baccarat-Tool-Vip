export function decisionEngine(hist){
  if(hist.length < 6)
    return { action:'WAIT' };

  if(isNoise(hist))
    return { action:'WAIT' };

  const s = streak(hist);

  if(s>=3 && s<=6)
    return { action:'PLAY', pred: hist.at(-1) };

  return { action:'WAIT' };
}

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
