function last(hist){
  return hist[hist.length - 1];
}

function opposite(x){
  return x === 'B' ? 'P' : 'B';
}

function streak(hist){
  let s = 1;
  const l = last(hist);
  for(let i = hist.length - 2; i >= 0; i--){
    if(hist[i] === l) s++;
    else break;
  }
  return s;
}

export function trend(hist){
  if(hist.length < 4) return;
  const s = streak(hist);
  if(s >= 3){
    return {
      name:'TREND',
      pred: last(hist),
      conf: Math.min(0.6 + s * 0.05, 0.85)
    };
  }
}

export function antiTrend(hist){
  if(hist.length < 6) return;
  const s = streak(hist);
  if(s >= 5){
    return {
      name:'ANTI-TREND',
      pred: opposite(last(hist)),
      conf: 0.55
    };
  }
}

export function pattern(hist){
  if(hist.length < 8) return;
  for(let l = 2; l <= 5; l++){
    const pat = hist.slice(hist.length - l).join('');
    let next = { B:0, P:0 };

    for(let i = 0; i <= hist.length - l - 1; i++){
      if(hist.slice(i, i + l).join('') === pat){
        const n = hist[i + l];
        if(n) next[n]++;
      }
    }

    if(next.B + next.P >= 2){
      return {
        name:'PATTERN',
        pred: next.B > next.P ? 'B' : 'P',
        conf: 0.6
      };
    }
  }
}

export function windowVote(hist){
  if(hist.length < 10) return;
  const wins = [5,8,13];
  let vote = { B:0, P:0 };

  wins.forEach(w=>{
    if(hist.length >= w){
      const s = hist.slice(hist.length - w);
      const b = s.filter(x=>x==='B').length;
      vote[b > s.length - b ? 'B' : 'P']++;
    }
  });

  if(vote.B !== vote.P){
    return {
      name:'WINDOW',
      pred: vote.B > vote.P ? 'B' : 'P',
      conf: 0.6
    };
  }
}
