import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import autoprefixer from "autoprefixer";
import path from "path";
import tailwindcss from "tailwindcss";

export default defineConfig(({ mode }) => {
  const projectRoot = __dirname;
  const env = loadEnv(mode, projectRoot, "");
  const apiTarget = env.VITE_API_URL || "http://localhost:4000";
  const buildOutDir = env.BUILD_OUTPUT_DIR
    ? path.resolve(projectRoot, env.BUILD_OUTPUT_DIR)
    : path.resolve(projectRoot, "../backend/public");

  return {
    root: projectRoot,
    envDir: projectRoot,
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [react()],
    build: {
      outDir: buildOutDir,
      emptyOutDir: true,
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss({ config: path.resolve(projectRoot, "./tailwind.config.cjs") }),
          autoprefixer(),
        ],
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
