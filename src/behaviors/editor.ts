// stolen from github's source code :p
import autosize from "@github/textarea-autosize";

export function fire(target: Element, name: string, detail?: any) {
  return target.dispatchEvent(new CustomEvent(name, { bubbles: true, cancelable: true, detail }));
}

type UpdatedText = {
  text: string;
  selection: SelectionRange;
};

type SelectionRange = [number | null, number | null];

const INDENTATION_RE = /^(\s*)/;
function addSortNewLine(
  text: string,
  selection: SelectionRange,
  at: "here" | "begin" | "end"
): UpdatedText | undefined {
  const offset = selection[0];
  if (!offset || !text) return;
  const selectionEnd = selection[1] || offset;

  const lines = text.slice(0, offset).split("\n");
  const currentLine = lines[lines.length - 1];
  const match = currentLine?.match(INDENTATION_RE);
  if (!match) return;

  const indentation = match[1] || "";
  const insert = `\n${indentation}`;

  if (at === "here") {
    return {
      text: text.slice(0, offset) + insert + text.slice(selectionEnd),
      selection: [offset + insert.length, selectionEnd + insert.length],
    };
  } else if (at === "begin") {
    const begin = offset - currentLine.length;
    return {
      text: text.slice(0, begin) + `${indentation}\n` + text.slice(begin),
      selection: [begin + indentation.length, begin + indentation.length],
    };
  } else {
    const end_ = text.indexOf("\n", selectionEnd);
    const end = end_ < 0 ? text.length : end_;
    return {
      text: text.slice(0, end) + insert + text.slice(end),
      selection: [end + insert.length, end + insert.length],
    };
  }
}

function indent(
  text: string,
  selection: SelectionRange,
  substract: boolean
): UpdatedText | undefined {
  const selectionStart = selection[0] || 0;
  const selectionEnd = selection[1] || selectionStart;
  if (selection[0] === null) return;

  if (selectionStart === selectionEnd) {
    if (substract) {
      const lines = text.slice(0, selectionEnd).split("\n");
      const currentLine = lines[lines.length - 1];
      const match = currentLine?.match(INDENTATION_RE);
      if (!match) return;

      let indentation = match[0];
      const indent = indentation.length;
      const lineText = currentLine.slice(indentation.length);
      indentation = indentation.slice(0, -2);
      const diff = indent - indentation.length;
      lines[lines.length - 1] = indentation + lineText;

      return {
        text: lines.join("\n") + text.slice(selectionEnd),
        selection: [selectionEnd - diff, selectionEnd - diff],
      };
    } else {
      return {
        text: text.slice(0, selectionStart) + "  " + text.slice(selectionEnd),
        selection: [selectionEnd + 2, selectionEnd + 2],
      };
    }
  }

  const startOffset = text.slice(0, selectionStart).lastIndexOf("\n") + 1;
  const endOffset_ = text.indexOf("\n", selectionEnd - 1);
  const endOffset = endOffset_ > 0 ? endOffset_ : text.length - 1;
  const selectedLines = text.slice(startOffset, endOffset).split("\n");

  let startUpdated = false;
  let selectionStartDiff = 0;
  let selectionEndDiff = 0;
  const updatedSelectedLines: string[] = [];
  for (const line of selectedLines) {
    const match = line.match(INDENTATION_RE);
    if (match) {
      let indentation = match[0];
      const lineText = line.slice(indentation.length);
      if (substract) {
        const prevLength = indentation.length;
        indentation = indentation.slice(0, -2);
        selectionStartDiff = startUpdated ? selectionStartDiff : indentation.length - prevLength;
        startUpdated = true;
        selectionEndDiff += indentation.length - prevLength;
      } else {
        indentation += "  ";
        selectionStartDiff = 2;
        selectionEndDiff += 2;
      }
      updatedSelectedLines.push(indentation + lineText);
    }
  }

  const linesString = updatedSelectedLines.join("\n");
  const newText = text.slice(0, startOffset) + linesString + text.slice(endOffset);
  const newRange: SelectionRange = [
    Math.max(startOffset, selectionStart + selectionStartDiff),
    selectionEnd + selectionEndDiff,
  ];
  return { text: newText, selection: newRange };
}

function deselectText(ev: Event) {
  const event = ev as KeyboardEvent;
  const element = event.target as HTMLInputElement;
  if (element.selectionDirection === "backward") {
    element.selectionEnd = element.selectionStart;
  } else {
    element.selectionStart = element.selectionEnd;
  }
}

let isIMEVisible = false;

function onCompositionStart() {
  isIMEVisible = true;
}

function onCompositionEnd() {
  isIMEVisible = false;
}

function updateText(element: HTMLInputElement, result: UpdatedText, event: KeyboardEvent) {
  element.value = result.text;
  element.selectionStart = result.selection[0];
  element.selectionEnd = result.selection[1];

  event.preventDefault();
  fire(element, "change");
}

function handleEnter(ev: Event) {
  if (isIMEVisible) {
    return;
  }

  const event = ev as KeyboardEvent;

  if (event.key === "Enter") {
    const element = event.target as HTMLInputElement;

    let at: "here" | "begin" | "end" | undefined;
    const ctrl = event.metaKey || event.ctrlKey;
    const shift = event.shiftKey;
    if (shift && !ctrl) {
      at = "here";
    } else if (ctrl && !shift) {
      at = "end";
    } else if (ctrl && shift) {
      at = "begin";
    }
    if (!at) return;

    const result = addSortNewLine(
      element.value,
      [element.selectionStart, element.selectionEnd],
      at
    );
    if (result === undefined) return;

    updateText(element, result, event);
  }
}

function updateIndentation(ev: Event) {
  if (isIMEVisible) {
    return;
  }

  const event = ev as KeyboardEvent;
  if (event.key === "Escape") {
    deselectText(ev);
    return;
  }

  if (event.key !== "Tab") return;

  const element = event.target as HTMLInputElement;
  const result = indent(
    element.value,
    [element.selectionStart, element.selectionEnd],
    event.shiftKey
  );
  if (result === undefined) return;

  updateText(element, result, event);
}

export function subscribe(el: Element) {
  el.addEventListener("keydown", updateIndentation);
  el.addEventListener("keydown", handleEnter);
  el.addEventListener("compositionstart", onCompositionStart);
  el.addEventListener("compositionend", onCompositionEnd);
  const { unsubscribe } = autosize(el);
  return {
    unsubscribe: () => {
      el.removeEventListener("keydown", updateIndentation);
      el.removeEventListener("keydown", handleEnter);
      el.removeEventListener("compositionstart", onCompositionStart);
      el.removeEventListener("compositionend", onCompositionEnd);
      unsubscribe();
    },
  };
}

import { observe } from "selector-observer";
export const abortController = observe("textarea.editor", { subscribe });
