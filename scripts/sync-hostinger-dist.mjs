import { cpSync, existsSync, rmSync } from "node:fs";

const source = ".output";
const target = "dist";

if (!existsSync(source)) {
  console.error(`[sync-hostinger-dist] Missing ${source}. Run "npm run build" first.`);
  process.exit(1);
}

if (existsSync(target)) {
  rmSync(target, { recursive: true, force: true });
}

cpSync(source, target, { recursive: true });
console.log(`[sync-hostinger-dist] Copied ${source}/ → ${target}/ for Hostinger`);
