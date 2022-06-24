"use strict";importScripts("https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.5.1/highlight.min.js");addEventListener("message",({data:s})=>{let{id:e,code:t,lang:i}=s,{value:g}=hljs.highlight(t,{language:i||"js"});postMessage({id:e,value:g})});
//# sourceMappingURL=hljs.js.map
