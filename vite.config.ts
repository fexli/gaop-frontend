import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import {VitePWA} from "vite-plugin-pwa";
import viteCompression from "vite-plugin-compression";
import AutoImport from 'unplugin-auto-import/vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: "autoUpdate",
        }),
        AutoImport({
            imports: ["vue", "vue-router"],
            dts: "src/plugins/auto-import.d.ts",
        }),
        viteCompression({
            verbose: true,
            disable: false,
            threshold: 10240,
            algorithm: "gzip",
            ext: ".gz",
        }),
    ],
    server: {
        hmr: {
            overlay: false
        }
        //host: '192.168.8.180',
        //host: '192.168.195.169'
    },
    build: {
        rollupOptions: {
            output: {
                chunkFileNames: "static/js/[name]-[hash].js",
                entryFileNames: "static/js/[name]-[hash].js",
                assetFileNames: "static/[ext]/[name]-[hash].[ext]",
            },
        },
    },
});
