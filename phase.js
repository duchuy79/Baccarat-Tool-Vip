export function detectPhase(hist){
  if(hist.length<6) return 'UNKNOWN';
  let alt=0;
  for(let i=1;i<hist.length;i++) if(hist[i]!==hist[i-1]) alt++;
  const altRate=alt/(hist.length-1);

  let s=1;
  for(let i=hist.length-2;i>=0;i--){
    if(hist[i]===hist.at(-1)) s++;
    else break;
  }

  if(s>=4 && altRate<.3) return 'TREND';
  if(altRate>.6) return 'NOISE';
  if(s>=3 && altRate>.4) return 'TRANSITION';
  return 'UNKNOWN';
}
