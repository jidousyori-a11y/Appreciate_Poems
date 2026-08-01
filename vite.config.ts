import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { registerApiPlugin } from "./src/devServer/registerApiPlugin";
import { changelogApiPlugin } from "./src/devServer/changelogApiPlugin";

// base: "./" にすることで GitHub Pages のプロジェクトページ
// (https://<user>.github.io/<repo>/) 配下でも相対パスで動作する
export default defineConfig({
  base: "./",
  plugins: [react(), registerApiPlugin(), changelogApiPlugin()],
  server: {
    host: "0.0.0.0",
    port: 10508,
    strictPort: true,
  },
});
