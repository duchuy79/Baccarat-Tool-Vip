export const heatMap={};

export function initHeat(methods, phases){
  phases.forEach(p=>{
    heatMap[p]={};
    methods.forEach(m=>heatMap[p][m]={w:0,l:0});
  });
}

export function heatBonus(phase, method){
  const h=heatMap[phase][method];
  const t=h.w+h.l;
  if(t<5) return 1;
  const r=h.w/t;
  if(r>=0.6) return 1.1;
  if(r<0.45) return 0.8;
  return 1;
}
