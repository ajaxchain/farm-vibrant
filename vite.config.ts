import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import ViteCompression from "vite-plugin-compression";
import { resolve, dirname } from "node:path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), ViteCompression()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // web3: 'web3/dist/web3.min.js',
    },
  },
  build: {
    chunkSizeWarningLimit: 500000,
  },
});
