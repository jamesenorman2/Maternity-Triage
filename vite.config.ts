import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Base path: GitHub Pages project sites serve from /<repo-name>/, so the
// deploy workflow sets GITHUB_PAGES=true. Any other static host (Vercel,
// Netlify, custom domain) serves from the root, so this defaults to '/'.
const base = process.env.GITHUB_PAGES ? "/maternity-triage/" : "/";

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons/*.png"],
      manifest: {
        name: "The Midwife's Companion",
        short_name: "Midwife's Companion",
        description: "A midwife's font of knowledge for on the go — antenatal, intrapartum, postnatal and emergency reference, derived from NICE/RCOG guidance and local trust guidelines.",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        orientation: "portrait",
        start_url: base,
        scope: base,
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Precache everything the app needs so the reference library works
        // with zero network requests once installed.
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        runtimeCaching: [],
      },
    }),
  ],
});
