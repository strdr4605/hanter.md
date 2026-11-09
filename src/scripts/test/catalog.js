import { CARS, GEN } from "./data.js";
import { $, S } from "./state.js";
// Catalog: modele, generații, tiparele furnizorului și consumul Hanter.md
// Catalog: modele + variante de tipar de la furnizor (s20 = fără praguri, s30 = cu praguri, s21 = portbagaj; [descriere, an de la, an până la])
// hv = consumul Hanter.md (m liniari) din vânzările 2021–2026: cu/fara salon, pres protecție, jos/spatar/full portbagaj, y = anii, n = nr. lucrări
export const brands = [...new Set(CARS.map(c=>c.b))].sort((a,b)=>a.localeCompare(b));
export const car = () => CARS.find(c=>c.b===S.brand && c.m===S.model);
export const hasCsj = c => (c.s20.length+c.s30.length+c.s21.length)>0;
// generațiile (intervale de ani) ale modelului, din toate tiparele furnizorului
// Generațiile reale (auto-data.net) pentru modelele unde tiparele se suprapun pe mai multe generații
export const PT = {ICE:"benzină / diesel",HEV:"hibrid",PHEV:"plug-in hibrid",BEV:"electric"};
export function gens(c){
  const RG = GEN[c.b+"|"+c.m];
  if(RG && hasCsj(c)){
    const all=[...c.s30,...c.s20,...c.s21];
    const G=RG.filter(([n,a,b,pt])=>all.some(x=>x[1] && fits(x,["",a,b,pt])) || c.hv.some(h=>h.y && Math.min(h.y[1],b)-Math.max(h.y[0],a)+1>=2)).map(([n,a,b,pt])=>[`${a}–${b} · ${n}`,a,b,pt]);
    if(all.some(x=>!x[1]) || !G.length) G.push(["Alt an / nu știu",0,0]);
    return G;
  }
  if(!hasCsj(c)) return c.hv.length ? c.hv.map(h=>[h.l||"Toți anii", h.y?h.y[0]:0, h.y?h.y[1]:0]) : [["Toți anii",0,0]];
  // grupează intervalele care se suprapun în generații
  const R=[...c.s30,...c.s20,...c.s21].filter(x=>x[1]).map(x=>[x[1],x[2]]).sort((p,q)=>p[0]-q[0]||p[1]-q[1]);
  const out=[];
  R.forEach(([a,b])=>{ const cur=out[out.length-1];
    if(cur){ const o=Math.min(b,cur[1])-Math.max(a,cur[0])+1; const single=(a===b||cur[0]===cur[1]);
      if(o>=2 || (single && a<=cur[1]+1)){ cur[1]=Math.max(cur[1],b); return; } }
    out.push([a,b]); });
  const G=out.map(([a,b])=>[a===b?String(a):a+"–"+b,a,b]);
  if([...c.s30,...c.s20,...c.s21].some(x=>!x[1]) || !G.length) G.push(["Alt an / nu știu",0,0]);
  return G;
}
export const curGen = c => { const g=gens(c); return g[S.g]||g[0]; };
export const fits = (x,g) => { if(!x[1] || !g[1]) return true; const o=Math.min(x[2],g[2])-Math.max(x[1],g[1])+1; if(g[3]) return o>=Math.min(3, x[2]-x[1]+1); return o>=2 || (o>=1 && (x[1]===x[2] || g[1]===g[2])); };
// Mașini „sora”: când lipsește un tipar, îl luăm de la modelul cu aceeași podea.
// [model, anii modelului (null = oricare), model sora, anii sorei (null = aceiași ani)]
export const SIBLINGS = [
  ["Mercedes-Benz|GLE Coupe", null, "Mercedes-Benz|GLE", null],
  ["Mercedes-Benz|ML", [2008,2011], "Mercedes-Benz|GLE", [2015,2019]],
  ["Mercedes-Benz|ML", [2012,2016], "Mercedes-Benz|GLE", [2015,2019]],
  ["Mercedes-Benz|GLE", [2015,2019], "Mercedes-Benz|ML", [2008,2016]]
];
export const pick = (c,type) => c.only==="full" ? (c.s30.length?c.s30:c.s20) : (type==="fara" ? c.s20 : type==="trunk" ? c.s21 : c.s30);
export function borrowed(c, type, g){
  const out=[];
  SIBLINGS.forEach(([k,ky,sk,sy])=>{
    if(k!==c.b+"|"+c.m) return;
    if(ky && g[1] && !fits([0,ky[0],ky[1]],g)) return;
    const s=CARS.find(x=>x.b+"|"+x.m===sk); if(!s) return;
    const sg = sy ? ["",sy[0],sy[1]] : g;
    pick(s,type).filter(x=>fits(x,sg)).forEach(x=>out.push([`${x[0]} (tipar ${s.m})`,x[1],x[2]]));
  });
  return out;
}
// tiparele furnizorului pentru generația aleasă (+ de la mașina sora, dacă lipsesc)
export function salonList(c, type){
  const g=curGen(c); type=type||S.salon;
  if(!hasCsj(c)) return [g];
  const own = pick(c,type).filter(x=>fits(x,g));
  if(own.length) return own;
  const br = borrowed(c,type,g); if(br.length) return br;
  return hvGen(c,g) && !(type==="fara" && c.only==="full") ? [[g[0]+" · tipar Hanter.md",g[1],g[2]]] : [];
}
export const trunkList = c => { const g=curGen(c); if(!hasCsj(c)) return [g]; const own=c.s21.filter(x=>fits(x,g)); if(own.length) return own; const br=borrowed(c,"trunk",g); return br.length ? br : (hvGen(c,g) && hvGen(c,g).full ? [[g[0]+" · tipar Hanter.md",g[1],g[2]]] : []); };
// Hanter.md a lucrat deja această generație (consum cunoscut), chiar dacă furnizorul nu are tipar
export function hvGen(c,g){ if(!g[3]) return null; return c.hv.find(h=>h.y && Math.min(h.y[1],g[2])-Math.max(h.y[0],g[1])+1>=2) || null; }
// alege consumul Hanter care se potrivește cu anii generației
export function pickHv(c, a, b){
  if(!c.hv.length) return null;
  if(!hasCsj(c)) return c.hv[S.g] || c.hv[0];
  let best=null, bo=0;
  if(a) c.hv.forEach(h=>{ if(!h.y) return; const o=Math.min(b,h.y[1])-Math.max(a,h.y[0])+1; if(o>bo){bo=o;best=h;} });
  return best || c.hv.find(h=>!h.y) || c.hv[c.hv.length-1];
}
export function variant(){
  const c=car(); const sl=salonList(c), tl=trunkList(c);
  const sv = S.salon!=="none" ? sl[S.sv] : null, tv = S.trunk!=="none" ? tl[S.tv] : null;
  const g=curGen(c);
  let h = pickHv(c, g[1], g[2]);
  // ajustări confirmate de Hanter.md pentru o variantă anume (ex. 7 locuri)
  (c.vm||[]).forEach(m=>{ if(h && sv && sv[0].includes(m.t)){ h={...h}; Object.entries(m.add||{}).forEach(([k,v])=>h[k]=Math.round((h[k]+v)*10)/10); Object.assign(h,m.set||{}); } });
  return {c, sv, tv, g, h};
}

