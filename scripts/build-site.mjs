import { mkdir, rm, copyFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const outputDirectory = join(projectRoot, "dist");
const files = [
  "index.html",
  "site.css",
  "script.js",
  "icons.svg",
  "img-1.webp",
  "img-2.webp",
  "img-3.webp",
  "map-preview.webp",
];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const file of files) {
  await copyFile(join(projectRoot, file), join(outputDirectory, file));
}
