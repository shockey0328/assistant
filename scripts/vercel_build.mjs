/**
 * Vercel 构建（Node）：复制静态资源到 dist/，不依赖 Python 运行时。
 * index.html 需已提交到仓库（本地可先用 python scripts/build_index.py 生成）。
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyTree(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, ent.name);
    const d = path.join(dest, ent.name);
    if (ent.isDirectory()) copyTree(s, d);
    else copyFile(s, d);
  }
}

function rmDir(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

rmDir(DIST);
fs.mkdirSync(DIST, { recursive: true });

for (const name of ["index.html", "app.js", "style.css"]) {
  const src = path.join(ROOT, name);
  if (!fs.existsSync(src)) {
    console.error(`Missing required file: ${src}`);
    process.exit(1);
  }
  copyFile(src, path.join(DIST, name));
}

copyTree(path.join(ROOT, "config"), path.join(DIST, "config"));

const testSrc = path.join(ROOT, "data", "test");
if (fs.existsSync(testSrc)) {
  copyTree(testSrc, path.join(DIST, "data", "test"));
}

const indexJson = path.join(
  ROOT,
  "data",
  "behavior_logs",
  "week_2026_w10_index.json"
);
if (fs.existsSync(indexJson)) {
  const destDir = path.join(DIST, "data", "behavior_logs");
  fs.mkdirSync(destDir, { recursive: true });
  copyFile(indexJson, path.join(destDir, path.basename(indexJson)));
}

const assets = path.join(ROOT, "assets");
if (fs.existsSync(assets) && fs.readdirSync(assets).length > 0) {
  copyTree(assets, path.join(DIST, "assets"));
}

let count = 0;
function countFiles(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) countFiles(p);
    else count += 1;
  }
}
countFiles(DIST);
console.log(`Wrote ${DIST} (${count} files)`);
