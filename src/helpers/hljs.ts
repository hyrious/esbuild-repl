import type { Loader } from "esbuild";
import { isBrowser, noop } from "./utils";

const hljs = isBrowser ? new Worker("./hljs.js") : null;

interface Payload {
  id: number;
  code: string;
  lang?: string;
}

interface Result {
  id: number;
  value: string;
}

const Tasks = new Map<number, (value: string) => void>();

let id = 1;

if (hljs) {
  hljs.addEventListener("message", (ev: MessageEvent<Result>) => {
    const { id, value } = ev.data;
    if (Tasks.has(id)) {
      Tasks.get(id)!(value);
      Tasks.delete(id);
    }
  });
}

export function highlight(code: string, lang?: string) {
  if (!hljs) return new Promise<string>(noop);
  let resolve!: (value: string) => void;
  const task = new Promise<string>((r) => (resolve = r));
  Tasks.set(id, resolve);
  hljs.postMessage(<Payload>{ id, code, lang });
  id++;
  return task;
}

class ActionTask {
  cancelled = false;
  constructor(readonly node: HTMLPreElement, readonly token: number) {}
  replaceInnerHTML = (html: string) => {
    clearTimeout(this.token);
    if (!this.cancelled) {
      this.node.innerHTML = html;
    }
  };
  cancel() {
    clearTimeout(this.token);
    this.cancelled = true;
  }
}

export interface Params {
  code?: string;
  loader?: Loader;
}

const NonJSLoaders = new Set(["css", "json"]);

export function hljs_action(node: HTMLPreElement, params: Params) {
  let last: ActionTask | null = null;
  const update = ({ code, loader }: Params) => {
    if (last) {
      last.cancel();
      last = null;
    }
    if (code) {
      last = new ActionTask(
        node,
        setTimeout(() => {
          node.innerText = code;
        }, 50)
      );
      const lang = loader && NonJSLoaders.has(loader) ? loader : "js";
      highlight(code, lang).then(last.replaceInnerHTML);
    } else {
      node.innerText = "";
    }
  };
  update(params);
  return { update };
}
