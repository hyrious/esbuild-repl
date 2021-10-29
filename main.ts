import { install } from "./lib/enhance-textarea";

type Mode = "transform" | "build";

function $<T = HTMLElement>(sel: string) {
  return document.querySelector(sel) as unknown as T;
}

$(".mode").addEventListener("input", (e) => {
  document.body.dataset.mode = (e.target as HTMLInputElement).value;
});

$("#theme").addEventListener("click", (e) => {
  const button = e.target as HTMLButtonElement;
  switch (button.dataset.value) {
    case "auto":
      document.body.dataset.theme = button.dataset.value = "dark";
      break;
    case "dark":
      document.body.dataset.theme = button.dataset.value = "light";
      break;
    case "light":
      document.body.dataset.theme = button.dataset.value = "auto";
      break;
  }
});

install($(".editor"));
