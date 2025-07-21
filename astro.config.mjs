// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://nutzy.nl", // Add your actual domain here
  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});
