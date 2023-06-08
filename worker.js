var f=class{constructor(e){let i=e.s===0?e.Z.length:0,n=e.N.getTime(),s=e.j.getTime();this.dev=1,this.ino=e.X,this.mode=e.s===0?32768:16384,this.nlink=1,this.uid=1,this.gid=1,this.rdev=0,this.size=i,this.blksize=4096,this.blocks=i+(4096-1)&4096-1,this.atimeMs=n,this.mtimeMs=n,this.ctimeMs=s,this.birthtimeMs=s,this.atime=e.N,this.mtime=e.N,this.ctime=e.j,this.birthtime=e.j}isDirectory(){return this.mode===16384}isFile(){return this.mode===32768}},D=b("EBADF"),F=b("EINVAL"),T=b("EISDIR"),z=b("ENOENT"),A=b("ENOTDIR"),p=new Map,C=new TextEncoder,L=new TextDecoder,v=S(),k=3,P=1,h="",x,B;function $(t,e,r,i,n){if(t<=2)t===2?U(e,r,i):x(t,e,r,i,n);else throw F}function W(t,e,r,i,n,s){if(t<=2)B(t,e,r,i,n,s);else{let o=p.get(t);if(!o)s(D,0,e);else if(o.z.s===1)s(T,0,e);else{let c=o.z.Z;if(n!==null&&n!==-1){let l=c.slice(n,n+i);e.set(l,r),s(null,l.length,e)}else{let l=c.slice(o.W,o.W+i);o.W+=l.length,e.set(l,r),s(null,l.length,e)}}}}function I(t){throw new Error(JSON.stringify(t)+" cannot be both a file and a directory")}function M(t){v.F.clear(),h="";for(let e in t){let r=N(O(e)),i=v;for(let s=0;s+1<r.length;s++){let o=r[s],c=i.F.get(o);c?c.s!==1&&I(o):(c=S(),i.F.set(o,c)),i=c}let n=r[r.length-1];i.F.has(n)&&I(n),i.F.set(n,j(C.encode(t[e])))}}globalThis.fs={get writeSync(){return $},set writeSync(t){x=t},get read(){return W},set read(t){B=t},constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},open(t,e,r,i){try{let n=y(t),s=k++;p.set(s,{z:n,W:0}),i(null,s)}catch(n){i(n,null)}},close(t,e){e(p.delete(t)?null:D)},write(t,e,r,i,n,s){t<=2?(t===2?U(e,r,i):x(t,e,r,i,n),s(null,i,e)):s(F,0,e)},readdir(t,e){try{let r=y(t);if(r.s!==1)throw A;e(null,[...r.F.keys()])}catch(r){e(r,null)}},stat(t,e){try{let r=y(t);e(null,new f(r))}catch(r){e(r,null)}},lstat(t,e){try{let r=y(t);e(null,new f(r))}catch(r){e(r,null)}},fstat(t,e){let r=p.get(t);r?e(null,new f(r.z)):e(D,null)}};function j(t){let e=new Date;return{s:0,X:P++,j:e,N:e,Z:t}}function S(){let t=new Date;return{s:1,X:P++,j:t,N:t,F:new Map}}function O(t){t[0]!=="/"&&(t="/"+t);let e=t.split("/");e.shift();let r=0;for(let i=0;i<e.length;i++){let n=e[i];n===".."?r&&r--:n!=="."&&n!==""&&(e[r++]=n)}return e.length=r,"/"+e.join("/")}function N(t){if(t=O(t),t==="/")return[];let e=t.split("/");return e.shift(),e}function y(t){let e=N(t),r=v;for(let i=0,n=e.length;i<n;i++){let s=r.F.get(e[i]);if(!s)throw z;if(s.s===0){if(i+1===n)return s;throw A}r=s}return r}function b(t){let e=new Error(t);return e.code=t,e}function U(t,e,r){h+=L.decode(e===0&&r===t.length?t:t.slice(e,e+r))}var K=async([t,e])=>{let[r,i,n]=t.split(".").map(c=>+c),s=r===0&&(i===5&&n>=20||i>=6&&i<=7||i===8&&n<=34),o={wasmURL:URL.createObjectURL(new Blob([e],{type:"application/wasm"}))};return s||(o.worker=!1),esbuild.startService?await esbuild.startService(o):await esbuild.initialize(o),await esbuild.transform("let a = 1").catch(()=>{}),esbuild},w=typeof performance<"u"?performance:Date,R=(t,e,r)=>{if(t.formatMessages)return t.formatMessages(e,r);let i=(n,s,o)=>{let c=n==="note"?"   ":"\x1B[1m > ";if(o&&(c+=`${o.file}:${o.line}:${o.column}: `),c+=n==="error"?"\x1B[31merror:\x1B[1m ":n==="warning"?"\x1B[35mwarning:\x1B[1m ":"\x1B[1mnote:\x1B[0m ",c+=s+`\x1B[0m
`,o){let{line:l,column:a,length:u,lineText:m}=o,d=l.toString().padStart(5);c+=`\x1B[37m${d} \u2502 ${m.slice(0,a)}\x1B[32m${m.slice(a,a+u)}\x1B[37m${m.slice(a+u)}
${" ".repeat(d.length)} \u2575 \x1B[32m${" ".repeat(a)}${u>1?"~".repeat(u):"^"}\x1B[0m
`}return c};return Promise.resolve(e.map(n=>{let s=i(r.kind,n.text,n.location);for(let o of n.notes||[])s+=i("note",o.text,o.location);return s+`
`}))},q=function(t){let e=(l,a)=>{let u=a&&a.errors,m=a&&a.warnings;!u&&!m&&(u=[{text:a+""}]),Promise.all([u?R(this,u,{kind:"error",color:c}):[],m?R(this,m,{kind:"warning",color:c}):[]]).then(([d,g])=>{l({k:[...d,...g].join("")})})},r=(l,a)=>{for(let u of l){let m=a.replace(u,"");if(m!==a)a=m;else{let d=u.replace(/\x1B\[[^m]*m/g,"");d!==u&&(a=a.replace(d,""))}}return l.join("")+a},i=(l,a)=>{l.length?R(this,l,{kind:"warning",color:c}).then(u=>a(r(u,h))):a(h)},n=t.data,s=postMessage,o,c=!0;try{n.D==="transform"?(n.A.color===!1&&(c=!1),M({}),o=w.now(),this.transform(n.U,n.A).then(({code:l,map:a,js:u,jsSourceMap:m,warnings:d,mangleCache:g,legalComments:E})=>i(d,_=>s({M:l??u,I:a??m,T:g,R:E,k:_,q:w.now()-o})),l=>e(s,l))):n.D==="build"&&(n.A.color===!1&&(c=!1),M(n.U),o=w.now(),this.build(n.A).then(({warnings:l,outputFiles:a,metafile:u,mangleCache:m})=>i(l,d=>s({O:a.map(({path:g,text:E})=>({path:g,text:E})),P:u,T:m,k:d,q:w.now()-o})),l=>e(s,l)))}catch(l){e(s,l)}};onmessage=async t=>{try{let e=await K(t.data);onmessage=q.bind(e),postMessage({K:"success"})}catch(e){console.error(e),postMessage({K:"failure",te:e+""})}};
//# sourceMappingURL=worker.js.map
