export const history=[];

export function add(x){ history.push(x); }
export function undo(){ history.pop(); }
