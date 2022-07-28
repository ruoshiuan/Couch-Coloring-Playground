import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  assetsInclude: ['**/*.glb'],
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1500
  },
});
