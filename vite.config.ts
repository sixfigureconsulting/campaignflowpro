import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Plugin to optimize CSS loading - makes CSS non-render-blocking
const cssLoadingOptimizer = (): Plugin => ({
  name: 'css-loading-optimizer',
  enforce: 'post',
  transformIndexHtml(html) {
    // Transform stylesheet links to use preload pattern for async loading
    return html.replace(
      /<link rel="stylesheet" crossorigin href="([^"]+\.css)">/g,
      (_, cssHref) => {
        return `<link rel="preload" href="${cssHref}" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="${cssHref}"></noscript>`;
      }
    );
  }
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" && cssLoadingOptimizer()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
