import"./chunk-DVVJ3LSM.js";import{a as Z,b as ke,c as Xe,d as Vt}from"./chunk-I45SB526.js";import{$ as P,A as w,B as U,C as T,D as ce,E as H,G as p,H as E,I as k,J as D,K as j,M as ye,N as le,O as ue,P as ot,Q as Me,S as Se,T as st,U as Ie,V as we,W as Te,X as Ue,Y as De,Z as fe,_ as pe,a as Ye,aa as B,b as Rt,ba as Ut,c as Bt,ca as lt,da as Dt,ea as Ht,f as At,fa as He,g as ve,ga as X,h as Ae,ha as K,i as $e,ia as F,j as $t,ja as Q,k as ie,ka as J,l as xe,la as z,m as te,ma as it,n as he,na as ge,o as W,oa as at,p as C,pa as We,q as et,qa as Je,r as tt,ra as ze,s as nt,sa as ct,t as rt,ta as Y,u as ae,ua as Ve,v as se,va as Wt,w as g,wa as Jt,x as I,xa as zt,y as f,z as Oe}from"./chunk-WSAFY2JV.js";import"./chunk-ON5OQYWL.js";var ut=[["bundle",1],["preserve-symlinks",1],["splitting",1],["allow-overwrite",1],["watch",1],["minify",1],["minify-syntax",1],["minify-whitespace",1],["minify-identifiers",1],["mangle-quoted",1],["mangle-props",7],["reserve-props",7],["mangle-cache",2],["drop",4],["legal-comments",2],["charset",2],["tree-shaking",1],["ignore-annotations",1],["keep-names",1],["sourcemap",0],["sourcemap",2],["source-root",2],["sources-content",1],["sourcefile",2],["resolve-extensions",3],["main-fields",3],["conditions",3],["public-path",2],["global-name",2],["metafile",0],["metafile",2],["outfile",2],["outdir",2],["outbase",2],["tsconfig",2],["tsconfig-raw",2],["entry-names",2],["chunk-names",2],["asset-names",2],["define",5],["pure",4],["loader",5],["loader",2],["target",3],["out-extension",5],["platform",2],["format",2],["external",4],["inject",4],["jsx",2],["jsx-factory",2],["jsx-fragment",2],["banner",2],["footer",2],["banner",5],["footer",5],["log-limit",6],["color",1],["log-level",2]];function Mn(n){return n.replace(/-(\w)/g,(e,t)=>t.toUpperCase())}function Xt(n,e,t){return n==="--"+e||!!(t&&t.some(r=>n==="-"+r))}function je(n,e,t){return n.startsWith("--"+e+"=")||!!(t&&t.some(r=>n.startsWith("-"+r+"=")))}function Ft(n,e,t){return n.startsWith("--"+e+":")||!!(t&&t.some(r=>n.startsWith("-"+r+":")))}function Qt(n,e,[t,r,o]){let l=Mn(t);switch(r){case 0:return Xt(e,t,o)?(n[l]=!0,!0):!1;case 1:if(Xt(e,t,o))return n[l]=!0,!0;if(je(e,t,o)){let s=e.slice(e.indexOf("=")+1);if(s==="true")return n[l]=!0,!0;if(s==="false")return n[l]=!1,!0}return!1;case 2:return je(e,t,o)?(n[l]=e.slice(e.indexOf("=")+1),!0):!1;case 3:if(je(e,t,o)){let s=e.slice(e.indexOf("=")+1);return n[l]=s?s.split(","):[],!0}return!1;case 4:if(Ft(e,t,o)){let s=e.slice(e.indexOf(":")+1);return(n[l]||=[]).push(s),!0}return!1;case 5:if(Ft(e,t,o)){let s=e.slice(e.indexOf(":")+1),i=s.indexOf("=");if(i!==-1)return(n[l]||={})[s.slice(0,i)]=s.slice(i+1),!0}return!1;case 6:return je(e,t,o)?(n[l]=parseInt(e.slice(e.indexOf("=")+1)),!0):!1;case 7:return je(e,t,o)?(n[l]=new RegExp(e.slice(e.indexOf("=")+1)),!0):!1;default:return!1}}function ft(n,e){let t={_:[]};for(let r of n)e.some(o=>Qt(t,r,o))||t._.push(r);return t}var Sn=/\s*(?=(([^\s\\\'\"]+)|'([^\']*)'|"((?:[^\"\\]|\\.)*)"|(\\.?)|(\S)))\1(\s|$)?/gmy;function Kt(n){let e=[],t="";for(let[,,r,o,l,s,i,a]of n.matchAll(Sn)){if(i)throw new Error(`Unmatched quote: ${JSON.stringify(n)}`);t+=r||o||l?.replace(/\\([$`"\\\n])/g,"$1")||s.replace(/\\(.)/g,"$1"),a&&(e.push(t),t="")}return t&&e.push(t),e}var ne=it("let a = 1"),re=it(""),Pe=ge(re,(n,e)=>{try{let{_:t,...r}=ft(Kt(n),ut);e(r)}catch(t){Je.set(String(t))}}),pt=ge(Pe,(n,e)=>{e(n.loader)}),Fe=ge([ct,ne,Pe],([n,e,t],r)=>{!n||(Jt(),n.transform(e,t).then(r).catch(r).finally(zt))},{}),mt=ge([ct,Fe],([n,e],t)=>{if(!n)return;let{errors:r,warnings:o}=e;if(!r&&!o){e instanceof Error&&n.formatMessages([{text:e.message}],{color:!0,kind:"error"}).then(l=>t(l.map(s=>Ye(s)).join(`
`)));return}Promise.all([r?.length?n.formatMessages(r,{color:!0,kind:"error"}):null,o?.length?n.formatMessages(o,{color:!0,kind:"warning"}):null]).then(l=>{let s=l.reduce((i,a)=>a?[...i,...a]:i,[]);t(s.map(i=>Ye(i)).join(`
`))})});ve&&Object.assign(window,{stores_transform:{input:ne,options:re,optionsObj:Pe,loader:pt,result:Fe,errorsHTML:mt}});function In(n){return JSON.stringify(n.map(e=>[e.name,e.contents,Number(e.isEntry)]))}function Tn(n){try{return JSON.parse(n).map(e=>({name:e[0],contents:e[1],isEntry:Boolean(e[2])}))}catch{return[]}}function jn(n){return JSON.stringify(n)}function Pn(n){try{return JSON.parse(n)||{}}catch{return{}}}var Nn=ge([ze,Y,ne,re,Z,ke],([n,e,t,r,o,l],s)=>{if(!n||n==="latest")return;let i=[["version",n],["mode",e]];e==="transform"&&(t&&i.push(["input",t]),r&&i.push(["options",r])),e==="build"&&(o.length&&i.push(["modules",In(o)]),Object.keys(l).length&&i.push(["buildOptions",jn(l)]));let a=new URLSearchParams(i);s(a.toString())});Nn.subscribe(n=>{n&&$t(n)});var{shareable:Zt,...x}=$e();if(Zt){let n=JSON.parse(decodeURIComponent(atob(Zt)));console.log("legacy shareable:",n),n.code&&ne.set(n.code),n.config&&re.set(Rt(n.config)),n.modules&&(Y.set("build"),Z.set(n.modules.map(({code:e,...t})=>({contents:e,...t})))),n.options&&ke.set(n.options)}Object.keys(x).length&&console.log(x);x.mode&&Y.set(x.mode);x.input&&ne.set(x.input);x.options&&re.set(x.options);x.modules&&Z.set(Tn(x.modules));x.buildOptions&&ke.set(Pn(x.buildOptions));x.debug&&Ve.set(!0);function Gt(n,e,t){let r=n.slice();return r[9]=e[t],r}function Yt(n,e,t){let r=n.slice();return r[12]=e[t],r}function xt(n,e){let t,r,o,l,s,i,a=e[12]+"",c,u,d,v,h;function q(){return e[7](e[12])}return{key:n,first:null,c(){t=w("input"),s=T(),i=w("label"),c=U(a),this.h()},l(S){t=k(S,"INPUT",{type:!0,name:!0,id:!0,class:!0}),s=j(S),i=k(S,"LABEL",{for:!0,tabindex:!0,title:!0,class:!0});var y=E(i);c=D(y,a),y.forEach(f),this.h()},h(){p(t,"type","radio"),p(t,"name","mode"),p(t,"id",r="mode-"+e[12]),t.value=o=e[12],t.checked=l=e[0]===e[12],p(t,"class","svelte-129coud"),p(i,"for",u="mode-"+e[12]),p(i,"tabindex","0"),p(i,"title",d="esbuild."+e[12]+"()"),p(i,"class","svelte-129coud"),this.first=t},m(S,y){I(S,t,y),I(S,s,y),I(S,i,y),g(i,c),v||(h=[H(i,"click",q),H(i,"keydown",e[5](e[12]))],v=!0)},p(S,y){e=S,y&1&&l!==(l=e[0]===e[12])&&(t.checked=l)},d(S){S&&f(t),S&&f(s),S&&f(i),v=!1,te(h)}}}function en(n){let e,t=n[9]+"",r,o;return{c(){e=w("option"),r=U(t),this.h()},l(l){e=k(l,"OPTION",{});var s=E(e);r=D(s,t),s.forEach(f),this.h()},h(){e.__value=o=n[9],e.value=e.__value},m(l,s){I(l,e,s),g(e,r)},p(l,s){s&4&&t!==(t=l[9]+"")&&ye(r,t),s&4&&o!==(o=l[9])&&(e.__value=o,e.value=e.__value)},d(l){l&&f(e)}}}function qn(n){let e,t,r,o,l,s,i,a,c,u,d,v,h=[],q=new Map,S,y,_,b,m,M,O,$,L,G,me,de,ee,oe,Ce,Le,Ge,St,Re=n[4],It=N=>N[12];for(let N=0;N<Re.length;N+=1){let A=Yt(n,Re,N),R=It(A);q.set(R,h[N]=xt(R,A))}let be=n[2],V=[];for(let N=0;N<be.length;N+=1)V[N]=en(Gt(n,be,N));return{c(){e=w("header"),t=w("h1"),r=w("a"),o=U("esbuild"),l=T(),s=w("span"),i=U("."),a=T(),c=w("a"),u=U("repl"),d=T(),v=w("nav");for(let N=0;N<h.length;N+=1)h[N].c();S=T(),y=w("a"),_=U("playground"),b=T(),m=w("select");for(let N=0;N<V.length;N+=1)V[N].c();M=T(),O=w("button"),$=w("i"),L=T(),G=w("button"),me=w("i"),de=T(),ee=w("button"),oe=w("i"),this.h()},l(N){e=k(N,"HEADER",{class:!0});var A=E(e);t=k(A,"H1",{class:!0});var R=E(t);r=k(R,"A",{href:!0,target:!0,rel:!0,class:!0});var Ee=E(r);o=D(Ee,"esbuild"),Ee.forEach(f),l=j(R),s=k(R,"SPAN",{});var Tt=E(s);i=D(Tt,"."),Tt.forEach(f),a=j(R),c=k(R,"A",{href:!0,target:!0,rel:!0,class:!0});var jt=E(c);u=D(jt,"repl"),jt.forEach(f),R.forEach(f),d=j(A),v=k(A,"NAV",{class:!0});var Be=E(v);for(let _e=0;_e<h.length;_e+=1)h[_e].l(Be);S=j(Be),y=k(Be,"A",{class:!0,href:!0,title:!0});var Pt=E(y);_=D(Pt,"playground"),Pt.forEach(f),Be.forEach(f),b=j(A),m=k(A,"SELECT",{title:!0,class:!0});var Nt=E(m);for(let _e=0;_e<V.length;_e+=1)V[_e].l(Nt);Nt.forEach(f),M=j(A),O=k(A,"BUTTON",{title:!0,class:!0});var qt=E(O);$=k(qt,"I",{class:!0}),E($).forEach(f),qt.forEach(f),L=j(A),G=k(A,"BUTTON",{title:!0,class:!0});var Ct=E(G);me=k(Ct,"I",{class:!0}),E(me).forEach(f),Ct.forEach(f),de=j(A),ee=k(A,"BUTTON",{title:!0,class:!0});var Lt=E(ee);oe=k(Lt,"I",{class:!0}),E(oe).forEach(f),Lt.forEach(f),A.forEach(f),this.h()},h(){p(r,"href","https://esbuild.github.io"),p(r,"target","_blank"),p(r,"rel","noreferrer"),p(r,"class","svelte-129coud"),p(c,"href","https://github.com/hyrious/esbuild-repl"),p(c,"target","_blank"),p(c,"rel","noreferrer"),p(c,"class","svelte-129coud"),p(t,"class","svelte-129coud"),p(y,"class","playground svelte-129coud"),p(y,"href","./play.html"),p(y,"title","play your code"),p(v,"class","svelte-129coud"),p(m,"title","change version"),p(m,"class","svelte-129coud"),p($,"class","i-mdi-github"),p(O,"title","hyrious/esbuild-repl"),p(O,"class","svelte-129coud"),p(me,"class","i-mdi-share-variant"),p(G,"title","share (press shift for rollup url)"),p(G,"class","svelte-129coud"),p(oe,"class",Ce=n[3]==="light"?"i-mdi-white-balance-sunny":"i-mdi-moon-waxing-crescent"),p(ee,"title",Le="theme: "+n[3]),p(ee,"class","svelte-129coud"),p(e,"class","svelte-129coud")},m(N,A){I(N,e,A),g(e,t),g(t,r),g(r,o),g(t,l),g(t,s),g(s,i),g(t,a),g(t,c),g(c,u),g(e,d),g(e,v);for(let R=0;R<h.length;R+=1)h[R].m(v,null);g(v,S),g(v,y),g(y,_),g(e,b),g(e,m);for(let R=0;R<V.length;R+=1)V[R].m(m,null);ot(m,n[1]),g(e,M),g(e,O),g(O,$),g(e,L),g(e,G),g(G,me),g(e,de),g(e,ee),g(ee,oe),Ge||(St=[H(m,"change",n[6]),H(O,"click",Rn),H(G,"click",Cn),H(ee,"click",n[8])],Ge=!0)},p(N,[A]){if(A&49&&(Re=N[4],h=Ht(h,A,It,1,N,Re,q,v,Dt,xt,S,Yt)),A&4){be=N[2];let R;for(R=0;R<be.length;R+=1){let Ee=Gt(N,be,R);V[R]?V[R].p(Ee,A):(V[R]=en(Ee),V[R].c(),V[R].m(m,null))}for(;R<V.length;R+=1)V[R].d(1);V.length=be.length}A&6&&ot(m,N[1]),A&8&&Ce!==(Ce=N[3]==="light"?"i-mdi-white-balance-sunny":"i-mdi-moon-waxing-crescent")&&p(oe,"class",Ce),A&8&&Le!==(Le="theme: "+N[3])&&p(ee,"title",Le)},i:ie,o:ie,d(N){N&&f(e);for(let A=0;A<h.length;A+=1)h[A].d();Oe(V,N),Ge=!1,te(St)}}}async function Cn(n){try{let e=n.shiftKey?Ln():location.href;await navigator.clipboard?.writeText(e),alert("Sharable URL has been copied to clipboard.")}catch{}}function Ln(){let n=new URLSearchParams(location.search),e=n.get("modules");e?e=JSON.parse(e).map(r=>({name:r[0],code:r[1],isEntry:!!r[2]})):e=[{name:"main.js",code:n.get("input"),isEntry:!0}];let t={example:null,modules:e,options:{amd:{id:""},format:"es",globals:{},name:"a"}};return`https://rollupjs.org/repl/?shareable=${btoa(encodeURIComponent(JSON.stringify(t)))}`}function Rn(){open("https://github.com/hyrious/esbuild-repl","_blank")}function Bn(n,e,t){let r,o,l,s;C(n,Y,v=>t(0,r=v)),C(n,ze,v=>t(1,o=v)),C(n,Wt,v=>t(2,l=v)),C(n,at,v=>t(3,s=v));let i=["transform","build"];function a(v){return h=>{(h.code==="Space"||h.code==="Enter")&&ae(Y,r=v,r)}}function c(v){let h=v.target?.value;if(typeof h=="string"){let q=$e();q.version=h,location.search=new URLSearchParams(q).toString()}}return[r,o,l,s,i,a,c,v=>ae(Y,r=v,r),()=>ae(at,s=s==="light"?"dark":"light",s)]}var dt=class extends z{constructor(e){super(),J(this,e,Bn,qn,W,{})}},tn=dt;var Ke=ve?new Worker("./hljs.js"):null,Qe=new Map,ht=1;Ke&&Ke.addEventListener("message",n=>{let{id:e,value:t}=n.data;Qe.has(e)&&(Qe.get(e)(t),Qe.delete(e))});function An(n,e){if(!Ke)return new Promise(Bt);let t,r=new Promise(o=>t=o);return Qe.set(ht,t),Ke.postMessage({id:ht,code:n,lang:e}),ht++,r}var _t=class{constructor(e,t){this.node=e;this.token=t}cancelled=!1;replaceInnerHTML=e=>{clearTimeout(this.token),this.cancelled||(this.node.innerHTML=e)};cancel(){clearTimeout(this.token),this.cancelled=!0}},$n=new Set(["css","json"]);function Ne(n,e){let t=null,r=({code:o,loader:l})=>{if(t&&(t.cancel(),t=null),o){t=new _t(n,setTimeout(()=>{n.innerText=o},50));let s=l&&$n.has(l)?l:"js";An(o,s).then(t.replaceInnerHTML)}else n.innerText=""};return r(e),{update:r}}var Un=n=>({}),nn=n=>({}),Dn=n=>({}),rn=n=>({});function on(n){let e;return{c(){e=w("div"),this.h()},l(t){e=k(t,"DIV",{class:!0}),E(e).forEach(f),this.h()},h(){p(e,"class","cat svelte-rzp60m")},m(t,r){I(t,e,r)},d(t){t&&f(e)}}}function Hn(n){let e,t,r,o,l,s,i,a,c,u,d,v,h,q,S=n[8].left,y=et(S,n,n[7],rn),_=n[8].right,b=et(_,n,n[7],nn),m=n[2]&&on(n);return{c(){e=w("section"),t=w("div"),y&&y.c(),r=T(),o=w("div"),b&&b.c(),l=T(),s=w("div"),u=T(),m&&m.c(),d=ce(),this.h()},l(M){e=k(M,"SECTION",{style:!0,class:!0});var O=E(e);t=k(O,"DIV",{class:!0,style:!0});var $=E(t);y&&y.l($),$.forEach(f),r=j(O),o=k(O,"DIV",{class:!0,style:!0});var L=E(o);b&&b.l(L),L.forEach(f),l=j(O),s=k(O,"DIV",{class:!0,style:!0}),E(s).forEach(f),O.forEach(f),u=j(M),m&&m.l(M),d=ce(),this.h()},h(){p(t,"class","pane svelte-rzp60m"),ue(t,"width",n[1]+"%"),p(o,"class","pane svelte-rzp60m"),ue(o,"width",100-n[1]+"%"),p(s,"class","divider svelte-rzp60m"),ue(s,"left","calc("+n[1]+"% - 8px)"),ue(s,"height",n[3]+"px"),Me(s,"is-mobile",Ae),p(e,"style",a=n[0]?"":"display: none"),p(e,"class","svelte-rzp60m")},m(M,O){I(M,e,O),g(e,t),y&&y.m(t,null),g(e,r),g(e,o),b&&b.m(o,null),g(e,l),g(e,s),I(M,u,O),m&&m.m(M,O),I(M,d,O),v=!0,h||(q=[se(i=n[5].call(null,s,n[6])),se(c=n[4].call(null,e))],h=!0)},p(M,[O]){y&&y.p&&(!v||O&128)&&nt(y,S,M,M[7],v?tt(S,M[7],O,Dn):rt(M[7]),rn),(!v||O&2)&&ue(t,"width",M[1]+"%"),b&&b.p&&(!v||O&128)&&nt(b,_,M,M[7],v?tt(_,M[7],O,Un):rt(M[7]),nn),(!v||O&2)&&ue(o,"width",100-M[1]+"%"),(!v||O&2)&&ue(s,"left","calc("+M[1]+"% - 8px)"),(!v||O&8)&&ue(s,"height",M[3]+"px"),(!v||O&1&&a!==(a=M[0]?"":"display: none"))&&p(e,"style",a),M[2]?m||(m=on(M),m.c(),m.m(d.parentNode,d)):m&&(m.d(1),m=null)},i(M){v||(P(y,M),P(b,M),v=!0)},o(M){B(y,M),B(b,M),v=!1},d(M){M&&f(e),y&&y.d(M),b&&b.d(M),M&&f(u),m&&m.d(M),M&&f(d),h=!1,te(q)}}}function Wn(n,e,t){let{$$slots:r={},$$scope:o}=e,l=Ie(),{show:s=!0}=e,i=50,a=!1,c,u,d;c=u=d=0;function v(S){let y=()=>{t(3,{left:c,width:u,height:d}=S.getBoundingClientRect(),d)},_=new ResizeObserver(y);return _.observe(S),y(),{destroy(){_.disconnect()}}}function h(S,y){let _=b=>{if(!b.isPrimary)return;b.preventDefault(),t(2,a=!0);let m=()=>{t(2,a=!1),window.removeEventListener("pointermove",y,!1),window.removeEventListener("pointerup",m,!1)};window.addEventListener("pointermove",y,!1),window.addEventListener("pointerup",m,!1)};return S.addEventListener("pointerdown",_),{destroy(){S.removeEventListener("pointerdown",_)}}}function q(S){let y=S.clientX-c;t(1,i=At(100*y/u,0,100)),l("change")}return n.$$set=S=>{"show"in S&&t(0,s=S.show),"$$scope"in S&&t(7,o=S.$$scope)},[s,i,a,d,v,h,q,o,r]}var gt=class extends z{constructor(e){super(),J(this,e,Wn,Hn,W,{show:0})}},Ze=gt;function Jn(n){let e,t,r,o,l,s;return{c(){e=w("section"),t=w("textarea"),r=T(),o=w("input"),this.h()},l(i){e=k(i,"SECTION",{slot:!0,class:!0});var a=E(e);t=k(a,"TEXTAREA",{class:!0,rows:!0,spellcheck:!0}),E(t).forEach(f),r=j(a),o=k(a,"INPUT",{placeholder:!0,spellcheck:!0,autocomplete:!0}),a.forEach(f),this.h()},h(){p(t,"class","editor"),p(t,"rows","2"),p(t,"spellcheck","false"),p(o,"placeholder","--loader=js"),p(o,"spellcheck","false"),p(o,"autocomplete","off"),p(e,"slot","left"),p(e,"class","input")},m(i,a){I(i,e,a),g(e,t),le(t,n[5]),g(e,r),g(e,o),le(o,n[6]),l||(s=[H(t,"input",n[8]),H(o,"input",n[9])],l=!0)},p(i,a){a&32&&le(t,i[5]),a&64&&o.value!==i[6]&&le(o,i[6])},d(i){i&&f(e),l=!1,te(s)}}}function sn(n){let e,t,r,o;return{c(){e=w("pre"),this.h()},l(l){e=k(l,"PRE",{class:!0}),E(e).forEach(f),this.h()},h(){p(e,"class","result code svelte-30wqgg")},m(l,s){I(l,e,s),r||(o=se(t=Ne.call(null,e,{code:n[2],loader:n[3]})),r=!0)},p(l,s){t&&he(t.update)&&s&12&&t.update.call(null,{code:l[2],loader:l[3]})},d(l){l&&f(e),r=!1,o()}}}function ln(n){let e,t,r,o;return{c(){e=w("pre"),this.h()},l(l){e=k(l,"PRE",{class:!0}),E(e).forEach(f),this.h()},h(){p(e,"class","result map svelte-30wqgg")},m(l,s){I(l,e,s),r||(o=se(t=Ne.call(null,e,{code:n[1].map,loader:"json"})),r=!0)},p(l,s){t&&he(t.update)&&s&2&&t.update.call(null,{code:l[1].map,loader:"json"})},d(l){l&&f(e),r=!1,o()}}}function an(n){let e;return{c(){e=w("pre"),this.h()},l(t){e=k(t,"PRE",{class:!0});var r=E(e);r.forEach(f),this.h()},h(){p(e,"class","result error svelte-30wqgg")},m(t,r){I(t,e,r),e.innerHTML=n[4]},p(t,r){r&16&&(e.innerHTML=t[4])},d(t){t&&f(e)}}}function zn(n){let e,t,r,o=n[2]&&sn(n),l=n[1].map&&ln(n),s=n[4]&&an(n);return{c(){e=w("section"),o&&o.c(),t=T(),l&&l.c(),r=T(),s&&s.c(),this.h()},l(i){e=k(i,"SECTION",{slot:!0,class:!0});var a=E(e);o&&o.l(a),t=j(a),l&&l.l(a),r=j(a),s&&s.l(a),a.forEach(f),this.h()},h(){p(e,"slot","right"),p(e,"class","output")},m(i,a){I(i,e,a),o&&o.m(e,null),g(e,t),l&&l.m(e,null),g(e,r),s&&s.m(e,null)},p(i,a){i[2]?o?o.p(i,a):(o=sn(i),o.c(),o.m(e,t)):o&&(o.d(1),o=null),i[1].map?l?l.p(i,a):(l=ln(i),l.c(),l.m(e,r)):l&&(l.d(1),l=null),i[4]?s?s.p(i,a):(s=an(i),s.c(),s.m(e,null)):s&&(s.d(1),s=null)},d(i){i&&f(e),o&&o.d(),l&&l.d(),s&&s.d()}}}function Vn(n){let e,t;return e=new Ze({props:{show:n[0],$$slots:{right:[zn],left:[Jn]},$$scope:{ctx:n}}}),{c(){X(e.$$.fragment)},l(r){K(e.$$.fragment,r)},m(r,o){F(e,r,o),t=!0},p(r,[o]){let l={};o&1&&(l.show=r[0]),o&1150&&(l.$$scope={dirty:o,ctx:r}),e.$set(l)},i(r){t||(P(e.$$.fragment,r),t=!0)},o(r){B(e.$$.fragment,r),t=!1},d(r){Q(e,r)}}}function Xn(n,e,t){let r,o,l,s,i,a,c;C(n,Fe,h=>t(1,o=h)),C(n,We,h=>t(7,l=h)),C(n,pt,h=>t(3,s=h)),C(n,mt,h=>t(4,i=h)),C(n,ne,h=>t(5,a=h)),C(n,re,h=>t(6,c=h));let{show:u=!0}=e;function d(){a=this.value,ne.set(a)}function v(){c=this.value,re.set(c)}return n.$$set=h=>{"show"in h&&t(0,u=h.show)},n.$$.update=()=>{if(n.$$.dirty&130){e:t(2,r=l?"// initializing":o.code)}},[u,o,r,s,i,a,c,l,d,v]}var bt=class extends z{constructor(e){super(),J(this,e,Xn,Vn,W,{show:0})}},cn=bt;var Fn;function un(){return Fn||=import("./codemirror-NG6LAOB3.js")}function Qn(n){let e,t,r,o,l,s,i,a,c,u,d,v,h,q,S,y;return{c(){e=w("input"),t=T(),r=w("button"),o=w("span"),l=U("remove"),s=T(),i=w("i"),a=T(),c=w("button"),u=w("span"),d=U("(entry\xA0module)"),v=T(),h=w("i"),this.h()},l(_){e=k(_,"INPUT",{placeholder:!0,spellcheck:!0,class:!0}),t=j(_),r=k(_,"BUTTON",{class:!0});var b=E(r);o=k(b,"SPAN",{class:!0});var m=E(o);l=D(m,"remove"),m.forEach(f),s=j(b),i=k(b,"I",{class:!0}),E(i).forEach(f),b.forEach(f),a=j(_),c=k(_,"BUTTON",{class:!0});var M=E(c);u=k(M,"SPAN",{class:!0});var O=E(u);d=D(O,"(entry\xA0module)"),O.forEach(f),v=j(M),h=k(M,"I",{class:!0}),E(h).forEach(f),M.forEach(f),this.h()},h(){p(e,"placeholder","main.js"),p(e,"spellcheck","false"),p(e,"class","svelte-1e3pbc"),p(o,"class","label svelte-1e3pbc"),p(i,"class","i-mdi-close"),p(r,"class","remove svelte-1e3pbc"),p(u,"class","label svelte-1e3pbc"),p(h,"class",q=n[2]?"i-mdi-minus":"i-mdi-plus"),p(c,"class","entry svelte-1e3pbc")},m(_,b){I(_,e,b),le(e,n[0]),I(_,t,b),I(_,r,b),g(r,o),g(o,l),g(r,s),g(r,i),I(_,a,b),I(_,c,b),g(c,u),g(u,d),g(c,v),g(c,h),S||(y=[H(e,"input",n[11]),H(r,"click",n[12]),H(c,"click",n[13])],S=!0)},p(_,b){b&1&&e.value!==_[0]&&le(e,_[0]),b&4&&q!==(q=_[2]?"i-mdi-minus":"i-mdi-plus")&&p(h,"class",q)},d(_){_&&f(e),_&&f(t),_&&f(r),_&&f(a),_&&f(c),S=!1,te(y)}}}function Kn(n){let e;return{c(){e=w("input"),this.h()},l(t){e=k(t,"INPUT",{placeholder:!0,spellcheck:!0,class:!0}),this.h()},h(){p(e,"placeholder","main.js"),p(e,"spellcheck","false"),e.value=n[0],e.readOnly=!0,p(e,"class","svelte-1e3pbc")},m(t,r){I(t,e,r)},p(t,r){r&1&&e.value!==t[0]&&(e.value=t[0])},d(t){t&&f(e)}}}function Zn(n){let e,t,r;return{c(){e=w("textarea"),this.h()},l(o){e=k(o,"TEXTAREA",{class:!0,rows:!0,spellcheck:!0}),E(e).forEach(f),this.h()},h(){p(e,"class","editor svelte-1e3pbc"),p(e,"rows","2"),p(e,"spellcheck","false")},m(o,l){I(o,e,l),le(e,n[1]),t||(r=H(e,"input",n[15]),t=!0)},p(o,l){l&2&&le(e,o[1])},d(o){o&&f(e),t=!1,r()}}}function Gn(n){let e,t,r,o;return{c(){e=w("pre"),this.h()},l(l){e=k(l,"PRE",{class:!0}),E(e).forEach(f),this.h()},h(){p(e,"class","chunk svelte-1e3pbc")},m(l,s){I(l,e,s),r||(o=se(t=Ne.call(null,e,{code:n[1],loader:n[5]})),r=!0)},p(l,s){t&&he(t.update)&&s&34&&t.update.call(null,{code:l[1],loader:l[5]})},d(l){l&&f(e),r=!1,o()}}}function Yn(n){let e,t;return{c(){e=w("div"),t=w("textarea"),this.h()},l(r){e=k(r,"DIV",{class:!0});var o=E(e);t=k(o,"TEXTAREA",{tabindex:!0,class:!0}),E(t).forEach(f),o.forEach(f),this.h()},h(){p(t,"tabindex","0"),t.value=n[1],p(t,"class","svelte-1e3pbc"),p(e,"class","codemirror-container")},m(r,o){I(r,e,o),g(e,t),n[14](t)},p(r,o){o&2&&(t.value=r[1])},d(r){r&&f(e),n[14](null)}}}function xn(n){let e,t,r;function o(u,d){return u[3]?Kn:Qn}let l=o(n,-1),s=l(n);function i(u,d){return ve&&!Ae&&!u[3]?Yn:u[3]?Gn:Zn}let a=i(n,-1),c=a(n);return{c(){e=w("article"),t=w("header"),s.c(),r=T(),c.c(),this.h()},l(u){e=k(u,"ARTICLE",{class:!0});var d=E(e);t=k(d,"HEADER",{class:!0});var v=E(t);s.l(v),v.forEach(f),r=j(d),c.l(d),d.forEach(f),this.h()},h(){p(t,"class","svelte-1e3pbc"),p(e,"class","module svelte-1e3pbc"),Me(e,"is-entry",n[2])},m(u,d){I(u,e,d),g(e,t),s.m(t,null),g(e,r),c.m(e,null)},p(u,[d]){l===(l=o(u,d))&&s?s.p(u,d):(s.d(1),s=l(u),s&&(s.c(),s.m(t,null))),a===(a=i(u,d))&&c?c.p(u,d):(c.d(1),c=a(u),c&&(c.c(),c.m(e,null))),d&4&&Me(e,"is-entry",u[2])},i:ie,o:ie,d(u){u&&f(e),s.d(),c.d()}}}function er(n,e,t){let r;C(n,Y,m=>t(10,r=m));let{name:o=""}=e,{contents:l=""}=e,{isEntry:s=!1}=e,{readonly:i=!1}=e,a,c,u,d=l,v,h=Ie();Se(async()=>{!u||(t(7,{default:a}=await un(),a),t(8,c=a.fromTextArea(u,{lineNumbers:!0,lineWrapping:!0,indentWithTabs:!0,indentUnit:2,tabSize:2,dragDrop:!1,value:l,mode:v==="js"?"javascript":v,readOnly:i})),c.on("change",m=>{t(1,l=m.getValue()),t(9,d=l)}),c.setValue(l))}),st(()=>{c&&c.toTextArea()});function q(){o=this.value,t(0,o)}let S=()=>h("remove"),y=()=>t(2,s=!s);function _(m){we[m?"unshift":"push"](()=>{u=m,t(4,u)})}function b(){l=this.value,t(1,l)}return n.$$set=m=>{"name"in m&&t(0,o=m.name),"contents"in m&&t(1,l=m.contents),"isEntry"in m&&t(2,s=m.isEntry),"readonly"in m&&t(3,i=m.readonly)},n.$$.update=()=>{if(n.$$.dirty&1){e:t(5,v=o.endsWith(".css")?"css":o.endsWith(".map")?"json":"js")}if(n.$$.dirty&385){e:if(a&&c&&o){let m=/.+\.([^.]+)$/.exec(o),M=a.findModeByExtension(m&&m[1]||"js");M&&c.setOption("mode",M.mime)}}if(n.$$.dirty&770){e:d!==l&&c&&(t(9,d=l),c.setValue(l))}if(n.$$.dirty&1280){e:r&&c&&Te().then(c.refresh.bind(c))}},[o,l,s,i,u,v,h,a,c,d,r,q,S,y,_,b]}var vt=class extends z{constructor(e){super(),J(this,e,er,xn,W,{name:0,contents:1,isEntry:2,readonly:3})}},yt=vt;function fn(n,e,t){let r=n.slice();return r[14]=e[t],r[17]=e,r[18]=t,r}function pn(n,e,t){let r=n.slice();return r[14]=e[t],r}function mn(n){let e,t,r,o,l;function s(d){n[9](d,n[14])}function i(d){n[10](d,n[14])}function a(d){n[11](d,n[14])}function c(){return n[12](n[18])}let u={};return n[14].name!==void 0&&(u.name=n[14].name),n[14].contents!==void 0&&(u.contents=n[14].contents),n[14].isEntry!==void 0&&(u.isEntry=n[14].isEntry),e=new yt({props:u}),we.push(()=>He(e,"name",s)),we.push(()=>He(e,"contents",i)),we.push(()=>He(e,"isEntry",a)),e.$on("remove",c),{c(){X(e.$$.fragment)},l(d){K(e.$$.fragment,d)},m(d,v){F(e,d,v),l=!0},p(d,v){n=d;let h={};!t&&v&16&&(t=!0,h.name=n[14].name,De(()=>t=!1)),!r&&v&16&&(r=!0,h.contents=n[14].contents,De(()=>r=!1)),!o&&v&16&&(o=!0,h.isEntry=n[14].isEntry,De(()=>o=!1)),e.$set(h)},i(d){l||(P(e.$$.fragment,d),l=!0)},o(d){B(e.$$.fragment,d),l=!1},d(d){Q(e,d)}}}function tr(n){let e,t,r,o,l,s,i,a,c,u,d,v,h,q,S,y,_,b=n[4],m=[];for(let O=0;O<b.length;O+=1)m[O]=mn(fn(n,b,O));let M=O=>B(m[O],1,1,()=>{m[O]=null});return{c(){e=w("section"),t=w("h3"),r=w("span"),o=U("ES6 modules go in\u2026"),l=T(),s=w("button"),i=U("Start over"),a=T();for(let O=0;O<m.length;O+=1)m[O].c();c=T(),u=w("button"),d=w("i"),v=T(),h=w("span"),q=U("add module"),this.h()},l(O){e=k(O,"SECTION",{slot:!0,class:!0});var $=E(e);t=k($,"H3",{class:!0});var L=E(t);r=k(L,"SPAN",{class:!0});var G=E(r);o=D(G,"ES6 modules go in\u2026"),G.forEach(f),l=j(L),s=k(L,"BUTTON",{class:!0});var me=E(s);i=D(me,"Start over"),me.forEach(f),L.forEach(f),a=j($);for(let oe=0;oe<m.length;oe+=1)m[oe].l($);c=j($),u=k($,"BUTTON",{class:!0});var de=E(u);d=k(de,"I",{class:!0}),E(d).forEach(f),v=j(de),h=k(de,"SPAN",{});var ee=E(h);q=D(ee,"add module"),ee.forEach(f),de.forEach(f),$.forEach(f),this.h()},h(){p(r,"class","svelte-1efahfh"),p(s,"class","svelte-1efahfh"),p(t,"class","svelte-1efahfh"),p(d,"class","i-mdi-plus"),p(u,"class","svelte-1efahfh"),p(e,"slot","left"),p(e,"class","input")},m(O,$){I(O,e,$),g(e,t),g(t,r),g(r,o),g(t,l),g(t,s),g(s,i),g(e,a);for(let L=0;L<m.length;L+=1)m[L].m(e,null);g(e,c),g(e,u),g(u,d),g(u,v),g(u,h),g(h,q),S=!0,y||(_=[H(s,"click",n[6]),H(u,"click",n[8])],y=!0)},p(O,$){if($&144){b=O[4];let L;for(L=0;L<b.length;L+=1){let G=fn(O,b,L);m[L]?(m[L].p(G,$),P(m[L],1)):(m[L]=mn(G),m[L].c(),P(m[L],1),m[L].m(e,c))}for(fe(),L=b.length;L<m.length;L+=1)M(L);pe()}},i(O){if(!S){for(let $=0;$<b.length;$+=1)P(m[$]);S=!0}},o(O){m=m.filter(Boolean);for(let $=0;$<m.length;$+=1)B(m[$]);S=!1},d(O){O&&f(e),Oe(m,O),y=!1,te(_)}}}function nr(n){let e;return{c(){e=U("bundle comes")},l(t){e=D(t,"bundle comes")},m(t,r){I(t,e,r)},d(t){t&&f(e)}}}function rr(n){let e;return{c(){e=U("chunks come")},l(t){e=D(t,"chunks come")},m(t,r){I(t,e,r)},d(t){t&&f(e)}}}function dn(n){let e,t,r=n[1].files,o=[];for(let s=0;s<r.length;s+=1)o[s]=hn(pn(n,r,s));let l=s=>B(o[s],1,1,()=>{o[s]=null});return{c(){for(let s=0;s<o.length;s+=1)o[s].c();e=ce()},l(s){for(let i=0;i<o.length;i+=1)o[i].l(s);e=ce()},m(s,i){for(let a=0;a<o.length;a+=1)o[a].m(s,i);I(s,e,i),t=!0},p(s,i){if(i&2){r=s[1].files;let a;for(a=0;a<r.length;a+=1){let c=pn(s,r,a);o[a]?(o[a].p(c,i),P(o[a],1)):(o[a]=hn(c),o[a].c(),P(o[a],1),o[a].m(e.parentNode,e))}for(fe(),a=r.length;a<o.length;a+=1)l(a);pe()}},i(s){if(!t){for(let i=0;i<r.length;i+=1)P(o[i]);t=!0}},o(s){o=o.filter(Boolean);for(let i=0;i<o.length;i+=1)B(o[i]);t=!1},d(s){Oe(o,s),s&&f(e)}}}function hn(n){let e,t;return e=new yt({props:{name:n[14].name.replace(/^\//,""),contents:n[14].contents,readonly:!0}}),{c(){X(e.$$.fragment)},l(r){K(e.$$.fragment,r)},m(r,o){F(e,r,o),t=!0},p(r,o){let l={};o&2&&(l.name=r[14].name.replace(/^\//,"")),o&2&&(l.contents=r[14].contents),e.$set(l)},i(r){t||(P(e.$$.fragment,r),t=!0)},o(r){B(e.$$.fragment,r),t=!1},d(r){Q(e,r)}}}function _n(n){let e;return{c(){e=w("pre"),this.h()},l(t){e=k(t,"PRE",{class:!0});var r=E(e);r.forEach(f),this.h()},h(){p(e,"class","result error svelte-1efahfh")},m(t,r){I(t,e,r),e.innerHTML=n[5]},p(t,r){r&32&&(e.innerHTML=t[5])},d(t){t&&f(e)}}}function or(n){let e,t,r,o,l,s,i,a,c,u;function d(b,m){return b[3]?rr:nr}let v=d(n,-1),h=v(n);var q=n[2];function S(b){return{}}q&&(i=new q(S(n)));let y=n[1].files&&dn(n),_=n[5]&&_n(n);return{c(){e=w("section"),t=w("h3"),r=w("span"),o=U("\u2026"),h.c(),l=U(" out"),s=T(),i&&X(i.$$.fragment),a=T(),y&&y.c(),c=T(),_&&_.c(),this.h()},l(b){e=k(b,"SECTION",{slot:!0,class:!0});var m=E(e);t=k(m,"H3",{class:!0});var M=E(t);r=k(M,"SPAN",{class:!0});var O=E(r);o=D(O,"\u2026"),h.l(O),l=D(O," out"),O.forEach(f),M.forEach(f),s=j(m),i&&K(i.$$.fragment,m),a=j(m),y&&y.l(m),c=j(m),_&&_.l(m),m.forEach(f),this.h()},h(){p(r,"class","svelte-1efahfh"),p(t,"class","svelte-1efahfh"),p(e,"slot","right"),p(e,"class","output")},m(b,m){I(b,e,m),g(e,t),g(t,r),g(r,o),h.m(r,null),g(r,l),g(e,s),i&&F(i,e,null),g(e,a),y&&y.m(e,null),g(e,c),_&&_.m(e,null),u=!0},p(b,m){if(v!==(v=d(b,m))&&(h.d(1),h=v(b),h&&(h.c(),h.m(r,l))),q!==(q=b[2])){if(i){fe();let M=i;B(M.$$.fragment,1,0,()=>{Q(M,1)}),pe()}q?(i=new q(S(b)),X(i.$$.fragment),P(i.$$.fragment,1),F(i,e,a)):i=null}b[1].files?y?(y.p(b,m),m&2&&P(y,1)):(y=dn(b),y.c(),P(y,1),y.m(e,c)):y&&(fe(),B(y,1,1,()=>{y=null}),pe()),b[5]?_?_.p(b,m):(_=_n(b),_.c(),_.m(e,null)):_&&(_.d(1),_=null)},i(b){u||(i&&P(i.$$.fragment,b),P(y),u=!0)},o(b){i&&B(i.$$.fragment,b),B(y),u=!1},d(b){b&&f(e),h.d(),i&&Q(i),y&&y.d(),_&&_.d()}}}function sr(n){let e,t;return e=new Ze({props:{show:n[0],$$slots:{right:[or],left:[tr]},$$scope:{ctx:n}}}),{c(){X(e.$$.fragment)},l(r){K(e.$$.fragment,r)},m(r,o){F(e,r,o),t=!0},p(r,[o]){let l={};o&1&&(l.show=r[0]),o&524350&&(l.$$scope={dirty:o,ctx:r}),e.$set(l)},i(r){t||(P(e.$$.fragment,r),t=!0)},o(r){B(e.$$.fragment,r),t=!1},d(r){Q(e,r)}}}function lr(n,e,t){let r,o,l,s;C(n,Z,_=>t(4,o=_)),C(n,Xe,_=>t(1,l=_)),C(n,Vt,_=>t(5,s=_));let i,{show:a=!0}=e,c=1;function u(){ae(Z,o=[{name:"main.js",contents:"export let a = 1",isEntry:!0}],o)}function d(_){ae(Z,o=o.filter((b,m)=>_!==m),o)}function v(){o.length===0?ae(Z,o=[{name:"main.js",contents:"export let a = 1",isEntry:!0}],o):ae(Z,o=[...o,{name:`module_${c++}.js`,contents:"",isEntry:!1}],o),Te().then(()=>{let _=document.querySelectorAll(".input .editor"),b=_[_.length-1];b&&b.focus()})}Se(async()=>{t(2,i=(await import("./BuildOptions-5YX22LY6.js")).default)});function h(_,b){n.$$.not_equal(b.name,_)&&(b.name=_,Z.set(o))}function q(_,b){n.$$.not_equal(b.contents,_)&&(b.contents=_,Z.set(o))}function S(_,b){n.$$.not_equal(b.isEntry,_)&&(b.isEntry=_,Z.set(o))}let y=_=>d(_);return n.$$set=_=>{"show"in _&&t(0,a=_.show)},n.$$.update=()=>{if(n.$$.dirty&2){e:t(3,r=l.files&&l.files.length>1)}},[a,l,i,r,o,s,u,d,v,h,q,S,y]}var wt=class extends z{constructor(e){super(),J(this,e,lr,sr,W,{show:0})}},gn=wt;function ir(n){let e,t,r,o,l;return t=new cn({props:{show:n[0]==="transform"}}),o=new gn({props:{show:n[0]==="build"}}),{c(){e=w("main"),X(t.$$.fragment),r=T(),X(o.$$.fragment),this.h()},l(s){e=k(s,"MAIN",{"data-mode":!0});var i=E(e);K(t.$$.fragment,i),r=j(i),K(o.$$.fragment,i),i.forEach(f),this.h()},h(){p(e,"data-mode",n[0])},m(s,i){I(s,e,i),F(t,e,null),g(e,r),F(o,e,null),l=!0},p(s,[i]){let a={};i&1&&(a.show=s[0]==="transform"),t.$set(a);let c={};i&1&&(c.show=s[0]==="build"),o.$set(c),(!l||i&1)&&p(e,"data-mode",s[0])},i(s){l||(P(t.$$.fragment,s),P(o.$$.fragment,s),l=!0)},o(s){B(t.$$.fragment,s),B(o.$$.fragment,s),l=!1},d(s){s&&f(e),Q(t),Q(o)}}}function ar(n,e,t){let r;return C(n,Y,o=>t(0,r=o)),[r]}var kt=class extends z{constructor(e){super(),J(this,e,ar,ir,W,{})}},bn=kt;function qe(n,{delay:e=0,duration:t=400,easing:r=xe}={}){let o=+getComputedStyle(n).opacity;return{delay:e,duration:t,easing:r,css:l=>`opacity: ${l*o}`}}function vn(n){let e,t;return{c(){e=w("i"),this.h()},l(r){e=k(r,"I",{class:!0}),E(e).forEach(f),this.h()},h(){p(e,"class","i-mdi-loading svelte-9g49lf")},m(r,o){I(r,e,o)},i(r){t||Ue(()=>{t=Ut(e,qe,{}),t.start()})},o:ie,d(r){r&&f(e)}}}function cr(n){let e,t,r,o,l,s,i,a=n[0]&&vn(n);return{c(){e=w("footer"),a&&a.c(),t=T(),r=w("span"),o=U(n[1]),this.h()},l(c){e=k(c,"FOOTER",{class:!0});var u=E(e);a&&a.l(u),t=j(u),r=k(u,"SPAN",{});var d=E(r);o=D(d,n[1]),d.forEach(f),u.forEach(f),this.h()},h(){p(e,"class","svelte-9g49lf")},m(c,u){I(c,e,u),a&&a.m(e,null),g(e,t),g(e,r),g(r,o),s||(i=se(l=ur.call(null,r,n[0])),s=!0)},p(c,[u]){c[0]?a?u&1&&P(a,1):(a=vn(c),a.c(),P(a,1),a.m(e,t)):a&&(a.d(1),a=null),u&2&&ye(o,c[1]),l&&he(l.update)&&u&1&&l.update.call(null,c[0])},i(c){P(a)},o:ie,d(c){c&&f(e),a&&a.d(),s=!1,i()}}}function ur(n,e){return{update(t){if(e!==t){let r=n.animate([{marginLeft:e?"20px":"-20px"},{marginLeft:"initial"}],{duration:400,easing:"ease-out"});r.finished.then(r.cancel.bind(r)),r.playbackRate=1.000001,e=t}}}}function fr(n,e,t){let r,o;return C(n,We,l=>t(0,r=l)),C(n,Je,l=>t(1,o=l)),[r,o]}var Et=class extends z{constructor(e){super(),J(this,e,fr,cr,W,{})}},yn=Et;function wn(n){let e,t=JSON.stringify(n[1],null,2)+"",r,o,l;return{c(){e=w("pre"),r=U(t),this.h()},l(s){e=k(s,"PRE",{class:!0});var i=E(e);r=D(i,t),i.forEach(f),this.h()},h(){p(e,"class","svelte-wpb3rw")},m(s,i){I(s,e,i),g(e,r),l=!0},p(s,i){(!l||i&2)&&t!==(t=JSON.stringify(s[1],null,2)+"")&&ye(r,t)},i(s){l||(Ue(()=>{o||(o=lt(e,qe,{duration:50},!0)),o.run(1)}),l=!0)},o(s){o||(o=lt(e,qe,{duration:50},!1)),o.run(0),l=!1},d(s){s&&f(e),s&&o&&o.end()}}}function pr(n){let e,t,r,o,l,s,i=n[0]&&wn(n);return{c(){i&&i.c(),e=T(),t=w("button"),r=U("Debug"),this.h()},l(a){i&&i.l(a),e=j(a),t=k(a,"BUTTON",{"aria-checked":!0,class:!0});var c=E(t);r=D(c,"Debug"),c.forEach(f),this.h()},h(){p(t,"aria-checked",n[0]),p(t,"class","svelte-wpb3rw")},m(a,c){i&&i.m(a,c),I(a,e,c),I(a,t,c),g(t,r),o=!0,l||(s=H(t,"click",n[9]),l=!0)},p(a,[c]){a[0]?i?(i.p(a,c),c&1&&P(i,1)):(i=wn(a),i.c(),P(i,1),i.m(e.parentNode,e)):i&&(fe(),B(i,1,1,()=>{i=null}),pe()),(!o||c&1)&&p(t,"aria-checked",a[0])},i(a){o||(P(i),o=!0)},o(a){B(i),o=!1},d(a){i&&i.d(a),a&&f(e),a&&f(t),l=!1,s()}}}function mr(n,e,t){let r,o,l,s,i,a,c,u;C(n,Xe,h=>t(2,o=h)),C(n,ke,h=>t(3,l=h)),C(n,Z,h=>t(4,s=h)),C(n,Pe,h=>t(5,i=h)),C(n,re,h=>t(6,a=h)),C(n,ne,h=>t(7,c=h)),C(n,Y,h=>t(8,u=h));let d=!1,v=()=>t(0,d=!d);return n.$$.update=()=>{if(n.$$.dirty&508){e:t(1,r={$mode:u,Transform:{$input:c,$options:a,$optionsObj:i},Build:{$modules:s,$buildOptions:l,$outputs:o}})}},[d,r,o,l,s,i,a,c,u,v]}var Ot=class extends z{constructor(e){super(),J(this,e,mr,pr,W,{})}},kn=Ot;function En(n){let e,t;return e=new kn({}),{c(){X(e.$$.fragment)},l(r){K(e.$$.fragment,r)},m(r,o){F(e,r,o),t=!0},i(r){t||(P(e.$$.fragment,r),t=!0)},o(r){B(e.$$.fragment,r),t=!1},d(r){Q(e,r)}}}function dr(n){let e,t,r,o,l,s,i,a;e=new tn({}),r=new bn({}),l=new yn({});let c=n[0]&&En(n);return{c(){X(e.$$.fragment),t=T(),X(r.$$.fragment),o=T(),X(l.$$.fragment),s=T(),c&&c.c(),i=ce()},l(u){K(e.$$.fragment,u),t=j(u),K(r.$$.fragment,u),o=j(u),K(l.$$.fragment,u),s=j(u),c&&c.l(u),i=ce()},m(u,d){F(e,u,d),I(u,t,d),F(r,u,d),I(u,o,d),F(l,u,d),I(u,s,d),c&&c.m(u,d),I(u,i,d),a=!0},p(u,[d]){u[0]?c?d&1&&P(c,1):(c=En(u),c.c(),P(c,1),c.m(i.parentNode,i)):c&&(fe(),B(c,1,1,()=>{c=null}),pe())},i(u){a||(P(e.$$.fragment,u),P(r.$$.fragment,u),P(l.$$.fragment,u),P(c),a=!0)},o(u){B(e.$$.fragment,u),B(r.$$.fragment,u),B(l.$$.fragment,u),B(c),a=!1},d(u){Q(e,u),u&&f(t),Q(r,u),u&&f(o),Q(l,u),u&&f(s),c&&c.d(u),u&&f(i)}}}function hr(n,e,t){let r;return C(n,Ve,o=>t(0,r=o)),[r]}var Mt=class extends z{constructor(e){super(),J(this,e,hr,dr,W,{})}},On=Mt;Object.assign(window,{app:new On({target:document.querySelector("#app"),hydrate:!0})});console.debug("variables for debug: window.{ esbuild, stores, app }");
//# sourceMappingURL=main.js.map
