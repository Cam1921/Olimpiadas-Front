// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

// En ESM no existe __dirname, lo recreamos así:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "build",
    assetsDir: "static",
  },
});
