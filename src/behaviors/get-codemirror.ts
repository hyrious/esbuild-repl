let codemirror: Promise<{ default: typeof import("codemirror") }>;

export function getCodeMirror(): typeof codemirror {
  if (__SSR__) {
    return Promise.resolve({ default: null }) as any;
  } else {
    return (codemirror ||= import("./codemirror"));
  }
}
