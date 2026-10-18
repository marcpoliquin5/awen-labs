import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";
import { BRAND } from "./src/config/brand";

// Fills %BRAND_*% placeholders in index.html from src/config/brand.ts.
const brandHtml = (): Plugin => ({
  name: "brand-html",
  transformIndexHtml: (html) =>
    html
      .replaceAll("%BRAND_FULL_NAME%", BRAND.fullName)
      .replaceAll("%BRAND_NAME%", BRAND.name)
      .replaceAll("%BRAND_TAGLINE%", BRAND.tagline),
});

// Static hosts such as GitHub Pages serve 404.html for unknown paths;
// a copy of index.html lets client-side routes load directly.
const spaFallback = (): Plugin => ({
  name: "spa-fallback",
  apply: "build",
  closeBundle() {
    const out = path.resolve(import.meta.dirname, "dist");
    if (fs.existsSync(path.join(out, "index.html"))) {
      fs.copyFileSync(path.join(out, "index.html"), path.join(out, "404.html"));
    }
  },
});

export default defineConfig({
  // "/" for a custom domain; e.g. BASE_PATH=/awen-labs/ for a project Pages URL.
  base: process.env.BASE_PATH ?? "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), brandHtml(), spaFallback()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
