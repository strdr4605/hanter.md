import { TEX } from "./data.js";
import { $ } from "./state.js";
// Desenul covorașului (SVG), mostrele de material și texturile
export function matSVG(l, praguri, uid){
  const lc=l.lc, tc=l.tc, gloss=l.finish==="lucios";
  const pat = l.tex ? "" : l.pattern==="paralel"
    ? `<pattern id="p${uid}" width="26" height="14" patternUnits="userSpaceOnUse" patternTransform="skewX(-35)"><rect width="26" height="14" fill="${lc}"/><path d="M0 1H26M0 4H26M1 0V14M4 0V14" stroke="${tc}" stroke-width="1" stroke-dasharray="3 2"/></pattern>`
    : l.pattern==="romb"
    ? `<pattern id="p${uid}" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="22" height="22" fill="${lc}"/><path d="M0 0H22M0 0V22" stroke="${tc}" stroke-width="1.3" stroke-dasharray="3 2"/></pattern>`
    : `<pattern id="p${uid}" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="${lc}"/><path d="M0 1H22M0 4H22M1 0V22M4 0V22" stroke="${tc}" stroke-width="1" stroke-dasharray="3 2"/></pattern>`;
  const fill = l.tex ? `url(#tx-${l.tex})` : `url(#p${uid})`;
  const flt = gloss ? ` filter="url(#glossf)"` : "";
  const lip = praguri ? `<path d="M20 30 L20 200 L36 210 L36 40 Z" fill="${fill}"${flt} opacity=".9"/><path d="M340 30 L340 200 L324 210 L324 40 Z" fill="${fill}"${flt} opacity=".9"/>` : "";
  const mat = (d,i) => `<path d="${d}" fill="${fill}"${flt}/>${gloss?`<path d="${d}" fill="url(#glossg)"/>`:""}<path d="${d}" fill="none" stroke="${l.tex?"#1b1a19":tc}" stroke-width="5"/>${i}`;
  return `<defs>${pat}</defs>${lip}
  ${mat("M40 30 Q40 20 52 20 H160 Q172 20 172 34 V188 Q172 210 150 210 H62 Q40 210 40 188 Z",`<path d="M48 34 Q48 28 56 28 H158 Q164 28 164 36 V186 Q164 202 148 202 H64 Q48 202 48 186 Z" fill="none" stroke="${tc}" stroke-width="1.4" stroke-dasharray="4 3"/><rect x="78" y="120" width="56" height="64" rx="8" fill="#0000001f" stroke="${tc}" stroke-width="1.2" stroke-dasharray="3 2"/>`)}
  ${mat("M188 34 Q188 20 202 20 H308 Q320 20 320 30 V188 Q320 210 298 210 H210 Q188 210 188 188 Z",`<path d="M196 36 Q196 28 204 28 H306 Q312 28 312 34 V186 Q312 202 296 202 H212 Q196 202 196 186 Z" fill="none" stroke="${tc}" stroke-width="1.4" stroke-dasharray="4 3"/>`)}`;
}
export function thumb(it){
  return it.tex ? `<i class="thumb tx-${it.tex}${it.finish==="lucios"?" gl":""}" aria-hidden="true"></i>`
    : `<svg viewBox="40 20 132 90" aria-hidden="true">${matSVG(it,false,"s"+it.id)}</svg>`;
}
export function initTextures(){
  const st=document.createElement("style");
  st.textContent=Object.entries(TEX).map(([k,v])=>`.tx-${k}{background-image:url(${v});--tx:url(${v})}`).join("\n");
  document.head.appendChild(st);
  const NS="http://www.w3.org/2000/svg", svg=document.createElementNS(NS,"svg");
  svg.setAttribute("width","0"); svg.setAttribute("height","0"); svg.setAttribute("aria-hidden","true");
  svg.style.position="absolute";
  svg.innerHTML=`<defs>${Object.entries(TEX).map(([k,v])=>`<pattern id="tx-${k}" width="180" height="230" patternUnits="userSpaceOnUse"><image href="${v}" width="180" height="230" preserveAspectRatio="xMidYMid slice"/></pattern>`).join("")}
  <linearGradient id="glossg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset=".3" stop-color="#fff" stop-opacity=".06"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset=".75" stop-color="#fff" stop-opacity=".22"/><stop offset=".85" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <filter id="glossf"><feComponentTransfer><feFuncR type="linear" slope="1.18" intercept="-.02"/><feFuncG type="linear" slope="1.18" intercept="-.02"/><feFuncB type="linear" slope="1.18" intercept="-.02"/></feComponentTransfer></filter></defs>`;
  document.body.appendChild(svg);
}
export const leatherSw = l => `<i class="swc${l.tex?" tx-"+l.tex:""}${l.finish==="lucios"?" gl":""}" style="background-color:${l.lc||"#222"}" title="${l.name}"></i>`;
export const protSw = c => c ? `<i class="swc" style="background:${c[1]}" title="${c[0]}"></i>` : "";
