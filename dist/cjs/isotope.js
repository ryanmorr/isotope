/*! @ryanmorr/isotope v3.2.1 | https://github.com/ryanmorr/isotope */
"use strict";class e{#e;#s=[];constructor(e){this.#e=e,this.#s=[]}value(){return this.#e}set(e){const s=this.value();if(e!==s)return this.#e=e,this.#s.slice().forEach((t=>t(e,s))),e}subscribe(e){const s=this.#s;if(!s.includes(e))return s.push(e),e(this.value()),()=>{const t=s.indexOf(e);-1!==t&&s.splice(t,1)}}then(e){e(this.value())}toString(){return String(this.value())}valueOf(){return this.value()}toJSON(){return this.value()}}class s extends e{update(e){return this.set(e(this.value()))}}class t extends e{#t;constructor(e,s){super(e),this.#t=s}dispatch(e){return super.set(this.#t(this.value(),e))}}class r extends e{constructor(e,s,t){super();let r=!1;const u=[],c=t?()=>super.set(s(u)):()=>super.set(s(...u));e.forEach(((e,s)=>e.subscribe((e=>{u[s]=e,r&&c()})))),r=!0,c()}}class u extends e{constructor(e,s,t){super();let r=0,u=!1;const c=[],n=t?e=>s(c,e):e=>s(...c.concat([e]));e.forEach(((e,s)=>e.subscribe((e=>{if(c[s]=e,u){r++;const e=r;n((s=>{r===e&&super.set(s)}))}})))),u=!0,n((e=>super.set(e)))}}r.prototype.set=void 0,u.prototype.set=void 0,t.prototype.set=void 0,exports.Store=e,exports.derived=function(...e){let s,t;const c=Array.isArray(e[0]);c?(s=e[0],t=e[1]):(s=e,t=e.pop());const n=t.length;return c&&2===n||n>s.length?new u(s,t,c):new r(s,t,c)},exports.reducer=function(e,s){return new t(e,s)},exports.store=function(e){return new s(e)};
