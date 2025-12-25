export const heatMap={TREND:{},TRANSITION:{},NOISE:{},UNKNOWN:{}};

export function initHeat(methods){
  for(const p in heatMap)
    methods.forEach(m=>heatMap[p][m]={w:0,l:0});
}

export function updateHeat(p,m,r){
  if(!heatMap[p]?.[m])return;
  r==='WIN'?heatMap[p][m].w++:heatMap[p][m].l++;
}

export function heatBonus(p,m){
  const h=heatMap[p]?.[m]; if(!h) return 1;
  const t=h.w+h.l; if(t<5) return 1;
  const r=h.w/t;
  if(r>=.6) return 1.1;
  if(r<.45) return .8;
  return 1;
}
