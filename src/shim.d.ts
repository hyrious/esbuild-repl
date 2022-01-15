declare interface ImportMeta {
  env: {
    DEV: boolean;
  };
}

declare interface Window {
  esbuild?: typeof import("esbuild");
}

declare interface Navigator extends NavigatorUA {}
declare interface NavigatorUA {
  readonly userAgentData?: NavigatorUAData;
}
interface NavigatorUAData {
  readonly mobile: boolean;
}
