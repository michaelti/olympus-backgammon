import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        open: "/",
    },
    plugins: [react()],
    optimizeDeps: {
        include: ["olympus-bg"],
    },
    build: {
        commonjsOptions: {
            include: [/olympus-bg/, /node_modules/],
        },
    },
});
