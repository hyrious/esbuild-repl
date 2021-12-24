import { writable } from "svelte/store";

export interface ReplFile {
  uid: number;
  name: string;
  contents: string;
}

export const html = writable(`<!-- see main.jsx -->`);
export const files = writable<ReplFile[]>([
  {
    uid: 0,
    name: "main.jsx",
    contents: `import { h, Fragment, render, useState } from 'fre'

function App() {
  const [count, setCount] = useState(0)
  return <>
    <h1>{count}</h1>
    <button onClick={() => setCount(count + 1)}>+</button>
  </>
}

render(<App />, document.body)`,
  },
]);
