import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/bingo-app-react/", // Adjust this if necessary
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      // Any specific rollup options if needed
    },
  },
});
