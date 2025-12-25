function opposite(x){ return x==='B'?'P':'B'; }

function streak(h){
  let s=1;
  for(let i=h.length-2;i>=0;i--){
    if(h[i]===h.at(-1)) s++;
    else break;
  }
  return s;
}

export function trend(hist){
  const s=streak(hist);
  if(s>=3) return {name:'TREND',pred:hist.at(-1),conf:Math.min(.6+s*.05,.85)};
}

export function antiTrend(hist){
  const s=streak(hist);
  if(s>=5) return {name:'ANTI-TREND',pred:opposite(hist.at(-1)),conf:.55};
}

export function pattern(hist){
  if(hist.length<8) return;
  for(let l=2;l<=5;l++){
    const p=hist.slice(-l).join('');
    let m={B:0,P:0};
    for(let i=0;i<hist.length-l;i++)
      if(hist.slice(i,i+l).join('')===p) m[hist[i+l]]++;
    if(m.B+m.P>=2)
      return {name:'PATTERN',pred:m.B>m.P?'B':'P',conf:.6};
  }
}

export function windowVote(hist){
  if(hist.length<10) return;
  const wins=[5,8,13];
  let v={B:0,P:0};
  wins.forEach(w=>{
    if(hist.length>=w){
      const s=hist.slice(-w);
      const b=s.filter(x=>x==='B').length;
      v[b>s.length-b?'B':'P']++;
    }
  });
  if(v.B!==v.P) return {name:'WINDOW',pred:v.B>v.P?'B':'P',conf:.6};
}
