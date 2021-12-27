const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export class TimeoutError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export function importScript(src: string, isReady: () => boolean) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.onload = async () => {
      if (isReady()) resolve();
      for (let i = 0; i < 10; ++i) {
        await delay(100);
        if (isReady()) resolve();
      }
      reject(new TimeoutError(`Failed to import ${src}.`));
    };
    script.onerror = () => {
      script.remove();
      reject();
    };
    script.src = src;
    document.head.append(script);
  });
}
