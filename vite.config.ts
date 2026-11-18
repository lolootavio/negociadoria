import path from "node:path";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

// Build independente da Lovable: TanStack Start + Nitro (preset Vercel).
export default defineConfig(({ command }) => ({
  plugins: [
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    // Usa src/server.ts (wrapper de erro SSR) como entrada do servidor.
    tanstackStart({ server: { entry: "server" } }),
    ...(command === "build" ? [nitro({ preset: "vercel" })] : []),
    viteReact(),
  ],
  css: { transformer: "lightningcss" },
  resolve: {
    alias: { "@": path.resolve(process.cwd(), "src") },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  server: { host: true, port: 8080 },
}));
