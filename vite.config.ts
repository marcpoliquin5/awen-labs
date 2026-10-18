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

// Static hosts such as GitHub Pages serve 404.html for unknown paths; a copy of
// index.html lets any client-side route load. Each known route also gets its own
// index.html so direct visits return HTTP 200.
const ROUTES = ["vision", "architecture", "roadmap", "research", "docs", "downloads", "community", "about", "platform"];
const spaFallback = (): Plugin => ({
  name: "spa-fallback",
  apply: "build",
  closeBundle() {
    const out = path.resolve(import.meta.dirname, "dist");
    const index = path.join(out, "index.html");
    if (!fs.existsSync(index)) return;
    fs.copyFileSync(index, path.join(out, "404.html"));
    for (const route of ROUTES) {
      fs.mkdirSync(path.join(out, route), { recursive: true });
      fs.copyFileSync(index, path.join(out, route, "index.html"));
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
