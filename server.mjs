import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const candidates = [".output/server/index.mjs", "dist/server/index.mjs"];

const entry = candidates.find((path) => existsSync(path));

if (!entry) {
  console.error(
    "[server.mjs] No production build found. Run `npm run build` first (.output/server/index.mjs).",
  );
  process.exit(1);
}

await import(pathToFileURL(resolve(entry)).href);
