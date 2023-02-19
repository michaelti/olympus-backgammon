import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        open: "/",
    },
    plugins: [react(), legacy()],
    optimizeDeps: {
        include: ["olympus-bg"],
    },
    build: {
        commonjsOptions: {
            include: [/olympus-bg/, /node_modules/],
        },
    },
});
