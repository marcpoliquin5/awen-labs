import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
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

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), brandHtml()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
