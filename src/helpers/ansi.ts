// ansi escape to html
// https://esbuild.github.io/api/#color
import type { PartialMessage } from "esbuild";

// https://github.com/evanw/esbuild/blob/master/internal/logger/logger.go
const ESCAPE_TO_COLOR = {
  "37": "dim",
  "31": "red",
  "32": "green",
  "34": "blue",
  "36": "cyan",
  "35": "magenta",
  "33": "yellow",
  "41;31": "red-bg-red",
  "41;97": "red-bg-white",
  "42;32": "green-bg-green",
  "42;97": "green-bg-white",
  "44;34": "blue-bg-blue",
  "44;97": "blue-bg-white",
  "46;36": "cyan-bg-cyan",
  "46;30": "cyan-bg-black",
  "45;35": "magenta-bg-magenta",
  "45;30": "magenta-bg-black",
  "43;33": "yellow-bg-yellow",
  "43;30": "yellow-bg-black",
} as const;

type Escape = "0" | "1" | "4" | keyof typeof ESCAPE_TO_COLOR;

type Color = typeof ESCAPE_TO_COLOR[keyof typeof ESCAPE_TO_COLOR];

// https://github.com/sindresorhus/escape-goat
function htmlEscape(string: string) {
  return string
    .replace(/\&/g, "&amp;")
    .replace(/\"/g, "&quot;")
    .replace(/\'/g, "&#39;")
    .replace(/\</g, "&lt;")
    .replace(/\>/g, "&gt;");
}

const TEXT_DECORATIONS = new Set(["strong", "ins"]);

function isColor(text: string): text is Color {
  return !!text && !TEXT_DECORATIONS.has(text);
}

class AnsiBuffer {
  result = "";
  _stack: string[] = [];
  _bold = false;
  _underline = false;
  text(text: string) {
    this.result += htmlEscape(text);
  }
  reset() {
    let bracket: string | undefined;
    while ((bracket = this._stack.pop())) {
      if (TEXT_DECORATIONS.has(bracket)) {
        this.result += `</${bracket}>`;
      } else {
        this.result += `</span>`;
      }
    }
  }
  bold() {
    if (!this._bold) {
      this._bold = true;
      this._stack.push("strong");
      this.result += "<strong>";
    }
  }
  underline() {
    if (!this._underline) {
      this._underline = true;
      this._stack.push("ins");
      this.result += "<ins>";
    }
  }
  color(color: Color) {
    const last = () => this._stack[this._stack.length - 1];
    while (isColor(last())) {
      this._stack.pop();
      this.result += `</span>`;
    }
    this._stack.push(color);
    this.result += `<span class="color-${color}">`;
  }
  done() {
    this.reset();
    return this.result;
  }
}

export function render(ansi: string) {
  ansi = ansi.trimEnd();
  let i = 0;
  const buffer = new AnsiBuffer();
  for (let m of ansi.matchAll(/\x1B\[([\d;]+)m/g)) {
    const escape = m[1] as Escape;
    buffer.text(ansi.slice(i, m.index));
    i = m.index! + m[0].length;
    /*  */ if (escape === "0") {
      buffer.reset();
    } else if (escape === "1") {
      buffer.bold();
    } else if (escape === "4") {
      buffer.underline();
    } else if (ESCAPE_TO_COLOR[escape]) {
      buffer.color(ESCAPE_TO_COLOR[escape]);
    }
  }
  if (i < ansi.length) {
    buffer.text(ansi.slice(i));
  }
  return buffer.done();
}

export async function printError(errors: PartialMessage[]): Promise<string> {
  if (errors instanceof Error) {
    let stack = (errors.stack || "").split("\n");
    stack[0] = "";
    return printError([
      { text: errors.message, notes: [{ text: stack.join("\n") }] },
    ]);
  }
  const strings = await esbuild.formatMessages(errors, {
    kind: "error",
    color: true,
  });
  return strings.map(render).join("");
}

export async function printWarning(warnings: PartialMessage[]) {
  const strings = await esbuild.formatMessages(warnings, {
    kind: "warning",
    color: true,
  });
  return strings.map(render).join("");
}
