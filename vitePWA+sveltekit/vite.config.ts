import devtoolsJson from "vite-plugin-devtools-json";
import { sveltekit } from "@sveltejs/kit/vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  /**
   * If your custom service working is importing any workbox-* module (workbox-routing, workbox-strategies, etc.),
   * you will need to hack Vite build process in order to remove non ESM special replacements from the build
   * process (if you don't include process.env.NODE_ENV, the service worker will not be registered).
   *
   * Source: https://vite-pwa-org.netlify.app/frameworks/sveltekit.html#generate-custom-service-worker
   * */
  define: {
    "process.env.NODE_ENV":
      command === "serve" ? '"development"' : '"production"',
  },

  plugins: [
    sveltekit(),
    SvelteKitPWA({
      registerType: "autoUpdate",
      strategies: "injectManifest",
      srcDir: "src",
      filename:
        command === "serve" ? "service-worker/index.ts" : "service-worker.js",

      // https://vite-pwa-org.netlify.app/guide/development.html#plugin-configuration
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
    devtoolsJson(),
  ],
}));
