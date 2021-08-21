!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const s of e)if("childList"===s.type)for(const e of s.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const e={},t=e=>document.querySelector(e);const s="https://cdn.jsdelivr.net/npm/esbuild-wasm",n=e=>`${s}@${e}/esm/browser.js`,o=e=>`${s}@${e}/esbuild.wasm`;let i;const r={async fetchVersion(){const e=(await fetch("https://data.jsdelivr.com/v1/package/npm/esbuild-wasm").then((e=>e.json()))).tags.latest;return localStorage.setItem("esbuild-repl",`${e}:${Date.now()}`),e},async version(){const e=localStorage.getItem("esbuild-repl");if(e){const[t,s]=e.split(":",2);if(Date.now()-+s<864e5)return t}return this.fetchVersion()},async esbuild(t){var s,r;i=await(s=()=>import(n(t)),r=[],r&&0!==r.length?Promise.all(r.map((t=>{if((t=`${t}`)in e)return;e[t]=!0;const s=t.endsWith(".css"),n=s?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${t}"]${n}`))return;const o=document.createElement("link");return o.rel=s?"stylesheet":"modulepreload",s||(o.as="script",o.crossOrigin=""),o.href=t,document.head.appendChild(o),s?new Promise(((e,t)=>{o.addEventListener("load",e),o.addEventListener("error",t)})):void 0}))).then((()=>s())):s()),await i.initialize({wasmURL:o(t)})},dashize:e=>e.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),camelize:e=>e.replace(/-([a-z])/g,(e=>e.substring(1).toUpperCase())),cfg2cli(e){const t=[];for(const s in e){const n=e[s];if(Array.isArray(n))for(const e of n)t.push(`--${this.dashize(s)}:${e}`);else if(n instanceof Object)for(const[e,o]of Object.entries(n))t.push(`--${this.dashize(s)}:${e}=${o}`);else!0===n?t.push(`--${this.dashize(s)}`):t.push(`--${this.dashize(s)}=${n}`)}return t.join(" ")},cli2cfg(e){var t,s;const n={};for(const o of e.split(/\s+/)){if(!o.startsWith("--"))continue;const e=o.substring(2),i=e.indexOf(":"),r=e.indexOf("=");if(-1===i&&-1===r)n[this.camelize(e)]=!0;else if(-1!==i&&i<r){const s=e.substring(0,i),[o,r]=e.substring(i+1).split("=",2);n[t=this.camelize(s)]||(n[t]={}),n[this.camelize(s)][o]=r}else if(-1!==i&&-1===r){const[t,o]=e.split(":",2);n[s=this.camelize(t)]||(n[s]=[]),n[this.camelize(t)].push(o)}else{const[t,s]=e.split("=",2),o={true:!0,false:!1}[s]||s;n[this.camelize(t)]=o}}return n},loadQuery(){const e=new URLSearchParams(location.search.slice(1)),t=e.get("version"),s=e.get("shareable");let n=null;if(s)try{n=JSON.parse(decodeURIComponent(atob(s)))}catch{}return{version:t,shareable:n}},updateQuery(e,t){const s=new URLSearchParams;s.set("version",e),s.set("shareable",btoa(encodeURIComponent(JSON.stringify(t))));const n=location.origin+location.pathname+"?"+s.toString();history.pushState({path:n},"",n)},showError(e){const s=t("#error");s.style.display="",s.textContent=e},hideError(){t("#error").style.display="none"}};(async function(){var e,s,n,o;const a=r.loadQuery();console.log(a),t("#theme").addEventListener("click",(()=>{document.body.classList.toggle("light")}));const l=a.version||await r.version();t("#version").textContent=l,await r.esbuild(l),function(e,t=200){e.classList.add("leave","leave-active"),requestAnimationFrame((()=>{e.classList.remove("leave"),e.classList.add("leave-to")})),setTimeout((()=>e.remove()),t)}(t("#mask")),window.esbuild=i;let c=t("#config"),d=t("#output"),u=t("#editor");null!=(null==(e=a.shareable)?void 0:e.config)&&(c.value=r.cfg2cli(null==(s=a.shareable)?void 0:s.config)),null!=(null==(n=a.shareable)?void 0:n.code)&&(u.value=null==(o=a.shareable)?void 0:o.code,d.value="// initializing...");let h=r.cli2cfg(c.value),f=u.value;async function m(e=!1){f=u.value;try{const s=performance.now(),n=await(null==i?void 0:i.transform(f,h)),o=performance.now()-s;n&&(d.value=n.code,r.hideError(),e||(t("#duration").textContent=o.toFixed(2)+"ms"))}catch(s){r.showError(s.message)}try{r.updateQuery(l,{code:f,config:h})}catch{}}c.addEventListener("change",(()=>{h=r.cli2cfg(c.value),c.value=r.cfg2cli(h),m()})),u.addEventListener("keydown",(e=>{if("Tab"===e.key){e.preventDefault();const t=u,s=t.value,n=s.substring(0,t.selectionStart),o=t.selectionEnd,i=s.substring(o);t.value=n+"    "+i,t.selectionStart=t.selectionEnd=o+4}})),u.addEventListener("input",(()=>m(!1))),m(!0)})().catch((e=>{console.error(e),t("#mask").textContent=(null==e?void 0:e.message)||e})),navigator.serviceWorker.register("./sw.js").then((e=>console.log("registered sw.js in scope:",e.scope))).catch((e=>console.log("failed to register sw.js:",e)));
//# sourceMappingURL=index.0d8feba6.js.map