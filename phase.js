export function detectPhase(hist){
  if(hist.length < 6) return 'UNKNOWN';

  let alt = 0;
  for(let i=1;i<hist.length;i++){
    if(hist[i] !== hist[i-1]) alt++;
  }
  const altRate = alt / (hist.length-1);

  let s = 1;
  const last = hist[hist.length-1];
  for(let i=hist.length-2;i>=0;i--){
    if(hist[i]===last) s++;
    else break;
  }

  if(s >= 4 && altRate < 0.3) return 'TREND';
  if(altRate > 0.6) return 'NOISE';
  if(s >= 3 && altRate > 0.4) return 'TRANSITION';
  return 'UNKNOWN';
}
