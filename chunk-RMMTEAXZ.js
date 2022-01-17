function H(e,t){var n=t===void 0?{}:t,r=n.viewportMarginBottom,i=r===void 0?100:r,o=null,s=!1,a,c,u;function l(m){if(a!==m.clientX||c!==m.clientY){var d=e.style.height;u&&u!==d&&(s=!0,e.style.maxHeight="",e.removeEventListener("mousemove",l)),u=d}a=m.clientX,c=m.clientY}var f=e.ownerDocument,v=f.documentElement;function g(){for(var m=0,d=e;d!==f.body&&d!==null;)m+=d.offsetTop||0,d=d.offsetParent;var p=m-f.defaultView.pageYOffset,b=v.clientHeight-(p+e.offsetHeight);return{top:p,bottom:b}}function E(){if(!s&&e.value!==o&&!(e.offsetWidth<=0&&e.offsetHeight<=0)){var m=g(),d=m.top,p=m.bottom;if(!(d<0||p<0)){var b=getComputedStyle(e),B=Number(b.borderTopWidth.replace(/px/,"")),I=Number(b.borderBottomWidth.replace(/px/,"")),oe=b.boxSizing==="border-box",se=oe?B+I:0,ae=Number(b.height.replace(/px/,""))+p,le=p<i?p:i;e.style.maxHeight=ae-le+"px";var w=e.parentElement;if(w instanceof HTMLElement){var ce=w.style.height;w.style.height=getComputedStyle(w).height,e.style.height="auto",e.style.height=e.scrollHeight+se+"px",w.style.height=ce,u=e.style.height}o=e.value}}}function T(){s=!1,e.style.height="",e.style.maxHeight=""}e.addEventListener("mousemove",l),e.addEventListener("input",E),e.addEventListener("change",E);var y=e.form;return y&&y.addEventListener("reset",T),e.value&&E(),{unsubscribe:function(){e.removeEventListener("mousemove",l),e.removeEventListener("input",E),e.removeEventListener("change",E),y&&y.removeEventListener("reset",T)}}}function h(){if(!(this instanceof h))return new h;this.size=0,this.uid=0,this.selectors=[],this.selectorObjects={},this.indexes=Object.create(this.indexes),this.activeIndexes=[]}var M=window.document.documentElement,ue=M.matches||M.webkitMatchesSelector||M.mozMatchesSelector||M.oMatchesSelector||M.msMatchesSelector;h.prototype.matchesSelector=function(e,t){return ue.call(e,t)};h.prototype.querySelectorAll=function(e,t){return t.querySelectorAll(e)};h.prototype.indexes=[];var fe=/^#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;h.prototype.indexes.push({name:"ID",selector:function(t){var n;if(n=t.match(fe))return n[0].slice(1)},element:function(t){if(t.id)return[t.id]}});var de=/^\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;h.prototype.indexes.push({name:"CLASS",selector:function(t){var n;if(n=t.match(de))return n[0].slice(1)},element:function(t){var n=t.className;if(n){if(typeof n=="string")return n.split(/\s/);if(typeof n=="object"&&"baseVal"in n)return n.baseVal.split(/\s/)}}});var he=/^((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;h.prototype.indexes.push({name:"TAG",selector:function(t){var n;if(n=t.match(he))return n[0].toUpperCase()},element:function(t){return[t.nodeName.toUpperCase()]}});h.prototype.indexes.default={name:"UNIVERSAL",selector:function(){return!0},element:function(){return[!0]}};var F;typeof window.Map=="function"?F=window.Map:F=function(){function e(){this.map={}}return e.prototype.get=function(t){return this.map[t+" "]},e.prototype.set=function(t,n){this.map[t+" "]=n},e}();var P=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g;function _(e,t){e=e.slice(0).concat(e.default);var n=e.length,r,i,o,s,a=t,c,u,l=[];do if(P.exec(""),(o=P.exec(a))&&(a=o[3],o[2]||!a)){for(r=0;r<n;r++)if(u=e[r],c=u.selector(o[1])){for(i=l.length,s=!1;i--;)if(l[i].index===u&&l[i].key===c){s=!0;break}s||l.push({index:u,key:c});break}}while(o);return l}function ve(e,t){var n,r,i;for(n=0,r=e.length;n<r;n++)if(i=e[n],t.isPrototypeOf(i))return i}h.prototype.logDefaultIndexUsed=function(){};h.prototype.add=function(e,t){var n,r,i,o,s,a,c,u,l=this.activeIndexes,f=this.selectors,v=this.selectorObjects;if(typeof e=="string"){for(n={id:this.uid++,selector:e,data:t},v[n.id]=n,c=_(this.indexes,e),r=0;r<c.length;r++)u=c[r],o=u.key,i=u.index,s=ve(l,i),s||(s=Object.create(i),s.map=new F,l.push(s)),i===this.indexes.default&&this.logDefaultIndexUsed(n),a=s.map.get(o),a||(a=[],s.map.set(o,a)),a.push(n);this.size++,f.push(e)}};h.prototype.remove=function(e,t){if(typeof e=="string"){var n,r,i,o,s,a,c,u,l=this.activeIndexes,f=this.selectors=[],v=this.selectorObjects,g={},E=arguments.length===1;for(n=_(this.indexes,e),i=0;i<n.length;i++)for(r=n[i],o=l.length;o--;)if(a=l[o],r.index.isPrototypeOf(a)){if(c=a.map.get(r.key),c)for(s=c.length;s--;)u=c[s],u.selector===e&&(E||u.data===t)&&(c.splice(s,1),g[u.id]=!0);break}for(i in g)delete v[i],this.size--;for(i in v)f.push(v[i].selector)}};function z(e,t){return e.id-t.id}h.prototype.queryAll=function(e){if(!this.selectors.length)return[];var t={},n=[],r=this.querySelectorAll(this.selectors.join(", "),e),i,o,s,a,c,u,l,f;for(i=0,s=r.length;i<s;i++)for(c=r[i],u=this.matches(c),o=0,a=u.length;o<a;o++)f=u[o],t[f.id]?l=t[f.id]:(l={id:f.id,selector:f.selector,data:f.data,elements:[]},t[f.id]=l,n.push(l)),l.elements.push(c);return n.sort(z)};h.prototype.matches=function(e){if(!e)return[];var t,n,r,i,o,s,a,c,u,l,f,v=this.activeIndexes,g={},E=[];for(t=0,i=v.length;t<i;t++)if(a=v[t],c=a.element(e),c){for(n=0,o=c.length;n<o;n++)if(u=a.map.get(c[n]))for(r=0,s=u.length;r<s;r++)l=u[r],f=l.id,!g[f]&&this.matchesSelector(e,l.selector)&&(g[f]=!0,E.push(l))}return E.sort(z)};var O=null,q=null,U=[];function Y(e,t){var n=[];function r(){var o=n;n=[],t(o)}function i(){for(var o=arguments.length,s=Array(o),a=0;a<o;a++)s[a]=arguments[a];n.push(s),n.length===1&&j(e,r)}return i}function j(e,t){q||(q=new MutationObserver(me)),O||(O=e.createElement("div"),q.observe(O,{attributes:!0})),U.push(t),O.setAttribute("data-twiddle",""+Date.now())}function me(){var e=U;U=[];for(var t=0;t<e.length;t++)try{e[t]()}catch(n){setTimeout(function(){throw n},0)}}var Q=new WeakMap,L=new WeakMap,A=new WeakMap,S=new WeakMap;function R(e,t){for(var n=0;n<t.length;n++){var r=t[n],i=r[0],o=r[1],s=r[2];i===C?(pe(s,o),ge(s,o)):i===G?X(s,o):i===D&&ye(e.observers,o)}}function pe(e,t){if(t instanceof e.elementConstructor){var n=Q.get(t);if(n||(n=[],Q.set(t,n)),n.indexOf(e.id)===-1){var r=void 0;if(e.initialize&&(r=e.initialize.call(void 0,t)),r){var i=L.get(t);i||(i={},L.set(t,i)),i[""+e.id]=r}n.push(e.id)}}}function ge(e,t){if(t instanceof e.elementConstructor){var n=S.get(t);if(n||(n=[],S.set(t,n)),n.indexOf(e.id)===-1){e.elements.push(t);var r=L.get(t),i=r?r[""+e.id]:null;if(i&&i.add&&i.add.call(void 0,t),e.subscribe){var o=e.subscribe.call(void 0,t);if(o){var s=A.get(t);s||(s={},A.set(t,s)),s[""+e.id]=o}}e.add&&e.add.call(void 0,t),n.push(e.id)}}}function X(e,t){if(t instanceof e.elementConstructor){var n=S.get(t);if(!!n){var r=e.elements.indexOf(t);if(r!==-1&&e.elements.splice(r,1),r=n.indexOf(e.id),r!==-1){var i=L.get(t),o=i?i[""+e.id]:null;if(o&&o.remove&&o.remove.call(void 0,t),e.subscribe){var s=A.get(t),a=s?s[""+e.id]:null;a&&a.unsubscribe&&a.unsubscribe()}e.remove&&e.remove.call(void 0,t),n.splice(r,1)}n.length===0&&S.delete(t)}}}function ye(e,t){var n=S.get(t);if(!!n){for(var r=n.slice(0),i=0;i<r.length;i++){var o=e[r[i]];if(!!o){var s=o.elements.indexOf(t);s!==-1&&o.elements.splice(s,1);var a=L.get(t),c=a?a[""+o.id]:null;c&&c.remove&&c.remove.call(void 0,t);var u=A.get(t),l=u?u[""+o.id]:null;l&&l.unsubscribe&&l.unsubscribe(),o.remove&&o.remove.call(void 0,t)}}S.delete(t)}}var V=null;function Ee(e){if(V===null){var t=e.createElement("div"),n=e.createElement("div"),r=e.createElement("div");t.appendChild(n),n.appendChild(r),t.innerHTML="",V=r.parentNode!==n}return V}function $(e){return"matches"in e||"webkitMatchesSelector"in e||"mozMatchesSelector"in e||"oMatchesSelector"in e||"msMatchesSelector"in e}var C=1,G=2,D=3;function be(e,t,n){for(var r=0;r<n.length;r++){var i=n[r];i.type==="childList"?(J(e,t,i.addedNodes),Se(e,t,i.removedNodes)):i.type==="attributes"&&k(e,t,i.target)}Ee(e.ownerDocument)&&Le(e,t)}function J(e,t,n){for(var r=0;r<n.length;r++){var i=n[r];if($(i))for(var o=e.selectorSet.matches(i),s=0;s<o.length;s++){var a=o[s].data;t.push([C,i,a])}if("querySelectorAll"in i)for(var c=e.selectorSet.queryAll(i),u=0;u<c.length;u++)for(var l=c[u],f=l.data,v=l.elements,g=0;g<v.length;g++)t.push([C,v[g],f])}}function Se(e,t,n){for(var r=0;r<n.length;r++){var i=n[r];if("querySelectorAll"in i){t.push([D,i]);for(var o=i.querySelectorAll("*"),s=0;s<o.length;s++)t.push([D,o[s]])}}}function k(e,t,n){if($(n))for(var r=e.selectorSet.matches(n),i=0;i<r.length;i++){var o=r[i].data;t.push([C,n,o])}if("querySelectorAll"in n){var s=S.get(n);if(s)for(var a=0;a<s.length;a++){var c=e.observers[s[a]];c&&(e.selectorSet.matchesSelector(n,c.selector)||t.push([G,n,c]))}}}function we(e,t,n){if("querySelectorAll"in n){k(e,t,n);for(var r=n.querySelectorAll("*"),i=0;i<r.length;i++)k(e,t,r[i])}}function Me(e,t,n){for(var r=0;r<n.length;r++)for(var i=n[r],o=i.form?i.form.elements:e.rootNode.querySelectorAll("input"),s=0;s<o.length;s++)k(e,t,o[s])}function Le(e,t){for(var n=0;n<e.observers.length;n++){var r=e.observers[n];if(r)for(var i=r.elements,o=0;o<i.length;o++){var s=i[o];s.parentNode||t.push([D,s])}}}function xe(e,t){var n=e.readyState;n==="interactive"||n==="complete"?j(e,t):e.addEventListener("DOMContentLoaded",j(e,t))}var Te=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},Ie=0;function x(e){this.rootNode=e.nodeType===9?e.documentElement:e,this.ownerDocument=e.nodeType===9?e:e.ownerDocument,this.observers=[],this.selectorSet=new h,this.mutationObserver=new MutationObserver(Re.bind(this,this)),this._scheduleAddRootNodes=Y(this.ownerDocument,Ae.bind(this,this)),this._handleThrottledChangedTargets=Y(this.ownerDocument,De.bind(this,this)),this.rootNode.addEventListener("change",Ce.bind(this,this),!1),xe(this.ownerDocument,Oe.bind(this,this))}x.prototype.disconnect=function(){this.mutationObserver.disconnect()};x.prototype.observe=function(e,t){var n=void 0;typeof t=="function"?n={selector:e,initialize:t}:(typeof t=="undefined"?"undefined":Te(t))==="object"?(n=t,n.selector=e):n=e;var r=this,i={id:Ie++,selector:n.selector,initialize:n.initialize,add:n.add,remove:n.remove,subscribe:n.subscribe,elements:[],elementConstructor:n.hasOwnProperty("constructor")?n.constructor:this.ownerDocument.defaultView.Element,abort:function(){r._abortObserving(i)}};return this.selectorSet.add(i.selector,i),this.observers[i.id]=i,this._scheduleAddRootNodes(),i};x.prototype._abortObserving=function(e){for(var t=e.elements,n=0;n<t.length;n++)X(e,t[n]);this.selectorSet.remove(e.selector,e),delete this.observers[e.id]};x.prototype.triggerObservers=function(e){var t=[];we(this,t,e),R(this,t)};function Oe(e){e.mutationObserver.observe(e.rootNode,{childList:!0,attributes:!0,subtree:!0}),e._scheduleAddRootNodes()}function Ae(e){var t=[];J(e,t,[e.rootNode]),R(e,t)}function Re(e,t){var n=[];be(e,n,t),R(e,n)}function Ce(e,t){e._handleThrottledChangedTargets(t.target)}function De(e,t){var n=[];Me(e,n,t),R(e,n)}var W=void 0;function ke(){return W||(W=new x(window.document)),W}function Z(){var e;return(e=ke()).observe.apply(e,arguments)}function Ne(e,t,n){return e.dispatchEvent(new CustomEvent(t,{bubbles:!0,cancelable:!0,detail:n}))}var K=/^(\s*)/;function Be(e,t,n){let r=t[0];if(!r||!e)return;let i=t[1]||r,o=e.slice(0,r).split(`
`),s=o[o.length-1],a=s?.match(K);if(!a)return;let c=a[1]||"",u=`
${c}`;if(n==="here")return{text:e.slice(0,r)+u+e.slice(i),selection:[r+u.length,i+u.length]};if(n==="begin"){let l=r-s.length;return{text:e.slice(0,l)+`${c}
`+e.slice(l),selection:[l+c.length,l+c.length]}}else{let l=e.indexOf(`
`,i),f=l<0?e.length:l;return{text:e.slice(0,f)+u+e.slice(f),selection:[f+u.length,f+u.length]}}}function He(e,t,n){let r=t[0]||0,i=t[1]||r;if(t[0]===null)return;if(r===i)if(n){let y=e.slice(0,i).split(`
`),m=y[y.length-1],d=m?.match(K);if(!d)return;let p=d[0],b=p.length,B=m.slice(p.length);p=p.slice(0,-2);let I=b-p.length;return y[y.length-1]=p+B,{text:y.join(`
`)+e.slice(i),selection:[i-I,i-I]}}else return{text:e.slice(0,r)+"  "+e.slice(i),selection:[i+2,i+2]};let o=e.slice(0,r).lastIndexOf(`
`)+1,s=e.indexOf(`
`,i-1),a=s>0?s:e.length-1,c=e.slice(o,a).split(`
`),u=!1,l=0,f=0,v=[];for(let y of c){let m=y.match(K);if(m){let d=m[0],p=y.slice(d.length);if(n){let b=d.length;d=d.slice(0,-2),l=u?l:d.length-b,u=!0,f+=d.length-b}else d+="  ",l=2,f+=2;v.push(d+p)}}let g=v.join(`
`),E=e.slice(0,o)+g+e.slice(a),T=[Math.max(o,r+l),i+f];return{text:E,selection:T}}function Fe(e){let n=e.target;n.selectionDirection==="backward"?n.selectionEnd=n.selectionStart:n.selectionStart=n.selectionEnd}var N=!1;function ee(){N=!0}function te(){N=!1}function ne(e,t,n){e.value=t.text,e.selectionStart=t.selection[0],e.selectionEnd=t.selection[1],n.preventDefault(),Ne(e,"change")}function ie(e){if(N)return;let t=e;if(t.key==="Enter"){let n=t.target,r,i=t.metaKey||t.ctrlKey,o=t.shiftKey;if(o&&!i?r="here":i&&!o?r="end":i&&o&&(r="begin"),!r)return;let s=Be(n.value,[n.selectionStart,n.selectionEnd],r);if(s===void 0)return;ne(n,s,t)}}function re(e){if(N)return;let t=e;if(t.key==="Escape"){Fe(e);return}if(t.key!=="Tab")return;let n=t.target,r=He(n.value,[n.selectionStart,n.selectionEnd],t.shiftKey);r!==void 0&&ne(n,r,t)}function qe(e){e.addEventListener("keydown",re),e.addEventListener("keydown",ie),e.addEventListener("compositionstart",ee),e.addEventListener("compositionend",te);let{unsubscribe:t}=H(e);return{unsubscribe:()=>{e.removeEventListener("keydown",re),e.removeEventListener("keydown",ie),e.removeEventListener("compositionstart",ee),e.removeEventListener("compositionend",te),t()}}}var _e=Z("textarea.editor",{subscribe:qe});export{Ne as a,qe as b,_e as c};
//# sourceMappingURL=chunk-RMMTEAXZ.js.map
