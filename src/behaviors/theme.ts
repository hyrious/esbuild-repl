import { isBrowser } from "../helpers";
import { theme } from "../stores";

const mediaQuery =
  // @ts-expect-error
  isBrowser && window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : null;

if (mediaQuery) {
  const update = () => theme.set(mediaQuery.matches ? "dark" : "light");
  mediaQuery.addEventListener("change", update);
  update();
}

theme.subscribe((value) => {
  if (isBrowser) {
    document.body.dataset.theme = value;
  }
});
