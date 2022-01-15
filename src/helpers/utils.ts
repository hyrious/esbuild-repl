export const noop: () => any = () => {};
export const isDef = <T = any>(val?: T): val is T => typeof val !== "undefined";
export const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
export const clamp = (val: number, min: number, max: number) =>
  val < min ? min : val > max ? max : val;
export const isBrowser = typeof window !== "undefined";
export const isMobile = isBrowser && (navigator.userAgentData?.mobile ?? true);
