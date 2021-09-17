/**
 * TODO: try CodeMirror 6
 */
export async function getCodeMirror() {
  const setup_ = import("@codemirror/basic-setup");
  const view_ = import("@codemirror/view");
  const cmd_ = import("@codemirror/commands");
  const js_ = import("@codemirror/lang-javascript");
  const css_ = import("@codemirror/lang-css");

  const { EditorView, EditorState, basicSetup } = await setup_;
  const view = await view_;
  const { indentWithTab } = await cmd_;
  const js = await js_;
  const css = await css_;

  // looks like it does not have a built-in auto-light-dark theme?
  const darkTheme = EditorView.theme({}, { dark: true });

  function create(parent: HTMLElement) {
    return new EditorView({
      state: EditorState.create({
        extensions: [
          basicSetup,
          view.keymap.of([indentWithTab]),
          // looks like only one language can be loaded at once
          // and have no way to change it after view being created.
          js.javascript(),
          darkTheme,
        ],
      }),
      parent,
    });
  }

  return { create };
}
