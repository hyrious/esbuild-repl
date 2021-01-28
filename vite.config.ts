import prefresh from "@prefresh/vite";
import { defineConfig } from "vite";

export default defineConfig({
    esbuild: {
        jsxFactory: "h",
        jsxFragment: "Fragment",
    },
    plugins: [
        prefresh(),
        {
            name: "esbuild-serve",
            transformIndexHtml(html) {
                return html.replace(
                    /<script .*><\/script>/,
                    '<script type="module" src="/main.tsx"></script>'
                );
            },
        },
    ],
});
