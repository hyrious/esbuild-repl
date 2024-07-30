var h=class{constructor(e){let i=e.s===0?e.Z.length:0,r=e.N.getTime(),s=e.P.getTime();this.dev=1,this.ino=e.Q,this.mode=e.s===0?32768:16384,this.nlink=1,this.uid=1,this.gid=1,this.rdev=0,this.size=i,this.blksize=4096,this.blocks=i+4095&4095,this.atimeMs=r,this.mtimeMs=r,this.ctimeMs=s,this.birthtimeMs=s,this.atime=e.N,this.mtime=e.N,this.ctime=e.P,this.birthtime=e.P}isDirectory(){return this.mode===16384}isFile(){return this.mode===32768}},D=b("EBADF"),F=b("EINVAL"),T=b("EISDIR"),z=b("ENOENT"),A=b("ENOTDIR"),p=new Map,C=new TextEncoder,L=new TextDecoder,v=S(),k=3,P=1,g="",x,B;function $(t,e,n,i,r){if(t<=2)t===2?U(e,n,i):x(t,e,n,i,r);else throw F}function W(t,e,n,i,r,s){if(t<=2)B(t,e,n,i,r,s);else{let l=p.get(t);if(!l)s(D,0,e);else if(l.J.s===1)s(T,0,e);else{let u=l.J.Z;if(r!==null&&r!==-1){let o=u.slice(r,r+i);e.set(o,n),s(null,o.length,e)}else{let o=u.slice(l.W,l.W+i);l.W+=o.length,e.set(o,n),s(null,o.length,e)}}}}function I(t){throw new Error(JSON.stringify(t)+" cannot be both a file and a directory")}function M(t){v.M.clear(),g="";for(let e in t){let n=N(O(e)),i=v;for(let s=0;s+1<n.length;s++){let l=n[s],u=i.M.get(l);u?u.s!==1&&I(l):(u=S(),i.M.set(l,u)),i=u}let r=n[n.length-1];i.M.has(r)&&I(r),i.M.set(r,K(C.encode(t[e])))}}globalThis.fs={get writeSync(){return $},set writeSync(t){x=t},get read(){return W},set read(t){B=t},constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},open(t,e,n,i){try{let r=y(t),s=k++;p.set(s,{J:r,W:0}),i(null,s)}catch(r){i(r,null)}},close(t,e){e(p.delete(t)?null:D)},write(t,e,n,i,r,s){t<=2?(t===2?U(e,n,i):x(t,e,n,i,r),s(null,i,e)):s(F,0,e)},readdir(t,e){try{let n=y(t);if(n.s!==1)throw A;e(null,[...n.M.keys()])}catch(n){e(n,null)}},stat(t,e){try{let n=y(t);e(null,new h(n))}catch(n){e(n,null)}},lstat(t,e){try{let n=y(t);e(null,new h(n))}catch(n){e(n,null)}},fstat(t,e){let n=p.get(t);n?e(null,new h(n.J)):e(D,null)}};function K(t){let e=new Date;return{s:0,Q:P++,P:e,N:e,Z:t}}function S(){let t=new Date;return{s:1,Q:P++,P:t,N:t,M:new Map}}function O(t){t[0]!=="/"&&(t="/"+t);let e=t.split("/");e.shift();let n=0;for(let i=0;i<e.length;i++){let r=e[i];r===".."?n&&n--:r!=="."&&r!==""&&(e[n++]=r)}return e.length=n,"/"+e.join("/")}function N(t){if(t=O(t),t==="/")return[];let e=t.split("/");return e.shift(),e}function y(t){let e=N(t),n=v;for(let i=0,r=e.length;i<r;i++){let s=n.M.get(e[i]);if(!s)throw z;if(s.s===0){if(i+1===r)return s;throw A}n=s}return n}function b(t){let e=new Error(t);return e.code=t,e}function U(t,e,n){g+=L.decode(e===0&&n===t.length?t:t.slice(e,e+n))}var j=async([t,e])=>{let[n,i,r]=t.split(".").map(u=>+u),s=n===0&&(i===5&&r>=20||i>=6&&i<=7||i===8&&r<=34),l={wasmURL:URL.createObjectURL(new Blob([e],{type:"application/wasm"}))};return s||(l.worker=!1),esbuild.startService?await esbuild.startService(l):await esbuild.initialize(l),esbuild.transform&&await esbuild.transform("let a = 1").catch(()=>{}),esbuild},w=typeof performance<"u"?performance:Date,R=(t,e,n)=>{if(t.formatMessages)return t.formatMessages(e,n);let i=(r,s,l)=>{let u=r==="note"?"   ":"\x1B[1m > ";if(l&&(u+=`${l.file}:${l.line}:${l.column}: `),u+=r==="error"?"\x1B[31merror:\x1B[1m ":r==="warning"?"\x1B[35mwarning:\x1B[1m ":"\x1B[1mnote:\x1B[0m ",u+=s+`\x1B[0m
`,l){let{line:o,column:a,length:c,lineText:m}=l,d=o.toString().padStart(5);u+=`\x1B[37m${d} \u2502 ${m.slice(0,a)}\x1B[32m${m.slice(a,a+c)}\x1B[37m${m.slice(a+c)}
${" ".repeat(d.length)} \u2575 \x1B[32m${" ".repeat(a)}${c>1?"~".repeat(c):"^"}\x1B[0m
`}return u};return Promise.resolve(e.map(r=>{let s=i(n.kind,r.text,r.location);for(let l of r.notes||[])s+=i("note",l.text,l.location);return s+`
`}))},q=function(t){let e=(o,a)=>{let c=a&&a.errors,m=a&&a.warnings;!c&&!m&&(c=[{text:a+""}]),Promise.all([c?R(this,c,{kind:"error",color:u}):[],m?R(this,m,{kind:"warning",color:u}):[]]).then(([d,f])=>{o({j:n([...d,...f],g)})})},n=(o,a)=>{for(let c=0;c<o.length;++c)if(a.includes(o[c]))o[c]="";else{let m=o[c].replace(/\x1B\[[^m]*m/g,""),d=a.indexOf(m);d>=0&&(a=a.slice(0,d)+o[c]+a.slice(d+m.length),o[c]="")}return o.filter(Boolean).join("")+a},i=(o,a)=>{o.length?R(this,o,{kind:"warning",color:u}).then(c=>a(n(c,g))):a(g)},r=t.data,s=postMessage,l,u=!0;try{r.D==="transform"?(r.L.color===!1&&(u=!1),M({}),l=w.now(),this.transform(r.U,r.L).then(({code:o,map:a,js:c,jsSourceMap:m,warnings:d,mangleCache:f,legalComments:E})=>i(d,_=>s({$:o??c,C:a??m,O:f,R:E,j:_,B:w.now()-l})),o=>e(s,o))):r.D==="build"&&(r.L.color===!1&&(u=!1),M(r.U),l=w.now(),this.build(r.L).then(({warnings:o,outputFiles:a,metafile:c,mangleCache:m})=>i(o,d=>s({I:a.map(({path:f,contents:E})=>({path:f,contents:E})),S:c,O:m,j:d,B:w.now()-l})),o=>e(s,o)))}catch(o){e(s,o)}};onmessage=async t=>{try{let e=await j(t.data);onmessage=q.bind(e),postMessage({K:"success"})}catch(e){console.error(e),postMessage({K:"failure",ne:e+""})}};
//# sourceMappingURL=worker.js.map
