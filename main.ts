import type { TransformOptions } from "esbuild";
import { argsToBuildOptions, buildOptionsToArgs } from "@hyrious/esbuild-dev/args";

type esbuild_t = typeof import("esbuild");

const $ = (sel: string) => document.querySelector(sel)!;

function leave(el: Element, ms = 200) {
    el.classList.add("leave", "leave-active");
    requestAnimationFrame(() => {
        el.classList.remove("leave");
        el.classList.add("leave-to");
    });
    setTimeout(() => el.remove(), ms);
}

const JsDelivrAPI = "https://data.jsdelivr.com/v1/package/npm/esbuild-wasm";
const urlPrefix = "https://cdn.jsdelivr.net/npm/esbuild-wasm";
const urls = {
    browser: (version: string) => `${urlPrefix}@${version}/esm/browser.js`,
    wasm: (version: string) => `${urlPrefix}@${version}/esbuild.wasm`,
};

let esbuild: esbuild_t | undefined;
const utils = {
    async fetchVersion() {
        const r = await fetch(JsDelivrAPI).then((r) => r.json());
        const version = r.tags.latest;
        localStorage.setItem("esbuild-repl", `${version}:${Date.now()}`);
        return version;
    },
    async version() {
        const raw = localStorage.getItem("esbuild-repl");
        if (raw) {
            const [version, time] = raw.split(":", 2);
            if (Date.now() - +time < 86400 * 7 * 1000) {
                return version;
            }
        }
        return this.fetchVersion();
    },
    async esbuild(version: string) {
        esbuild = (await import(/* @vite-ignore */ urls.browser(version))) as esbuild_t;
        await esbuild.initialize({ wasmURL: urls.wasm(version) });
    },
    cfg2cli(config: Record<string, any>) {
        return buildOptionsToArgs(config).join(" ");
    },
    cli2cfg(line: string) {
        return argsToBuildOptions(line.split(/\s+/)) as TransformOptions;
    },
    loadQuery() {
        const query = new URLSearchParams(location.search.slice(1));
        const version = query.get("version");
        const shareableString = query.get("shareable");
        let shareable: { code: string; config: Record<string, any> } | null = null;
        if (shareableString) {
            try {
                shareable = JSON.parse(decodeURIComponent(atob(shareableString)));
            } catch {}
        }
        return { version, shareable };
    },
    updateQuery(version: string, shareable: object) {
        const query = new URLSearchParams();
        query.set("version", version);
        query.set("shareable", btoa(encodeURIComponent(JSON.stringify(shareable))));
        const url = location.origin + location.pathname + "?" + query.toString();
        history.pushState({ path: url }, "", url);
    },
    showError(message: string) {
        const el = $("#error") as HTMLElement;
        el.style.display = "";
        el.textContent = message;
    },
    hideError() {
        const el = $("#error") as HTMLElement;
        el.style.display = "none";
    },
};

(async function () {
    const query = utils.loadQuery();
    console.log(query);

    $("#theme").addEventListener("click", () => {
        document.body.classList.toggle("light");
    });
    const version = query.version || (await utils.version());
    $("#version").textContent = version;
    await utils.esbuild(version);
    leave($("#mask"));

    (window as any).esbuild = esbuild;

    let $config = $("#config") as HTMLInputElement;
    let $output = $("#output") as HTMLTextAreaElement;
    let $editor = $("#editor") as HTMLTextAreaElement;

    if (query.shareable?.config != null) {
        $config.value = utils.cfg2cli(query.shareable?.config);
    }

    if (query.shareable?.code != null) {
        $editor.value = query.shareable?.code;
        $output.value = "// initializing...";
    }

    let config = utils.cli2cfg($config.value);
    let code = $editor.value;

    $config.addEventListener("change", () => {
        config = utils.cli2cfg($config.value);
        $config.value = utils.cfg2cli(config);
        refresh();
    });

    $editor.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const textarea = $editor;
            const code = textarea.value;
            const before = code.substring(0, textarea.selectionStart);
            const endPos = textarea.selectionEnd;
            const after = code.substring(endPos);
            textarea.value = before + "    " + after;
            textarea.selectionStart = textarea.selectionEnd = endPos + 4;
        }
    });

    async function refresh(first = false) {
        code = $editor.value;
        try {
            const t = performance.now();
            const result = await esbuild?.transform(code, config);
            const duration = performance.now() - t;
            if (result) {
                $output.value = result.code;
                utils.hideError();
                if (!first) $("#duration").textContent = duration.toFixed(2) + "ms";
            }
        } catch (e) {
            utils.showError(e.message);
        }
        try {
            utils.updateQuery(version, { code, config });
        } catch {}
    }

    $editor.addEventListener("input", () => refresh(false));

    refresh(true);
})().catch((reason) => {
    console.error(reason);
    $("#mask").textContent = reason?.message || reason;
});

if (import.meta.env.PROD)
    navigator.serviceWorker
        .register("./sw.js")
        .then((e) => console.log("registered sw.js in scope:", e.scope))
        .catch((e) => console.log("failed to register sw.js:", e));
