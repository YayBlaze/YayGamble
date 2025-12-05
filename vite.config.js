import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  server: {
    port: 5912,
    strictPort: false,
  },

  preview: {
    port: 5911,
    strictPort: false,
  },
});
