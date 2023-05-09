declare var __SSR__: boolean;

declare interface ImportMeta {
  env: {
    DEV: boolean;
  };
}

declare interface Window {
  esbuild?: typeof import("esbuild");
  showSaveFilePicker?: (options?: {
    excludeAcceptAllOption?: boolean;
    suggestedName?: string;
    types?: { description?: string; accept?: Record<string, string[]> }[];
  }) => Promise<FileSystemFileHandle>;
}

declare interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
}

declare interface FileSystemWritableFileStream<W = any> extends WritableStream<W> {
  write(data: W): Promise<void>;
}

declare interface Navigator extends NavigatorUA {}
declare interface NavigatorUA {
  readonly userAgentData?: NavigatorUAData;
}
interface NavigatorUAData {
  readonly mobile: boolean;
}