export const YR=/^\d{4}(–\d{4})?$/;
export function fuelOpts(g){ if(!g || !g[3]) return []; const t=g[3].split(","); const o=[]; if(t.includes("ICE")) o.push("Benzină","Diesel"); if(t.includes("HEV")) o.push("Hibrid"); if(t.includes("PHEV")) o.push("Plug-in hibrid"); if(t.includes("BEV")) o.push("Electrică"); return o.length>2||t.length>1 ? o : []; }
export function vtags(t){
  const T=[], l=t.toLowerCase();
  if(/non-hibrid|benzină|7 locuri - benzină/.test(l)) T.push(["Benzină / diesel","f"]);
  else if(/hibrid|dm-i|dm-p|\bdm\b|em-i|phev|mild hybrid/.test(l)) T.push(["Hibrid","f"]);
  if(/range extender/.test(l)) T.push(["Range extender","f"]);
  if(/\bev\b|ev300|ev500|electric/.test(l)) T.push(["Electrică","f"]);
  if(/pedală accelerație din podea/.test(l)) T.push(["Pedală de jos (din podea)","p"]);
  if(/pedală accelerație suspendată/.test(l)) T.push(["Pedală de sus (suspendată)","p"]);
  if(/guri de aerisire/.test(l)) T.push(["Guri de aerisire","v"]);
  const seats=l.match(/(\d) locuri/); if(seats) T.push([seats[1]+" locuri","s"]);
  if(/cutie manuală/.test(l)) T.push(["Cutie manuală","g"]); if(/cutie automată/.test(l)) T.push(["Cutie automată","g"]);
  return T;
}
// varianta de tipar e pentru altă motorizare decât cea aleasă de client?
export function fuelClash(label){
  if(!S.fuel) return false; const T=vtags(label).filter(t=>t[1]==="f").map(t=>t[0]); if(!T.length) return false;
  const want = S.fuel==="Benzină"||S.fuel==="Diesel" ? "Benzină / diesel" : S.fuel==="Electrică" ? "Electrică" : "Hibrid";
  return !T.includes(want);
}
export const isSeven = V => /7 locuri/.test((V.sv&&V.sv[0])||"") || /7 locuri/.test((V.h&&V.h.l)||"");
