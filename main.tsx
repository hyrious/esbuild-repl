import type { TransformOptions, TransformResult } from "esbuild";
import { ComponentChildren, Fragment, h, render } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { memo } from "preact/compat";

const JsDelivrAPI = "https://data.jsdelivr.com/v1/package/npm/esbuild-wasm";

function timestamp() {
    return Math.floor(Number(new Date()) / 1000);
}

function getEsbuildUrl(version: string) {
    return `https://cdn.jsdelivr.net/npm/esbuild-wasm@${version}/esm/browser.js`;
}

function getWasmUrl(version: string) {
    return `https://cdn.jsdelivr.net/npm/esbuild-wasm@${version}/esbuild.wasm`;
}

async function fetchLatestVersion() {
    const r = await fetch(JsDelivrAPI).then((r) => r.json());
    const version: string = r.tags.latest;
    localStorage.setItem("esbuild-repl", `${version}:${timestamp()}`);
    return version;
}

async function getLatestVersion() {
    const raw = localStorage.getItem("esbuild-repl");
    if (raw) {
        const [version, mtime] = raw.split(":", 2);
        if (timestamp() - parseInt(mtime) < 86400 * 7) {
            return version;
        }
    }
    return fetchLatestVersion();
}

type ESBuild = typeof import("esbuild");
let esbuildService: { transform: (input: string, options?: TransformOptions | undefined) => Promise<TransformResult> } | null = null;

async function importESBuild(version: string) {
    if (esbuildService == null) {
        try {
            const { initialize, transform }: ESBuild = await import(
                /* @vite-ignore */ getEsbuildUrl(version)
            );
            await initialize({
                wasmURL: getWasmUrl(version),
            });
            esbuildService = { transform };
        } catch {}
    }
    return esbuildService;
}

function usePromise<T>(f: (...args: any) => Promise<T>, ...args: any) {
    type Status = "pending" | "success" | "fail";
    const [data, setData] = useState<T | null>(null);
    const [status, setStatus] = useState<Status>("pending");
    useEffect(() => {
        (async () => {
            try {
                setData(await f(...args));
                setStatus("success");
            } catch {
                setData(null);
                setStatus("fail");
            }
        })();
    }, []);
    return { status, data } as
        | { status: "success"; data: T }
        | { status: "pending" | "fail"; data: null };
}

function useESBuild() {
    const [service, setService] = useState<typeof esbuildService>(null);
    const { status, data } = usePromise<string>(getLatestVersion);
    useEffect(() => {
        if (status === "success") {
            importESBuild(data!).then(setService);
        }
    }, [status]);
    return service;
}

function Loading({ text }: { text: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const id = setTimeout(() => setCount((count + 1) % 7), 1000);
        return () => clearTimeout(id);
    }, [count]);

    return (
        <div class="center code">
            <div>{text}</div>
            <div>&nbsp;{".".repeat(count)}&nbsp;</div>
        </div>
    );
}

function useSplashGuard(timeout = 300) {
    const [guard, setGuard] = useState(true);
    useEffect(() => {
        setTimeout(() => setGuard(false), timeout);
    }, []);
    return guard;
}

type PropsWithChildren<P = {}> = P & {
    children: ComponentChildren;
};

function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <header>
                <a href="https://esbuild.github.io/">esbuild</a> repl
            </header>
            <main>{children}</main>
        </>
    );
}

type DoSomething = () => void;

function useRunAfter() {
    const queue = useRef<DoSomething[]>([]);
    const push = useCallback((e: DoSomething) => queue.current.push(e), []);
    useEffect(() => {
        if (queue.current.length > 0) {
            queue.current.forEach((f) => f());
            queue.current = [];
        }
    });
    return push;
}

function hasKey(obj: object) {
    for (const _key in obj) return true;
    return false;
}

function dashize(str: string) {
    return str.replace(/([A-Z])/g, (x) => "-" + x.toLowerCase());
}

