import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const buildDir = ".output/public/assets";
const codeQualityPath = "./src/features/code-quality/code-quality.gen.json";
const publicOutputPath = "./public/code-quality.json";

const measureBundleSize = () => {
  if (!fs.existsSync(buildDir)) {
    console.error("❌ No build output found. Run bun run build first.");
    process.exit(1);
  }

  const files = fs.readdirSync(buildDir).filter((f) => f.endsWith(".js"));
  let totalGzipBytes = 0;

  for (const file of files) {
    const content = fs.readFileSync(path.join(buildDir, file));
    const gzipped = gzipSync(content, { level: 9 });
    totalGzipBytes += gzipped.length;
  }

  const bundleKb = Math.round((totalGzipBytes / 1024) * 10) / 10;

  const existing = JSON.parse(fs.readFileSync(codeQualityPath, "utf-8"));
  const updated = { ...existing, bundleKb };

  fs.writeFileSync(codeQualityPath, JSON.stringify(updated, null, 2) + "\n");
  fs.writeFileSync(publicOutputPath, JSON.stringify(updated, null, 2) + "\n");

  console.log(
    `✅ Bundle size: ${bundleKb} kB gz (${files.length} JS chunks, ${totalGzipBytes} bytes)`,
  );
};

measureBundleSize();
