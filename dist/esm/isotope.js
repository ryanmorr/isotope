/*! @ryanmorr/isotope v2.0.0 | https://github.com/ryanmorr/isotope */
/*! @ryanmorr/define-store v1.0.0 | https://github.com/ryanmorr/define-store */
function t(t){return(...e)=>{let n;const r=[],s=()=>n,c=t=>{if(!r.includes(t))return r.push(t),t(n),()=>{const e=r.indexOf(t);-1!==e&&r.splice(e,1)}},u=t(s,((...t)=>(n=t[0],r.slice().forEach((e=>e(...t))),n)),c,r)(...e);return u.subscribe||(u.subscribe=c),u.then=t=>t(s()),u.toString=()=>String(s()),u.toJSON=s,u.valueOf=s,u}}const e=t(((t,e)=>n=>{e(n);const r=n=>(e(n,t()),n);return{value:t,set:r,update:e=>r(e(t()))}})),n=t(((t,e)=>(...n)=>{let r=!1;const s=n.pop(),c=[],u=()=>{const n=s(...c);n&&"function"==typeof n.then?n.then((n=>e(n,t()))):e(n,t())};return n.forEach(((t,e)=>t.subscribe((t=>{c[e]=t,r&&u()})))),r=!0,u(),{value:t}})),r=t(((t,e)=>(n,r)=>(e(n),{state:t,dispatch:n=>{const s=t();return e(r(s,n),s),t()}})));export{n as derived,r as reducer,e as store};