function camalize(str: string) {
    return str.replace(/-([a-z])/g, (x) => x.substring(1).toUpperCase());
}

function normalize(val: string) {
    if (val === "true") return true;
    if (val === "false") return false;
    return val;
}

const defaultConfig: TransformOptions = {
    loader: "tsx",
};

function renderConfig(config: Record<string, any>) {
    const options: string[] = [];
    for (const key in config) {
        const value = config[key as keyof TransformOptions];
        if (value instanceof Object && !Array.isArray(value) && hasKey(value)) {
            options.push(`--${dashize(key)}:${Object.entries(value).map((k, v) => `${k}=${v}`)}`);
        } else if (value === true) {
            options.push(`--${dashize(key)}`);
        } else {
            options.push(`--${dashize(key)}=${value}`);
        }
    }
    return options.join(" ");
}

function makeNewConfig(cmdline: string) {
    const newConfig: Record<string, any> = {};
    for (const rowWithDashDash of cmdline.split(/\s+/)) {
        let row: string;
        if (/^--/.test(rowWithDashDash)) {
            row = rowWithDashDash.substring(2);
        } else {
            row = rowWithDashDash;
        }
        const colon = row.indexOf(":");
        const equal = row.indexOf("=");
        if (colon === -1 && equal === -1) {
            newConfig[camalize(row)] = true;
        } else {
            if (colon !== -1 && colon < row.indexOf("=")) {
                const key = row.substring(0, colon);
                const value: Record<string, any> = {};
                for (const pair of row.substring(colon + 1).split(",")) {
                    const [k, v] = pair.split("=", 2);
                    value[k] = normalize(v);
                }
                newConfig[camalize(key)] = value;
            } else {
                const [key, value] = row.split("=", 2);
                if (value.includes(",")) {
                    newConfig[camalize(key)] = value.split(",");
                } else {
                    newConfig[camalize(key)] = normalize(value);
                }
            }
        }
    }
    return newConfig;
}

function App() {
    const [code, setCode] = useState('render(<App />, document.getElementById("app")!);');
    const [result, setResult] = useState("waiting for esbuild service ...");
    const [error, setError] = useState("");
    const [config, setConfig] = useState<TransformOptions>(defaultConfig);
    const guard = useSplashGuard();
    const service = useESBuild();
    const runAfter = useRunAfter();

    useEffect(
        (async () => {
            try {
                const result = await service?.transform(code, config);
                if (result) {
                    setResult(result.code);
                    setError("");
                }
            } catch (e) {
                setError(e.message);
            }
        }) as any,
        [service, code, config]
    );

    if (guard) {
        return <div />;
    }

    if (service == null) {
        return <Loading text="loading esbuild (about 10MB)" />;
    }

    const onKeyDown = useCallback(
        function onKeyDown(e: any) {
            if (e.key === "Tab") {
                e.preventDefault();
                const ta: HTMLTextAreaElement = e.target;
                const before = code.substring(0, ta.selectionStart);
                const endPos = ta.selectionEnd;
                const after = code.substring(endPos);
                setCode(before + "    " + after);
                runAfter(() => {
                    ta.selectionStart = ta.selectionEnd = endPos + 4;
                });
            }
        },
        [code]
    );

    const onInput = useCallback(function onInput(e: any) {
        setCode(e.target.value);
    }, []);

    const updateConfig = useCallback(function updateConfig(e: any) {
        setConfig(makeNewConfig(e.target.value));
    }, []);

    return (
        <>
            <Layout>
                <textarea value={code} onKeyDown={onKeyDown} onInput={onInput} />
                <div className="spliter"></div>
                <textarea readOnly value={result} />
            </Layout>
            <aside>
                <input onChange={updateConfig} value={renderConfig(config)} />
                {error && (
                    <span class="error" title={error.replace(/\n/g, "\r\n")}>
                        {error}
                    </span>
                )}
            </aside>
        </>
    );
}

render(<App />, document.getElementById("app")!);
