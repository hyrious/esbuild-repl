import{$ as R,A as w,Aa as Ke,B as D,Ba as Yt,C as S,D as pe,E as H,G as p,H as k,I as E,J as U,K as I,M as Oe,N as se,O as me,P as at,Q as je,S as qe,T as ct,U as $e,V as Me,W as Ae,X as ze,Y as Fe,Z as he,_ as de,a as rt,aa as $,b as Ut,ba as zt,c as ye,ca as ut,d as Ht,da as Ft,e as Wt,ea as Qt,f as Jt,fa as Qe,g as te,ga as F,h as Ve,ha as Y,i as Te,ia as Q,j as Vt,ja as X,k as ue,ka as J,l as nt,la as V,m as re,ma as ft,n as _e,na as we,o as W,oa as Se,p as L,pa as Ie,q as ot,qa as le,r as it,ra as Re,s as st,sa as Ne,t as lt,ta as x,u as fe,ua as Xe,v as ie,va as Be,w as b,wa as Xt,x as M,xa as Kt,y as f,ya as Z,z as Le,za as Pe}from"./chunk-HKFWW6J4.js";import{a as tt,b as Ar}from"./chunk-ON5OQYWL.js";var xt=tt((Wn,Zt)=>{function ee(r,e){typeof e=="boolean"&&(e={forever:e}),this._originalTimeouts=JSON.parse(JSON.stringify(r)),this._timeouts=r,this._options=e||{},this._maxRetryTime=e&&e.maxRetryTime||1/0,this._fn=null,this._errors=[],this._attempts=1,this._operationTimeout=null,this._operationTimeoutCb=null,this._timeout=null,this._operationStart=null,this._timer=null,this._options.forever&&(this._cachedTimeouts=this._timeouts.slice(0))}Zt.exports=ee;ee.prototype.reset=function(){this._attempts=1,this._timeouts=this._originalTimeouts.slice(0)};ee.prototype.stop=function(){this._timeout&&clearTimeout(this._timeout),this._timer&&clearTimeout(this._timer),this._timeouts=[],this._cachedTimeouts=null};ee.prototype.retry=function(r){if(this._timeout&&clearTimeout(this._timeout),!r)return!1;var e=new Date().getTime();if(r&&e-this._operationStart>=this._maxRetryTime)return this._errors.push(r),this._errors.unshift(new Error("RetryOperation timeout occurred")),!1;this._errors.push(r);var t=this._timeouts.shift();if(t===void 0)if(this._cachedTimeouts)this._errors.splice(0,this._errors.length-1),t=this._cachedTimeouts.slice(-1);else return!1;var n=this;return this._timer=setTimeout(function(){n._attempts++,n._operationTimeoutCb&&(n._timeout=setTimeout(function(){n._operationTimeoutCb(n._attempts)},n._operationTimeout),n._options.unref&&n._timeout.unref()),n._fn(n._attempts)},t),this._options.unref&&this._timer.unref(),!0};ee.prototype.attempt=function(r,e){this._fn=r,e&&(e.timeout&&(this._operationTimeout=e.timeout),e.cb&&(this._operationTimeoutCb=e.cb));var t=this;this._operationTimeoutCb&&(this._timeout=setTimeout(function(){t._operationTimeoutCb()},t._operationTimeout)),this._operationStart=new Date().getTime(),this._fn(this._attempts)};ee.prototype.try=function(r){console.log("Using RetryOperation.try() is deprecated"),this.attempt(r)};ee.prototype.start=function(r){console.log("Using RetryOperation.start() is deprecated"),this.attempt(r)};ee.prototype.start=ee.prototype.try;ee.prototype.errors=function(){return this._errors};ee.prototype.attempts=function(){return this._attempts};ee.prototype.mainError=function(){if(this._errors.length===0)return null;for(var r={},e=null,t=0,n=0;n<this._errors.length;n++){var o=this._errors[n],i=o.message,s=(r[i]||0)+1;r[i]=s,s>=t&&(e=o,t=s)}return e}});var Gt=tt(Ee=>{var Br=xt();Ee.operation=function(r){var e=Ee.timeouts(r);return new Br(e,{forever:r&&(r.forever||r.retries===1/0),unref:r&&r.unref,maxRetryTime:r&&r.maxRetryTime})};Ee.timeouts=function(r){if(r instanceof Array)return[].concat(r);var e={retries:10,factor:2,minTimeout:1*1e3,maxTimeout:1/0,randomize:!1};for(var t in r)e[t]=r[t];if(e.minTimeout>e.maxTimeout)throw new Error("minTimeout is greater than maxTimeout");for(var n=[],o=0;o<e.retries;o++)n.push(this.createTimeout(o,e));return r&&r.forever&&!n.length&&n.push(this.createTimeout(o,e)),n.sort(function(i,s){return i-s}),n};Ee.createTimeout=function(r,e){var t=e.randomize?Math.random()+1:1,n=Math.round(t*Math.max(e.minTimeout,1)*Math.pow(e.factor,r));return n=Math.min(n,e.maxTimeout),n};Ee.wrap=function(r,e,t){if(e instanceof Array&&(t=e,e=null),!t){t=[];for(var n in r)typeof r[n]=="function"&&t.push(n)}for(var o=0;o<t.length;o++){var i=t[o],s=r[i];r[i]=function(a){var c=Ee.operation(e),u=Array.prototype.slice.call(arguments,1),m=u.pop();u.push(function(y){c.retry(y)||(y&&(arguments[0]=c.mainError()),m.apply(this,arguments))}),c.attempt(function(){a.apply(r,u)})}.bind(r,s),r[i].options=e}}});var tr=tt((Vn,er)=>{er.exports=Gt()});var nr=Ar(tr(),1),Dr=new Set(["Failed to fetch","NetworkError when attempting to fetch resource.","The Internet connection appears to be offline.","Network request failed"]),pt=class extends Error{constructor(e){super(),e instanceof Error?(this.originalError=e,{message:e}=e):(this.originalError=new Error(e),this.originalError.stack=this.stack),this.name="AbortError",this.message=e}},Ur=(r,e,t)=>{let n=t.retries-(e-1);return r.attemptNumber=e,r.retriesLeft=n,r},Hr=r=>Dr.has(r),rr=r=>globalThis.DOMException===void 0?new Error(r):new DOMException(r);async function Ye(r,e){return new Promise((t,n)=>{e={onFailedAttempt(){},retries:10,...e};let o=nr.default.operation(e);o.attempt(async i=>{try{t(await r(i))}catch(s){if(!(s instanceof Error)){n(new TypeError(`Non-error was thrown: "${s}". You should only throw errors.`));return}if(s instanceof pt)o.stop(),n(s.originalError);else if(s instanceof TypeError&&!Hr(s.message))o.stop(),n(s);else{Ur(s,i,e);try{await e.onFailedAttempt(s)}catch(l){n(l);return}o.retry(s)||n(o.mainError())}}}),e.signal&&!e.signal.aborted&&e.signal.addEventListener("abort",()=>{o.stop();let i=e.signal.reason===void 0?rr("The operation was aborted."):e.signal.reason;n(i instanceof Error?i:rr(i))},{once:!0})})}var mt=["https://cdn.jsdelivr.net/npm","https://unpkg.com"],Wr=(r,e)=>`${mt[r]}/esbuild-wasm@${e}/lib/browser.min.js`,Jr=(r,e)=>`${mt[r]}/esbuild-wasm@${e}/esbuild.wasm`;async function Vr(){let r=Te().version||"latest";console.log("loading esbuild @",r);let e={initialize:ye,build:ye,formatMessages:ye,transform:ye,version:"none"};if(!te){Ne.set(e);return}for(let t=0;t<mt.length;++t)try{let n=Wr(t,r);le.set("Fetching "+n),await Ye(()=>or(zr(n,()=>Ht(window.esbuild))),{retries:3}),e=window.esbuild,Re.set(e.version),Be.update(i=>i.includes(e.version)?i:[...i,e.version]);let o=Jr(t,e.version);le.set("Downloading "+o),await Ye(()=>or(e.initialize({wasmURL:o})),{retries:3}),await e.transform("let a = 1");break}catch{continue}if(e.version==="none")throw new Error("Error: failed to load esbuild-wasm, try refresh the page.");Ne.set(e),console.log("loaded esbuild @",e.version)}async function or(r){try{return await r}catch(e){throw le.set(String(e)),console.error(e),e}}function zr(r,e){return new Promise((t,n)=>{let o=document.createElement("script");o.onload=async()=>{e()&&t();for(let i=0;i<10;++i)await Wt(100),e()&&t();n(new Error(`Failed to import ${r}.`))},o.onerror=()=>{o.remove(),n()},o.src=r,document.head.append(o)})}var Fr="https://data.jsdelivr.com/v1/package/npm/esbuild-wasm";async function Qr(){let{versions:r}=await fetch(Fr).then(e=>e.json());Be.set(r)}Qr().catch(console.error);(async()=>{try{await Vr(),le.set("Ready."),Ie.set(!1)}catch(r){le.set(String(r)),console.error(r)}})();navigator.serviceWorker?.register("./sw.js").then(r=>console.log("registered sw.js in scope:",r.scope)).catch(r=>console.log("failed to register sw.js:",r));var ht=te&&window.matchMedia?matchMedia("(prefers-color-scheme: dark)"):null;if(ht){let r=()=>Se.set(ht.matches?"dark":"light");ht.addEventListener("change",r),r()}Se.subscribe(r=>{te&&(document.body.dataset.theme=r)});import("./editor-T46RCK72.js");var dt=[["bundle",1],["preserve-symlinks",1],["splitting",1],["allow-overwrite",1],["watch",1],["minify",1],["minify-syntax",1],["minify-whitespace",1],["minify-identifiers",1],["mangle-quoted",1],["mangle-props",7],["reserve-props",7],["mangle-cache",2],["drop",4],["legal-comments",2],["charset",2],["tree-shaking",1],["ignore-annotations",1],["keep-names",1],["sourcemap",0],["sourcemap",2],["source-root",2],["sources-content",1],["sourcefile",2],["resolve-extensions",3],["main-fields",3],["conditions",3],["public-path",2],["global-name",2],["metafile",0],["metafile",2],["outfile",2],["outdir",2],["outbase",2],["tsconfig",2],["tsconfig-raw",2],["entry-names",2],["chunk-names",2],["asset-names",2],["define",5],["pure",4],["loader",5],["loader",2],["target",3],["out-extension",5],["platform",2],["format",2],["external",4],["inject",4],["jsx",2],["jsx-factory",2],["jsx-fragment",2],["banner",2],["footer",2],["banner",5],["footer",5],["log-limit",6],["color",1],["log-level",2]];function Xr(r){return r.replace(/-(\w)/g,(e,t)=>t.toUpperCase())}function ir(r,e,t){return r==="--"+e||!!(t&&t.some(n=>r==="-"+n))}function De(r,e,t){return r.startsWith("--"+e+"=")||!!(t&&t.some(n=>r.startsWith("-"+n+"=")))}function sr(r,e,t){return r.startsWith("--"+e+":")||!!(t&&t.some(n=>r.startsWith("-"+n+":")))}function lr(r,e,[t,n,o]){let i=Xr(t);switch(n){case 0:return ir(e,t,o)?(r[i]=!0,!0):!1;case 1:if(ir(e,t,o))return r[i]=!0,!0;if(De(e,t,o)){let s=e.slice(e.indexOf("=")+1);if(s==="true")return r[i]=!0,!0;if(s==="false")return r[i]=!1,!0}return!1;case 2:return De(e,t,o)?(r[i]=e.slice(e.indexOf("=")+1),!0):!1;case 3:if(De(e,t,o)){let s=e.slice(e.indexOf("=")+1);return r[i]=s?s.split(","):[],!0}return!1;case 4:if(sr(e,t,o)){let s=e.slice(e.indexOf(":")+1);return(r[i]||=[]).push(s),!0}return!1;case 5:if(sr(e,t,o)){let s=e.slice(e.indexOf(":")+1),l=s.indexOf("=");if(l!==-1)return(r[i]||={})[s.slice(0,l)]=s.slice(l+1),!0}return!1;case 6:return De(e,t,o)?(r[i]=parseInt(e.slice(e.indexOf("=")+1)),!0):!1;case 7:return De(e,t,o)?(r[i]=new RegExp(e.slice(e.indexOf("=")+1)),!0):!1;default:return!1}}function _t(r,e){let t={_:[]};for(let n of r)e.some(o=>lr(t,n,o))||t._.push(n);return t}var Kr=/\s*(?=(([^\s\\\'\"]+)|'([^\']*)'|"((?:[^\"\\]|\\.)*)"|(\\.?)|(\S)))\1(\s|$)?/gmy;function ar(r){let e=[],t="";for(let[,,n,o,i,s,l,a]of r.matchAll(Kr)){if(l)throw new Error(`Unmatched quote: ${JSON.stringify(r)}`);t+=n||o||i?.replace(/\\([$`"\\\n])/g,"$1")||s.replace(/\\(.)/g,"$1"),a&&(e.push(t),t="")}return t&&e.push(t),e}var ne=ft("let a = 1"),oe=ft(""),Ue=we(oe,(r,e)=>{try{let{_:t,...n}=_t(ar(r),dt);e(n)}catch(t){le.set(String(t))}}),gt=we(Ue,(r,e)=>{e(r.loader)}),Ze=we([Ne,ne,Ue],([r,e,t],n)=>{!r||(Xt(),r.transform(e,t).then(n).catch(n).finally(Kt))},{}),bt=we([Ne,Ze],([r,e],t)=>{if(!r)return;let{errors:n,warnings:o}=e;if(!n&&!o){e instanceof Error&&r.formatMessages([{text:e.message}],{color:!0,kind:"error"}).then(i=>t(i.map(s=>rt(s)).join(`
`)));return}Promise.all([n?.length?r.formatMessages(n,{color:!0,kind:"error"}):null,o?.length?r.formatMessages(o,{color:!0,kind:"warning"}):null]).then(i=>{let s=i.reduce((l,a)=>a?[...l,...a]:l,[]);t(s.map(l=>rt(l)).join(`
`))})});te&&Object.assign(window,{stores_transform:{input:ne,options:oe,optionsObj:Ue,loader:gt,result:Ze,errorsHTML:bt}});function Yr(r){return JSON.stringify(r.map(e=>[e.name,e.contents,Number(e.isEntry)]))}function Zr(r){try{return JSON.parse(r).map(e=>({name:e[0],contents:e[1],isEntry:Boolean(e[2])}))}catch{return[]}}function xr(r){return JSON.stringify(r)}function Gr(r){try{return JSON.parse(r)||{}}catch{return{}}}var en=we([Re,x,ne,oe,Z,Pe],([r,e,t,n,o,i],s)=>{if(!r||r==="latest")return;let l=[["version",r],["mode",e]];e==="transform"&&(t&&l.push(["input",t]),n&&l.push(["options",n])),e==="build"&&(o.length&&l.push(["modules",Yr(o)]),Object.keys(i).length&&l.push(["buildOptions",xr(i)]));let a=new URLSearchParams(l);s(a.toString())});en.subscribe(r=>{r&&Vt(r)});var{shareable:cr,...G}=Te();if(cr){let r=JSON.parse(decodeURIComponent(atob(cr)));console.log("legacy shareable:",r),r.code&&ne.set(r.code),r.config&&oe.set(Ut(r.config)),r.modules&&(x.set("build"),Z.set(r.modules.map(({code:e,...t})=>({contents:e,...t})))),r.options&&Pe.set(r.options)}Object.keys(G).length&&console.log(G);G.mode&&x.set(G.mode);G.input&&ne.set(G.input);G.options&&oe.set(G.options);G.modules&&Z.set(Zr(G.modules));G.buildOptions&&Pe.set(Gr(G.buildOptions));G.debug&&Xe.set(!0);function ur(r,e,t){let n=r.slice();return n[9]=e[t],n}function fr(r,e,t){let n=r.slice();return n[12]=e[t],n}function pr(r,e){let t,n,o,i,s,l,a=e[12]+"",c,u,m,y,d,P;function N(){return e[7](e[12])}return{key:r,first:null,c(){t=w("input"),s=S(),l=w("label"),c=D(a),u=S(),this.h()},l(v){t=E(v,"INPUT",{type:!0,name:!0,id:!0,class:!0}),s=I(v),l=E(v,"LABEL",{for:!0,tabindex:!0,title:!0,class:!0});var h=k(l);c=U(h,a),u=I(h),h.forEach(f),this.h()},h(){p(t,"type","radio"),p(t,"name","mode"),p(t,"id",n="mode-"+e[12]),t.value=o=e[12],t.checked=i=e[0]===e[12],p(t,"class","svelte-5v49kb"),p(l,"for",m="mode-"+e[12]),p(l,"tabindex","0"),p(l,"title",y="esbuild."+e[12]+"()"),p(l,"class","svelte-5v49kb"),this.first=t},m(v,h){M(v,t,h),M(v,s,h),M(v,l,h),b(l,c),b(l,u),d||(P=[H(l,"click",N),H(l,"keydown",e[5](e[12]))],d=!0)},p(v,h){e=v,h&1&&i!==(i=e[0]===e[12])&&(t.checked=i)},d(v){v&&f(t),v&&f(s),v&&f(l),d=!1,re(P)}}}function mr(r){let e,t=r[9]+"",n,o;return{c(){e=w("option"),n=D(t),this.h()},l(i){e=E(i,"OPTION",{});var s=k(e);n=U(s,t),s.forEach(f),this.h()},h(){e.__value=o=r[9],e.value=e.__value},m(i,s){M(i,e,s),b(e,n)},p(i,s){s&4&&t!==(t=i[9]+"")&&Oe(n,t),s&4&&o!==(o=i[9])&&(e.__value=o,e.value=e.__value)},d(i){i&&f(e)}}}function tn(r){let e,t,n,o,i,s,l,a,c,u,m,y,d=[],P=new Map,N,v,h,g,_,O,T,B,j,K,ae,ce,ge,be,Pt,Je=r[4],Ct=C=>C[12];for(let C=0;C<Je.length;C+=1){let A=fr(r,Je,C),q=Ct(A);P.set(q,d[C]=pr(q,A))}let ke=r[2],z=[];for(let C=0;C<ke.length;C+=1)z[C]=mr(ur(r,ke,C));return{c(){e=w("header"),t=w("h1"),n=w("a"),o=D("esbuild"),i=S(),s=w("span"),l=D("."),a=S(),c=w("a"),u=D("repl"),m=S(),y=w("nav");for(let C=0;C<d.length;C+=1)d[C].c();N=S(),v=w("select");for(let C=0;C<z.length;C+=1)z[C].c();h=S(),g=w("button"),_=w("i"),O=S(),T=w("button"),B=w("i"),j=S(),K=w("button"),ae=w("i"),this.h()},l(C){e=E(C,"HEADER",{class:!0});var A=k(e);t=E(A,"H1",{class:!0});var q=k(t);n=E(q,"A",{href:!0,target:!0,rel:!0,class:!0});var Ce=k(n);o=U(Ce,"esbuild"),Ce.forEach(f),i=I(q),s=E(q,"SPAN",{});var Lt=k(s);l=U(Lt,"."),Lt.forEach(f),a=I(q),c=E(q,"A",{href:!0,target:!0,rel:!0,class:!0});var jt=k(c);u=U(jt,"repl"),jt.forEach(f),q.forEach(f),m=I(A),y=E(A,"NAV",{class:!0});var qt=k(y);for(let ve=0;ve<d.length;ve+=1)d[ve].l(qt);qt.forEach(f),N=I(A),v=E(A,"SELECT",{title:!0,class:!0});var $t=k(v);for(let ve=0;ve<z.length;ve+=1)z[ve].l($t);$t.forEach(f),h=I(A),g=E(A,"BUTTON",{title:!0,class:!0});var At=k(g);_=E(At,"I",{class:!0}),k(_).forEach(f),At.forEach(f),O=I(A),T=E(A,"BUTTON",{title:!0,class:!0});var Bt=k(T);B=E(Bt,"I",{class:!0}),k(B).forEach(f),Bt.forEach(f),j=I(A),K=E(A,"BUTTON",{title:!0,class:!0});var Dt=k(K);ae=E(Dt,"I",{class:!0}),k(ae).forEach(f),Dt.forEach(f),A.forEach(f),this.h()},h(){p(n,"href","https://esbuild.github.io"),p(n,"target","_blank"),p(n,"rel","noreferrer"),p(n,"class","svelte-5v49kb"),p(c,"href","https://github.com/hyrious/esbuild-repl"),p(c,"target","_blank"),p(c,"rel","noreferrer"),p(c,"class","svelte-5v49kb"),p(t,"class","svelte-5v49kb"),p(y,"class","svelte-5v49kb"),p(v,"title","change version"),p(v,"class","svelte-5v49kb"),p(_,"class","i-mdi-github"),p(g,"title","hyrious/esbuild-repl"),p(g,"class","svelte-5v49kb"),p(B,"class","i-mdi-share-variant"),p(T,"title","share (press shift for rollup url)"),p(T,"class","svelte-5v49kb"),p(ae,"class",ce=r[3]==="light"?"i-mdi-white-balance-sunny":"i-mdi-moon-waxing-crescent"),p(K,"title",ge="theme: "+r[3]),p(K,"class","svelte-5v49kb"),p(e,"class","svelte-5v49kb")},m(C,A){M(C,e,A),b(e,t),b(t,n),b(n,o),b(t,i),b(t,s),b(s,l),b(t,a),b(t,c),b(c,u),b(e,m),b(e,y);for(let q=0;q<d.length;q+=1)d[q].m(y,null);b(e,N),b(e,v);for(let q=0;q<z.length;q+=1)z[q].m(v,null);at(v,r[1]),b(e,h),b(e,g),b(g,_),b(e,O),b(e,T),b(T,B),b(e,j),b(e,K),b(K,ae),be||(Pt=[H(v,"change",r[6]),H(g,"click",on),H(T,"click",rn),H(K,"click",r[8])],be=!0)},p(C,[A]){if(A&49&&(Je=C[4],d=Qt(d,A,Ct,1,C,Je,P,y,Ft,pr,null,fr)),A&4){ke=C[2];let q;for(q=0;q<ke.length;q+=1){let Ce=ur(C,ke,q);z[q]?z[q].p(Ce,A):(z[q]=mr(Ce),z[q].c(),z[q].m(v,null))}for(;q<z.length;q+=1)z[q].d(1);z.length=ke.length}A&6&&at(v,C[1]),A&8&&ce!==(ce=C[3]==="light"?"i-mdi-white-balance-sunny":"i-mdi-moon-waxing-crescent")&&p(ae,"class",ce),A&8&&ge!==(ge="theme: "+C[3])&&p(K,"title",ge)},i:ue,o:ue,d(C){C&&f(e);for(let A=0;A<d.length;A+=1)d[A].d();Le(z,C),be=!1,re(Pt)}}}async function rn(r){try{let e=r.shiftKey?nn():location.href;await navigator.clipboard?.writeText(e),alert("Sharable URL has been copied to clipboard.")}catch{}}function nn(){let r=new URLSearchParams(location.search),e=r.get("modules");e?e=JSON.parse(e).map(n=>({name:n[0],code:n[1],isEntry:!!n[2]})):e=[{name:"main.js",code:r.get("input"),isEntry:!0}];let t={example:null,modules:e,options:{amd:{id:""},format:"es",globals:{},name:"a"}};return`https://rollupjs.org/repl/?shareable=${btoa(encodeURIComponent(JSON.stringify(t)))}`}function on(){open("https://github.com/hyrious/esbuild-repl","_blank")}function sn(r,e,t){let n,o,i,s;L(r,x,y=>t(0,n=y)),L(r,Re,y=>t(1,o=y)),L(r,Be,y=>t(2,i=y)),L(r,Se,y=>t(3,s=y));let l=["transform","build"];function a(y){return d=>{(d.code==="Space"||d.code==="Enter")&&fe(x,n=y,n)}}function c(y){let d=y.target?.value;if(typeof d=="string"){let P=Te();P.version=d,location.search=new URLSearchParams(P).toString()}}return[n,o,i,s,l,a,c,y=>fe(x,n=y,n),()=>fe(Se,s=s==="light"?"dark":"light",s)]}var vt=class extends V{constructor(e){super(),J(this,e,sn,tn,W,{})}},hr=vt;var Ge=te?new Worker("./hljs.js"):null,xe=new Map,yt=1;Ge&&Ge.addEventListener("message",r=>{let{id:e,value:t}=r.data;xe.has(e)&&(xe.get(e)(t),xe.delete(e))});function ln(r,e){if(!Ge)return new Promise(ye);let t,n=new Promise(o=>t=o);return xe.set(yt,t),Ge.postMessage({id:yt,code:r,lang:e}),yt++,n}var wt=class{constructor(e,t){this.node=e;this.token=t}cancelled=!1;replaceInnerHTML=e=>{clearTimeout(this.token),this.cancelled||(this.node.innerHTML=e)};cancel(){clearTimeout(this.token),this.cancelled=!0}},an=new Set(["css","json"]);function He(r,e){let t=null,n=({code:o,loader:i})=>{if(t&&(t.cancel(),t=null),o){t=new wt(r,setTimeout(()=>{r.innerText=o},50));let s=i&&an.has(i)?i:"js";ln(o,s).then(t.replaceInnerHTML)}else r.innerText=""};return n(e),{update:n}}var cn=r=>({}),dr=r=>({}),un=r=>({}),_r=r=>({});function gr(r){let e;return{c(){e=w("div"),this.h()},l(t){e=E(t,"DIV",{class:!0}),k(e).forEach(f),this.h()},h(){p(e,"class","cat svelte-ur4phb")},m(t,n){M(t,e,n)},d(t){t&&f(e)}}}function fn(r){let e,t,n,o,i,s,l,a,c,u,m,y,d,P,N=r[8].left,v=ot(N,r,r[7],_r),h=r[8].right,g=ot(h,r,r[7],dr),_=r[2]&&gr(r);return{c(){e=w("section"),t=w("div"),v&&v.c(),n=S(),o=w("div"),g&&g.c(),i=S(),s=w("div"),u=S(),_&&_.c(),m=pe(),this.h()},l(O){e=E(O,"SECTION",{style:!0,class:!0});var T=k(e);t=E(T,"DIV",{class:!0,style:!0});var B=k(t);v&&v.l(B),B.forEach(f),n=I(T),o=E(T,"DIV",{class:!0,style:!0});var j=k(o);g&&g.l(j),j.forEach(f),i=I(T),s=E(T,"DIV",{class:!0,style:!0}),k(s).forEach(f),T.forEach(f),u=I(O),_&&_.l(O),m=pe(),this.h()},h(){p(t,"class","pane svelte-ur4phb"),me(t,"width",r[1]+"%"),p(o,"class","pane svelte-ur4phb"),me(o,"width",100-r[1]+"%"),p(s,"class","divider svelte-ur4phb"),me(s,"left","calc("+r[1]+"% - 8px)"),me(s,"height",r[3]+"px"),je(s,"is-mobile",Ve),p(e,"style",a=r[0]?"":"display: none"),p(e,"class","svelte-ur4phb")},m(O,T){M(O,e,T),b(e,t),v&&v.m(t,null),b(e,n),b(e,o),g&&g.m(o,null),b(e,i),b(e,s),M(O,u,T),_&&_.m(O,T),M(O,m,T),y=!0,d||(P=[ie(l=r[5].call(null,s,r[6])),ie(c=r[4].call(null,e))],d=!0)},p(O,[T]){v&&v.p&&(!y||T&128)&&st(v,N,O,O[7],y?it(N,O[7],T,un):lt(O[7]),_r),(!y||T&2)&&me(t,"width",O[1]+"%"),g&&g.p&&(!y||T&128)&&st(g,h,O,O[7],y?it(h,O[7],T,cn):lt(O[7]),dr),(!y||T&2)&&me(o,"width",100-O[1]+"%"),(!y||T&2)&&me(s,"left","calc("+O[1]+"% - 8px)"),(!y||T&8)&&me(s,"height",O[3]+"px"),(!y||T&1&&a!==(a=O[0]?"":"display: none"))&&p(e,"style",a),O[2]?_||(_=gr(O),_.c(),_.m(m.parentNode,m)):_&&(_.d(1),_=null)},i(O){y||(R(v,O),R(g,O),y=!0)},o(O){$(v,O),$(g,O),y=!1},d(O){O&&f(e),v&&v.d(O),g&&g.d(O),O&&f(u),_&&_.d(O),O&&f(m),d=!1,re(P)}}}function pn(r,e,t){let{$$slots:n={},$$scope:o}=e,i=$e(),{show:s=!0}=e,l=50,a=!1,c,u,m;c=u=m=0;function y(N){let v=()=>{t(3,{left:c,width:u,height:m}=N.getBoundingClientRect(),m)},h=new ResizeObserver(v);return h.observe(N),v(),{destroy(){h.disconnect()}}}function d(N,v){let h=g=>{if(!g.isPrimary)return;g.preventDefault(),t(2,a=!0);let _=()=>{t(2,a=!1),window.removeEventListener("pointermove",v,!1),window.removeEventListener("pointerup",_,!1)};window.addEventListener("pointermove",v,!1),window.addEventListener("pointerup",_,!1)};return N.addEventListener("pointerdown",h),{destroy(){N.removeEventListener("pointerdown",h)}}}function P(N){let v=N.clientX-c;t(1,l=Jt(100*v/u,0,100)),i("change")}return r.$$set=N=>{"show"in N&&t(0,s=N.show),"$$scope"in N&&t(7,o=N.$$scope)},[s,l,a,m,y,d,P,o,n]}var Et=class extends V{constructor(e){super(),J(this,e,pn,fn,W,{show:0})}},et=Et;function mn(r){let e,t,n,o,i,s;return{c(){e=w("section"),t=w("textarea"),n=S(),o=w("input"),this.h()},l(l){e=E(l,"SECTION",{slot:!0,class:!0});var a=k(e);t=E(a,"TEXTAREA",{class:!0,rows:!0,spellcheck:!0}),k(t).forEach(f),n=I(a),o=E(a,"INPUT",{placeholder:!0,spellcheck:!0,autocomplete:!0}),a.forEach(f),this.h()},h(){p(t,"class","editor"),p(t,"rows","2"),p(t,"spellcheck","false"),p(o,"placeholder","--loader=js"),p(o,"spellcheck","false"),p(o,"autocomplete","off"),p(e,"slot","left"),p(e,"class","input")},m(l,a){M(l,e,a),b(e,t),se(t,r[5]),b(e,n),b(e,o),se(o,r[6]),i||(s=[H(t,"input",r[8]),H(o,"input",r[9])],i=!0)},p(l,a){a&32&&se(t,l[5]),a&64&&o.value!==l[6]&&se(o,l[6])},d(l){l&&f(e),i=!1,re(s)}}}function br(r){let e,t,n,o;return{c(){e=w("pre"),this.h()},l(i){e=E(i,"PRE",{class:!0}),k(e).forEach(f),this.h()},h(){p(e,"class","result code svelte-30wqgg")},m(i,s){M(i,e,s),n||(o=ie(t=He.call(null,e,{code:r[2],loader:r[3]})),n=!0)},p(i,s){t&&_e(t.update)&&s&12&&t.update.call(null,{code:i[2],loader:i[3]})},d(i){i&&f(e),n=!1,o()}}}function vr(r){let e,t,n,o;return{c(){e=w("pre"),this.h()},l(i){e=E(i,"PRE",{class:!0}),k(e).forEach(f),this.h()},h(){p(e,"class","result map svelte-30wqgg")},m(i,s){M(i,e,s),n||(o=ie(t=He.call(null,e,{code:r[1].map,loader:"json"})),n=!0)},p(i,s){t&&_e(t.update)&&s&2&&t.update.call(null,{code:i[1].map,loader:"json"})},d(i){i&&f(e),n=!1,o()}}}function yr(r){let e;return{c(){e=w("pre"),this.h()},l(t){e=E(t,"PRE",{class:!0});var n=k(e);n.forEach(f),this.h()},h(){p(e,"class","result error svelte-30wqgg")},m(t,n){M(t,e,n),e.innerHTML=r[4]},p(t,n){n&16&&(e.innerHTML=t[4])},d(t){t&&f(e)}}}function hn(r){let e,t,n,o=r[2]&&br(r),i=r[1].map&&vr(r),s=r[4]&&yr(r);return{c(){e=w("section"),o&&o.c(),t=S(),i&&i.c(),n=S(),s&&s.c(),this.h()},l(l){e=E(l,"SECTION",{slot:!0,class:!0});var a=k(e);o&&o.l(a),t=I(a),i&&i.l(a),n=I(a),s&&s.l(a),a.forEach(f),this.h()},h(){p(e,"slot","right"),p(e,"class","output")},m(l,a){M(l,e,a),o&&o.m(e,null),b(e,t),i&&i.m(e,null),b(e,n),s&&s.m(e,null)},p(l,a){l[2]?o?o.p(l,a):(o=br(l),o.c(),o.m(e,t)):o&&(o.d(1),o=null),l[1].map?i?i.p(l,a):(i=vr(l),i.c(),i.m(e,n)):i&&(i.d(1),i=null),l[4]?s?s.p(l,a):(s=yr(l),s.c(),s.m(e,null)):s&&(s.d(1),s=null)},d(l){l&&f(e),o&&o.d(),i&&i.d(),s&&s.d()}}}function dn(r){let e,t;return e=new et({props:{show:r[0],$$slots:{right:[hn],left:[mn]},$$scope:{ctx:r}}}),{c(){F(e.$$.fragment)},l(n){Y(e.$$.fragment,n)},m(n,o){Q(e,n,o),t=!0},p(n,[o]){let i={};o&1&&(i.show=n[0]),o&1150&&(i.$$scope={dirty:o,ctx:n}),e.$set(i)},i(n){t||(R(e.$$.fragment,n),t=!0)},o(n){$(e.$$.fragment,n),t=!1},d(n){X(e,n)}}}function _n(r,e,t){let n,o,i,s,l,a,c;L(r,Ze,d=>t(1,o=d)),L(r,Ie,d=>t(7,i=d)),L(r,gt,d=>t(3,s=d)),L(r,bt,d=>t(4,l=d)),L(r,ne,d=>t(5,a=d)),L(r,oe,d=>t(6,c=d));let{show:u=!0}=e;function m(){a=this.value,ne.set(a)}function y(){c=this.value,oe.set(c)}return r.$$set=d=>{"show"in d&&t(0,u=d.show)},r.$$.update=()=>{if(r.$$.dirty&130){e:t(2,n=i?"// initializing":o.code)}},[u,o,n,s,l,a,c,i,m,y]}var kt=class extends V{constructor(e){super(),J(this,e,_n,dn,W,{show:0})}},wr=kt;var gn;function Er(){return gn||=import("./codemirror-JZU4AXXY.js")}function bn(r){let e,t,n,o,i,s,l,a,c,u,m,y,d,P,N,v;return{c(){e=w("input"),t=S(),n=w("button"),o=w("span"),i=D("remove"),s=S(),l=w("i"),a=S(),c=w("button"),u=w("span"),m=D("(entry\xA0module)"),y=S(),d=w("i"),this.h()},l(h){e=E(h,"INPUT",{placeholder:!0,spellcheck:!0,class:!0}),t=I(h),n=E(h,"BUTTON",{class:!0});var g=k(n);o=E(g,"SPAN",{class:!0});var _=k(o);i=U(_,"remove"),_.forEach(f),s=I(g),l=E(g,"I",{class:!0}),k(l).forEach(f),g.forEach(f),a=I(h),c=E(h,"BUTTON",{class:!0});var O=k(c);u=E(O,"SPAN",{class:!0});var T=k(u);m=U(T,"(entry\xA0module)"),T.forEach(f),y=I(O),d=E(O,"I",{class:!0}),k(d).forEach(f),O.forEach(f),this.h()},h(){p(e,"placeholder","main.js"),p(e,"spellcheck","false"),p(e,"class","svelte-1e3pbc"),p(o,"class","label svelte-1e3pbc"),p(l,"class","i-mdi-close"),p(n,"class","remove svelte-1e3pbc"),p(u,"class","label svelte-1e3pbc"),p(d,"class",P=r[2]?"i-mdi-minus":"i-mdi-plus"),p(c,"class","entry svelte-1e3pbc")},m(h,g){M(h,e,g),se(e,r[0]),M(h,t,g),M(h,n,g),b(n,o),b(o,i),b(n,s),b(n,l),M(h,a,g),M(h,c,g),b(c,u),b(u,m),b(c,y),b(c,d),N||(v=[H(e,"input",r[11]),H(n,"click",r[12]),H(c,"click",r[13])],N=!0)},p(h,g){g&1&&e.value!==h[0]&&se(e,h[0]),g&4&&P!==(P=h[2]?"i-mdi-minus":"i-mdi-plus")&&p(d,"class",P)},d(h){h&&f(e),h&&f(t),h&&f(n),h&&f(a),h&&f(c),N=!1,re(v)}}}function vn(r){let e;return{c(){e=w("input"),this.h()},l(t){e=E(t,"INPUT",{placeholder:!0,spellcheck:!0,class:!0}),this.h()},h(){p(e,"placeholder","main.js"),p(e,"spellcheck","false"),e.value=r[0],e.readOnly=!0,p(e,"class","svelte-1e3pbc")},m(t,n){M(t,e,n)},p(t,n){n&1&&e.value!==t[0]&&(e.value=t[0])},d(t){t&&f(e)}}}function yn(r){let e,t,n;return{c(){e=w("textarea"),this.h()},l(o){e=E(o,"TEXTAREA",{class:!0,rows:!0,spellcheck:!0}),k(e).forEach(f),this.h()},h(){p(e,"class","editor svelte-1e3pbc"),p(e,"rows","2"),p(e,"spellcheck","false")},m(o,i){M(o,e,i),se(e,r[1]),t||(n=H(e,"input",r[15]),t=!0)},p(o,i){i&2&&se(e,o[1])},d(o){o&&f(e),t=!1,n()}}}function wn(r){let e,t,n,o;return{c(){e=w("pre"),this.h()},l(i){e=E(i,"PRE",{class:!0}),k(e).forEach(f),this.h()},h(){p(e,"class","chunk svelte-1e3pbc")},m(i,s){M(i,e,s),n||(o=ie(t=He.call(null,e,{code:r[1],loader:r[5]})),n=!0)},p(i,s){t&&_e(t.update)&&s&34&&t.update.call(null,{code:i[1],loader:i[5]})},d(i){i&&f(e),n=!1,o()}}}function En(r){let e,t;return{c(){e=w("div"),t=w("textarea"),this.h()},l(n){e=E(n,"DIV",{class:!0});var o=k(e);t=E(o,"TEXTAREA",{tabindex:!0,class:!0}),k(t).forEach(f),o.forEach(f),this.h()},h(){p(t,"tabindex","0"),t.value=r[1],p(t,"class","svelte-1e3pbc"),p(e,"class","codemirror-container")},m(n,o){M(n,e,o),b(e,t),r[14](t)},p(n,o){o&2&&(t.value=n[1])},d(n){n&&f(e),r[14](null)}}}function kn(r){let e,t,n;function o(u,m){return u[3]?vn:bn}let i=o(r,-1),s=i(r);function l(u,m){return te&&!Ve&&!u[3]?En:u[3]?wn:yn}let a=l(r,-1),c=a(r);return{c(){e=w("article"),t=w("header"),s.c(),n=S(),c.c(),this.h()},l(u){e=E(u,"ARTICLE",{class:!0});var m=k(e);t=E(m,"HEADER",{class:!0});var y=k(t);s.l(y),y.forEach(f),n=I(m),c.l(m),m.forEach(f),this.h()},h(){p(t,"class","svelte-1e3pbc"),p(e,"class","module svelte-1e3pbc"),je(e,"is-entry",r[2])},m(u,m){M(u,e,m),b(e,t),s.m(t,null),b(e,n),c.m(e,null)},p(u,[m]){i===(i=o(u,m))&&s?s.p(u,m):(s.d(1),s=i(u),s&&(s.c(),s.m(t,null))),a===(a=l(u,m))&&c?c.p(u,m):(c.d(1),c=a(u),c&&(c.c(),c.m(e,null))),m&4&&je(e,"is-entry",u[2])},i:ue,o:ue,d(u){u&&f(e),s.d(),c.d()}}}function Tn(r,e,t){let n;L(r,x,_=>t(10,n=_));let{name:o=""}=e,{contents:i=""}=e,{isEntry:s=!1}=e,{readonly:l=!1}=e,a,c,u,m=i,y,d=$e();qe(async()=>{!u||(t(7,{default:a}=await Er(),a),t(8,c=a.fromTextArea(u,{lineNumbers:!0,lineWrapping:!0,indentWithTabs:!0,indentUnit:2,tabSize:2,dragDrop:!1,value:i,mode:y==="js"?"javascript":y,readOnly:l})),c.on("change",_=>{t(1,i=_.getValue()),t(9,m=i)}),c.setValue(i))}),ct(()=>{c&&c.toTextArea()});function P(){o=this.value,t(0,o)}let N=()=>d("remove"),v=()=>t(2,s=!s);function h(_){Me[_?"unshift":"push"](()=>{u=_,t(4,u)})}function g(){i=this.value,t(1,i)}return r.$$set=_=>{"name"in _&&t(0,o=_.name),"contents"in _&&t(1,i=_.contents),"isEntry"in _&&t(2,s=_.isEntry),"readonly"in _&&t(3,l=_.readonly)},r.$$.update=()=>{if(r.$$.dirty&1){e:t(5,y=o.endsWith(".css")?"css":o.endsWith(".map")?"json":"js")}if(r.$$.dirty&385){e:if(a&&c&&o){let _=/.+\.([^.]+)$/.exec(o),O=a.findModeByExtension(_&&_[1]||"js");O&&c.setOption("mode",O.mime)}}if(r.$$.dirty&770){e:m!==i&&c&&(t(9,m=i),c.setValue(i))}if(r.$$.dirty&1280){e:n&&c&&Ae().then(c.refresh.bind(c))}},[o,i,s,l,u,y,d,a,c,m,n,P,N,v,h,g]}var Tt=class extends V{constructor(e){super(),J(this,e,Tn,kn,W,{name:0,contents:1,isEntry:2,readonly:3})}},Ot=Tt;function kr(r,e,t){let n=r.slice();return n[14]=e[t],n[17]=e,n[18]=t,n}function Tr(r,e,t){let n=r.slice();return n[14]=e[t],n}function Or(r){let e,t,n,o,i;function s(m){r[9](m,r[14])}function l(m){r[10](m,r[14])}function a(m){r[11](m,r[14])}function c(){return r[12](r[18])}let u={};return r[14].name!==void 0&&(u.name=r[14].name),r[14].contents!==void 0&&(u.contents=r[14].contents),r[14].isEntry!==void 0&&(u.isEntry=r[14].isEntry),e=new Ot({props:u}),Me.push(()=>Qe(e,"name",s)),Me.push(()=>Qe(e,"contents",l)),Me.push(()=>Qe(e,"isEntry",a)),e.$on("remove",c),{c(){F(e.$$.fragment)},l(m){Y(e.$$.fragment,m)},m(m,y){Q(e,m,y),i=!0},p(m,y){r=m;let d={};!t&&y&16&&(t=!0,d.name=r[14].name,Fe(()=>t=!1)),!n&&y&16&&(n=!0,d.contents=r[14].contents,Fe(()=>n=!1)),!o&&y&16&&(o=!0,d.isEntry=r[14].isEntry,Fe(()=>o=!1)),e.$set(d)},i(m){i||(R(e.$$.fragment,m),i=!0)},o(m){$(e.$$.fragment,m),i=!1},d(m){X(e,m)}}}function On(r){let e,t,n,o,i,s,l,a,c,u,m,y,d,P,N,v,h,g=r[4],_=[];for(let T=0;T<g.length;T+=1)_[T]=Or(kr(r,g,T));let O=T=>$(_[T],1,1,()=>{_[T]=null});return{c(){e=w("section"),t=w("h3"),n=w("span"),o=D("ES6 modules go in\u2026"),i=S(),s=w("button"),l=D("Start over"),a=S();for(let T=0;T<_.length;T+=1)_[T].c();c=S(),u=w("button"),m=w("i"),y=S(),d=w("span"),P=D("add module"),this.h()},l(T){e=E(T,"SECTION",{slot:!0,class:!0});var B=k(e);t=E(B,"H3",{class:!0});var j=k(t);n=E(j,"SPAN",{class:!0});var K=k(n);o=U(K,"ES6 modules go in\u2026"),K.forEach(f),i=I(j),s=E(j,"BUTTON",{class:!0});var ae=k(s);l=U(ae,"Start over"),ae.forEach(f),j.forEach(f),a=I(B);for(let be=0;be<_.length;be+=1)_[be].l(B);c=I(B),u=E(B,"BUTTON",{class:!0});var ce=k(u);m=E(ce,"I",{class:!0}),k(m).forEach(f),y=I(ce),d=E(ce,"SPAN",{});var ge=k(d);P=U(ge,"add module"),ge.forEach(f),ce.forEach(f),B.forEach(f),this.h()},h(){p(n,"class","svelte-1efahfh"),p(s,"class","svelte-1efahfh"),p(t,"class","svelte-1efahfh"),p(m,"class","i-mdi-plus"),p(u,"class","svelte-1efahfh"),p(e,"slot","left"),p(e,"class","input")},m(T,B){M(T,e,B),b(e,t),b(t,n),b(n,o),b(t,i),b(t,s),b(s,l),b(e,a);for(let j=0;j<_.length;j+=1)_[j].m(e,null);b(e,c),b(e,u),b(u,m),b(u,y),b(u,d),b(d,P),N=!0,v||(h=[H(s,"click",r[6]),H(u,"click",r[8])],v=!0)},p(T,B){if(B&144){g=T[4];let j;for(j=0;j<g.length;j+=1){let K=kr(T,g,j);_[j]?(_[j].p(K,B),R(_[j],1)):(_[j]=Or(K),_[j].c(),R(_[j],1),_[j].m(e,c))}for(he(),j=g.length;j<_.length;j+=1)O(j);de()}},i(T){if(!N){for(let B=0;B<g.length;B+=1)R(_[B]);N=!0}},o(T){_=_.filter(Boolean);for(let B=0;B<_.length;B+=1)$(_[B]);N=!1},d(T){T&&f(e),Le(_,T),v=!1,re(h)}}}function Mn(r){let e;return{c(){e=D("bundle comes")},l(t){e=U(t,"bundle comes")},m(t,n){M(t,e,n)},d(t){t&&f(e)}}}function Sn(r){let e;return{c(){e=D("chunks come")},l(t){e=U(t,"chunks come")},m(t,n){M(t,e,n)},d(t){t&&f(e)}}}function Mr(r){let e,t,n=r[1].files,o=[];for(let s=0;s<n.length;s+=1)o[s]=Sr(Tr(r,n,s));let i=s=>$(o[s],1,1,()=>{o[s]=null});return{c(){for(let s=0;s<o.length;s+=1)o[s].c();e=pe()},l(s){for(let l=0;l<o.length;l+=1)o[l].l(s);e=pe()},m(s,l){for(let a=0;a<o.length;a+=1)o[a].m(s,l);M(s,e,l),t=!0},p(s,l){if(l&2){n=s[1].files;let a;for(a=0;a<n.length;a+=1){let c=Tr(s,n,a);o[a]?(o[a].p(c,l),R(o[a],1)):(o[a]=Sr(c),o[a].c(),R(o[a],1),o[a].m(e.parentNode,e))}for(he(),a=n.length;a<o.length;a+=1)i(a);de()}},i(s){if(!t){for(let l=0;l<n.length;l+=1)R(o[l]);t=!0}},o(s){o=o.filter(Boolean);for(let l=0;l<o.length;l+=1)$(o[l]);t=!1},d(s){Le(o,s),s&&f(e)}}}function Sr(r){let e,t;return e=new Ot({props:{name:r[14].name.replace(/^\//,""),contents:r[14].contents,readonly:!0}}),{c(){F(e.$$.fragment)},l(n){Y(e.$$.fragment,n)},m(n,o){Q(e,n,o),t=!0},p(n,o){let i={};o&2&&(i.name=n[14].name.replace(/^\//,"")),o&2&&(i.contents=n[14].contents),e.$set(i)},i(n){t||(R(e.$$.fragment,n),t=!0)},o(n){$(e.$$.fragment,n),t=!1},d(n){X(e,n)}}}function Ir(r){let e;return{c(){e=w("pre"),this.h()},l(t){e=E(t,"PRE",{class:!0});var n=k(e);n.forEach(f),this.h()},h(){p(e,"class","result error svelte-1efahfh")},m(t,n){M(t,e,n),e.innerHTML=r[5]},p(t,n){n&32&&(e.innerHTML=t[5])},d(t){t&&f(e)}}}function In(r){let e,t,n,o,i,s,l,a,c,u;function m(g,_){return g[3]?Sn:Mn}let y=m(r,-1),d=y(r);var P=r[2];function N(g){return{}}P&&(l=new P(N(r)));let v=r[1].files&&Mr(r),h=r[5]&&Ir(r);return{c(){e=w("section"),t=w("h3"),n=w("span"),o=D("\u2026"),d.c(),i=D(" out"),s=S(),l&&F(l.$$.fragment),a=S(),v&&v.c(),c=S(),h&&h.c(),this.h()},l(g){e=E(g,"SECTION",{slot:!0,class:!0});var _=k(e);t=E(_,"H3",{class:!0});var O=k(t);n=E(O,"SPAN",{class:!0});var T=k(n);o=U(T,"\u2026"),d.l(T),i=U(T," out"),T.forEach(f),O.forEach(f),s=I(_),l&&Y(l.$$.fragment,_),a=I(_),v&&v.l(_),c=I(_),h&&h.l(_),_.forEach(f),this.h()},h(){p(n,"class","svelte-1efahfh"),p(t,"class","svelte-1efahfh"),p(e,"slot","right"),p(e,"class","output")},m(g,_){M(g,e,_),b(e,t),b(t,n),b(n,o),d.m(n,null),b(n,i),b(e,s),l&&Q(l,e,null),b(e,a),v&&v.m(e,null),b(e,c),h&&h.m(e,null),u=!0},p(g,_){if(y!==(y=m(g,_))&&(d.d(1),d=y(g),d&&(d.c(),d.m(n,i))),P!==(P=g[2])){if(l){he();let O=l;$(O.$$.fragment,1,0,()=>{X(O,1)}),de()}P?(l=new P(N(g)),F(l.$$.fragment),R(l.$$.fragment,1),Q(l,e,a)):l=null}g[1].files?v?(v.p(g,_),_&2&&R(v,1)):(v=Mr(g),v.c(),R(v,1),v.m(e,c)):v&&(he(),$(v,1,1,()=>{v=null}),de()),g[5]?h?h.p(g,_):(h=Ir(g),h.c(),h.m(e,null)):h&&(h.d(1),h=null)},i(g){u||(l&&R(l.$$.fragment,g),R(v),u=!0)},o(g){l&&$(l.$$.fragment,g),$(v),u=!1},d(g){g&&f(e),d.d(),l&&X(l),v&&v.d(),h&&h.d()}}}function Rn(r){let e,t;return e=new et({props:{show:r[0],$$slots:{right:[In],left:[On]},$$scope:{ctx:r}}}),{c(){F(e.$$.fragment)},l(n){Y(e.$$.fragment,n)},m(n,o){Q(e,n,o),t=!0},p(n,[o]){let i={};o&1&&(i.show=n[0]),o&524350&&(i.$$scope={dirty:o,ctx:n}),e.$set(i)},i(n){t||(R(e.$$.fragment,n),t=!0)},o(n){$(e.$$.fragment,n),t=!1},d(n){X(e,n)}}}function Nn(r,e,t){let n,o,i,s;L(r,Z,h=>t(4,o=h)),L(r,Ke,h=>t(1,i=h)),L(r,Yt,h=>t(5,s=h));let l,{show:a=!0}=e,c=1;function u(){fe(Z,o=[{name:"main.js",contents:"export let a = 1",isEntry:!0}],o)}function m(h){fe(Z,o=o.filter((g,_)=>h!==_),o)}function y(){o.length===0?fe(Z,o=[{name:"main.js",contents:"export let a = 1",isEntry:!0}],o):fe(Z,o=[...o,{name:`module_${c++}.js`,contents:"",isEntry:!1}],o),Ae().then(()=>{let h=document.querySelectorAll(".input .editor"),g=h[h.length-1];g&&g.focus()})}qe(async()=>{t(2,l=(await import("./BuildOptions-NZ2JY4E7.js")).default)});function d(h,g){r.$$.not_equal(g.name,h)&&(g.name=h,Z.set(o))}function P(h,g){r.$$.not_equal(g.contents,h)&&(g.contents=h,Z.set(o))}function N(h,g){r.$$.not_equal(g.isEntry,h)&&(g.isEntry=h,Z.set(o))}let v=h=>m(h);return r.$$set=h=>{"show"in h&&t(0,a=h.show)},r.$$.update=()=>{if(r.$$.dirty&2){e:t(3,n=i.files&&i.files.length>1)}},[a,i,l,n,o,s,u,m,y,d,P,N,v]}var Mt=class extends V{constructor(e){super(),J(this,e,Nn,Rn,W,{show:0})}},Rr=Mt;function Pn(r){let e,t,n,o,i;return t=new wr({props:{show:r[0]==="transform"}}),o=new Rr({props:{show:r[0]==="build"}}),{c(){e=w("main"),F(t.$$.fragment),n=S(),F(o.$$.fragment),this.h()},l(s){e=E(s,"MAIN",{"data-mode":!0});var l=k(e);Y(t.$$.fragment,l),n=I(l),Y(o.$$.fragment,l),l.forEach(f),this.h()},h(){p(e,"data-mode",r[0])},m(s,l){M(s,e,l),Q(t,e,null),b(e,n),Q(o,e,null),i=!0},p(s,[l]){let a={};l&1&&(a.show=s[0]==="transform"),t.$set(a);let c={};l&1&&(c.show=s[0]==="build"),o.$set(c),(!i||l&1)&&p(e,"data-mode",s[0])},i(s){i||(R(t.$$.fragment,s),R(o.$$.fragment,s),i=!0)},o(s){$(t.$$.fragment,s),$(o.$$.fragment,s),i=!1},d(s){s&&f(e),X(t),X(o)}}}function Cn(r,e,t){let n;return L(r,x,o=>t(0,n=o)),[n]}var St=class extends V{constructor(e){super(),J(this,e,Cn,Pn,W,{})}},Nr=St;function We(r,{delay:e=0,duration:t=400,easing:n=nt}={}){let o=+getComputedStyle(r).opacity;return{delay:e,duration:t,easing:n,css:i=>`opacity: ${i*o}`}}function Pr(r){let e,t;return{c(){e=w("i"),this.h()},l(n){e=E(n,"I",{class:!0}),k(e).forEach(f),this.h()},h(){p(e,"class","i-mdi-loading svelte-9g49lf")},m(n,o){M(n,e,o)},i(n){t||ze(()=>{t=zt(e,We,{}),t.start()})},o:ue,d(n){n&&f(e)}}}function Ln(r){let e,t,n,o,i,s,l,a=r[0]&&Pr(r);return{c(){e=w("footer"),a&&a.c(),t=S(),n=w("span"),o=D(r[1]),this.h()},l(c){e=E(c,"FOOTER",{class:!0});var u=k(e);a&&a.l(u),t=I(u),n=E(u,"SPAN",{});var m=k(n);o=U(m,r[1]),m.forEach(f),u.forEach(f),this.h()},h(){p(e,"class","svelte-9g49lf")},m(c,u){M(c,e,u),a&&a.m(e,null),b(e,t),b(e,n),b(n,o),s||(l=ie(i=jn.call(null,n,r[0])),s=!0)},p(c,[u]){c[0]?a?u&1&&R(a,1):(a=Pr(c),a.c(),R(a,1),a.m(e,t)):a&&(a.d(1),a=null),u&2&&Oe(o,c[1]),i&&_e(i.update)&&u&1&&i.update.call(null,c[0])},i(c){R(a)},o:ue,d(c){c&&f(e),a&&a.d(),s=!1,l()}}}function jn(r,e){return{update(t){if(e!==t){let n=r.animate([{marginLeft:e?"20px":"-20px"},{marginLeft:"initial"}],{duration:400,easing:"ease-out"});n.finished.then(n.cancel.bind(n)),n.playbackRate=1.000001,e=t}}}}function qn(r,e,t){let n,o;return L(r,Ie,i=>t(0,n=i)),L(r,le,i=>t(1,o=i)),[n,o]}var It=class extends V{constructor(e){super(),J(this,e,qn,Ln,W,{})}},Cr=It;function Lr(r){let e,t=JSON.stringify(r[1],null,2)+"",n,o,i;return{c(){e=w("pre"),n=D(t),this.h()},l(s){e=E(s,"PRE",{class:!0});var l=k(e);n=U(l,t),l.forEach(f),this.h()},h(){p(e,"class","svelte-wpb3rw")},m(s,l){M(s,e,l),b(e,n),i=!0},p(s,l){(!i||l&2)&&t!==(t=JSON.stringify(s[1],null,2)+"")&&Oe(n,t)},i(s){i||(ze(()=>{o||(o=ut(e,We,{duration:50},!0)),o.run(1)}),i=!0)},o(s){o||(o=ut(e,We,{duration:50},!1)),o.run(0),i=!1},d(s){s&&f(e),s&&o&&o.end()}}}function $n(r){let e,t,n,o,i,s,l=r[0]&&Lr(r);return{c(){l&&l.c(),e=S(),t=w("button"),n=D("Debug"),this.h()},l(a){l&&l.l(a),e=I(a),t=E(a,"BUTTON",{"aria-checked":!0,class:!0});var c=k(t);n=U(c,"Debug"),c.forEach(f),this.h()},h(){p(t,"aria-checked",r[0]),p(t,"class","svelte-wpb3rw")},m(a,c){l&&l.m(a,c),M(a,e,c),M(a,t,c),b(t,n),o=!0,i||(s=H(t,"click",r[9]),i=!0)},p(a,[c]){a[0]?l?(l.p(a,c),c&1&&R(l,1)):(l=Lr(a),l.c(),R(l,1),l.m(e.parentNode,e)):l&&(he(),$(l,1,1,()=>{l=null}),de()),(!o||c&1)&&p(t,"aria-checked",a[0])},i(a){o||(R(l),o=!0)},o(a){$(l),o=!1},d(a){l&&l.d(a),a&&f(e),a&&f(t),i=!1,s()}}}function An(r,e,t){let n,o,i,s,l,a,c,u;L(r,Ke,d=>t(2,o=d)),L(r,Pe,d=>t(3,i=d)),L(r,Z,d=>t(4,s=d)),L(r,Ue,d=>t(5,l=d)),L(r,oe,d=>t(6,a=d)),L(r,ne,d=>t(7,c=d)),L(r,x,d=>t(8,u=d));let m=!1,y=()=>t(0,m=!m);return r.$$.update=()=>{if(r.$$.dirty&508){e:t(1,n={$mode:u,Transform:{$input:c,$options:a,$optionsObj:l},Build:{$modules:s,$buildOptions:i,$outputs:o}})}},[m,n,o,i,s,l,a,c,u,y]}var Rt=class extends V{constructor(e){super(),J(this,e,An,$n,W,{})}},jr=Rt;function qr(r){let e,t;return e=new jr({}),{c(){F(e.$$.fragment)},l(n){Y(e.$$.fragment,n)},m(n,o){Q(e,n,o),t=!0},i(n){t||(R(e.$$.fragment,n),t=!0)},o(n){$(e.$$.fragment,n),t=!1},d(n){X(e,n)}}}function Bn(r){let e,t,n,o,i,s,l,a;e=new hr({}),n=new Nr({}),i=new Cr({});let c=r[0]&&qr(r);return{c(){F(e.$$.fragment),t=S(),F(n.$$.fragment),o=S(),F(i.$$.fragment),s=S(),c&&c.c(),l=pe()},l(u){Y(e.$$.fragment,u),t=I(u),Y(n.$$.fragment,u),o=I(u),Y(i.$$.fragment,u),s=I(u),c&&c.l(u),l=pe()},m(u,m){Q(e,u,m),M(u,t,m),Q(n,u,m),M(u,o,m),Q(i,u,m),M(u,s,m),c&&c.m(u,m),M(u,l,m),a=!0},p(u,[m]){u[0]?c?m&1&&R(c,1):(c=qr(u),c.c(),R(c,1),c.m(l.parentNode,l)):c&&(he(),$(c,1,1,()=>{c=null}),de())},i(u){a||(R(e.$$.fragment,u),R(n.$$.fragment,u),R(i.$$.fragment,u),R(c),a=!0)},o(u){$(e.$$.fragment,u),$(n.$$.fragment,u),$(i.$$.fragment,u),$(c),a=!1},d(u){X(e,u),u&&f(t),X(n,u),u&&f(o),X(i,u),u&&f(s),c&&c.d(u),u&&f(l)}}}function Dn(r,e,t){let n;return L(r,Xe,o=>t(0,n=o)),[n]}var Nt=class extends V{constructor(e){super(),J(this,e,Dn,Bn,W,{})}},$r=Nt;Object.assign(window,{app:new $r({target:document.querySelector("#app"),hydrate:!0})});console.debug("variables for debug: window.{ esbuild, stores, app }");
//# sourceMappingURL=main.js.map
