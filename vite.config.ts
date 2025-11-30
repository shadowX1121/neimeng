import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            imports: ["vue"], // 自动导入 vue 中的 API
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"), // @ 指向 src
        },
    },
});
