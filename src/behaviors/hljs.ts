import { noop } from "svelte/internal";

const hljs = typeof Worker !== "undefined" ? new Worker("./hljs.js") : null;

interface Payload {
  id: number;
  code: string;
  loader?: "css";
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

export function highlight(code: string, loader?: "css") {
  if (!hljs) return new Promise<string>(noop);
  let resolve!: (value: string) => void;
  const task = new Promise<string>((r) => (resolve = r));
  Tasks.set(id, resolve);
  hljs.postMessage(<Payload>{ id, code, loader });
  id++;
  return task;
}

class ActionTask {
  cancelled = false;
  constructor(readonly node: HTMLPreElement) {}
  replaceInnerHTML = (html: string) => {
    if (!this.cancelled) {
      console.log(html);
      this.node.innerHTML = html;
    }
  };
  cancel() {
    this.cancelled = true;
  }
}

export type Params = Omit<Payload, "id">;

export function hljs_action(node: HTMLPreElement, params: Params) {
  let last: ActionTask | null = null;
  const update = ({ code, loader }: Params) => {
    last && last.cancel();
    last = null;
    node.innerText = code;
    if (code) {
      last = new ActionTask(node);
      highlight(code, loader).then(last.replaceInnerHTML);
    }
  };
  update(params);
  return { update };
}
