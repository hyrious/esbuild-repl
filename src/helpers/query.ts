import { isBrowser } from "./utils";

export function getQuery() {
  const result: Record<string, string> = {};
  if (!isBrowser) return result;
  for (const [key, value] of new URLSearchParams(location.search.slice(1))) {
    result[key] = value;
  }
  return result;
}

const URL_LIMIT = 2000;

export function setQuery(search: string) {
  if (!isBrowser) return;
  if (search.length > URL_LIMIT) {
    console.warn("url is too long! you may not be able to share it correctly.");
  }
  history.replaceState({}, "", location.pathname + "?" + search);
}
