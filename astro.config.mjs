// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  // Add your actual domain here
  site: "https://nutzy.nl",

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
  integrations: [svelte()],
});