/*! @ryanmorr/isotope v3.0.0 | https://github.com/ryanmorr/isotope */
"use strict";
/*! @ryanmorr/define-store v1.0.0 | https://github.com/ryanmorr/define-store */function e(e){return(...t)=>{let r;const s=[],n=()=>r,u=e=>{if(!s.includes(e))return s.push(e),e(r),()=>{const t=s.indexOf(e);-1!==t&&s.splice(t,1)}},c=e(n,((...e)=>(r=e[0],s.slice().forEach((t=>t(...e))),r)),u,s)(...t);return c.subscribe||(c.subscribe=u),c.then=e=>e(n()),c.toString=()=>String(n()),c.toJSON=n,c.valueOf=n,c}}const t=e(((e,t)=>r=>{t(r);const s=r=>(t(r,e()),r);return{value:e,set:s,update:t=>s(t(e()))}})),r=e(((e,t)=>(...r)=>{let s=!1;const n=r.pop(),u=n.length>r.length,c=[],o=()=>u?n(...c):t(n(...c),e());return r.forEach(((e,t)=>e.subscribe((e=>{c[t]=e,s&&o()})))),u&&c.push((r=>t(r,e()))),s=!0,o(),{value:e}})),s=e(((e,t)=>(r,s)=>(t(r),{value:e,dispatch:r=>{const n=e();return t(s(n,r),n),e()}})));exports.derived=r,exports.reducer=s,exports.store=t;
