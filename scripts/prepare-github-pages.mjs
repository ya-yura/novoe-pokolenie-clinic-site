import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const outputRoot = resolve("dist/client");
const sitePrefix = "/shale-sante-clinic-site";
const files = ["index.html", "404.html", "index.rsc"];
const rootAssetPattern = /(["'(=])\/(assets|favicon\.svg|file\.svg|globe\.svg|window\.svg)/g;

for (const file of files) {
  const filePath = resolve(outputRoot, file);
  const contents = await readFile(filePath, "utf8");
  const patched = contents.replace(rootAssetPattern, `$1${sitePrefix}/$2`);
  await writeFile(filePath, patched);
}

const index = await readFile(resolve(outputRoot, "index.html"), "utf8");
if (!index.includes(`${sitePrefix}/assets/`) || !index.includes(`${sitePrefix}/images/clinic-04.webp`)) {
  throw new Error("GitHub Pages asset paths were not prepared");
}
