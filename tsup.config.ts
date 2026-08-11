import { cpSync, mkdirSync } from "fs";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  // Every export here needs an interactive editor (useEditor, click
  // handlers, modals) — this is never usable as a server component, so
  // stamp the whole bundle "use client" once instead of relying on every
  // consuming app's own file to remember it.
  banner: {
    js: '"use client";',
  },
  // Host app supplies these — bundling our own copies risks two React/
  // heroui instances mounted at once (broken hooks, mismatched context).
  external: ["react", "react-dom", "@heroui/react", "@heroui/styles"],
  async onSuccess() {
    mkdirSync("dist", { recursive: true });
    cpSync("src/styles/editor.css", "dist/styles.css");
  },
});
