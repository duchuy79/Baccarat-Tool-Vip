function last(h){ return h[h.length-1]; }
function opp(x){ return x==='B'?'P':'B'; }

/* TREND */
export function trend(h){
  if(h.length<4) return null;
  let s=1;
  for(let i=h.length-2;i>=0;i--){
    if(h[i]===last(h)) s++; else break;
  }
  if(s>=3) return {method:'TREND',pred:last(h),conf:0.6+s*0.05};
}

/* ANTI TREND */
export function antiTrend(h){
  if(h.length<6) return null;
  let s=1;
  for(let i=h.length-2;i>=0;i--){
    if(h[i]===last(h)) s++; else break;
  }
  if(s>=5) return {method:'ANTI_TREND',pred:opp(last(h)),conf:0.6};
}

/* PATTERN */
export function pattern(h){
  if(h.length<8) return null;
  for(let l=2;l<=5;l++){
    const pat=h.slice(h.length-l).join('');
    let n={B:0,P:0};
    for(let i=0;i<h.length-l;i++){
      if(h.slice(i,i+l).join('')===pat){
        const r=h[i+l]; if(r) n[r]++;
      }
    }
    if(n.B+n.P>=2)
      return {method:'PATTERN',pred:n.B>n.P?'B':'P',conf:0.6};
  }
}

/* WINDOW */
export function windowVote(h){
  if(h.length<10) return null;
  const wins=[5,8,13];
  let v={B:0,P:0};
  wins.forEach(w=>{
    if(h.length>=w){
      const s=h.slice(h.length-w);
      const b=s.filter(x=>x==='B').length;
      v[b>s.length-b?'B':'P']++;
    }
  });
  if(v.B!==v.P)
    return {method:'WINDOW',pred:v.B>v.P?'B':'P',conf:0.6};
}

/* MIRROR */
export function mirror(h){
  if(h.length<6) return null;
  const a=h.slice(-3).join('');
  const b=h.slice(-6,-3).reverse().join('');
  if(a===b)
    return {method:'MIRROR',pred:opp(last(h)),conf:0.65};
}
