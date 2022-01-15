import CodeMirror from "codemirror";
import "./codemirror.css";

import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/css/css.js";
import "codemirror/mode/htmlmixed/htmlmixed.js";
import "codemirror/mode/jsx/jsx.js";

import "codemirror/addon/edit/closebrackets.js";
import "codemirror/addon/edit/closetag.js";
import "codemirror/addon/comment/comment.js";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/comment-fold.js";

import { observe } from "selector-observer";
import { input } from "../stores/transform";

export function fire(target: Element, name: string) {
  return target.dispatchEvent(new InputEvent(name, { bubbles: true, cancelable: true }));
}

function subscribe(el: Element) {
  const textarea = el as HTMLTextAreaElement;

  const editor = CodeMirror.fromTextArea(textarea, {
    mode: "javascript",
    tabSize: 2,
    lineWrapping: true,
    lineNumbers: true,
    autoCloseBrackets: true,
    autoCloseTags: true,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  });

  editor.on("change", () => {
    const value = editor.getValue();
    if (textarea.value !== value) {
      textarea.value = value;
      fire(textarea, "input");
    }
  });

  input.subscribe(($input) => {
    if (editor.getValue() !== $input) {
      editor.setValue($input);
    }
  });

  return {
    unsubscribe() {},
  };
}

export const abortController = observe("textarea.editor", { subscribe });
