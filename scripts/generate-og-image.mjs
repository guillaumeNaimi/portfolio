/**
 * Generates public/og-image.png at 1200×630 using Playwright.
 * Run: node scripts/generate-og-image.mjs
 */
import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const photoPath = resolve(root, "public/companies/me.jpg");
const photoB64 = readFileSync(photoPath).toString("base64");
const photoSrc = `data:image/jpeg;base64,${photoB64}`;

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 630px;
    background: #0e0e10;
    font-family: -apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", Arial, sans-serif;
    display: flex;
    overflow: hidden;
    position: relative;
  }

  /* Subtle grid pattern */
  body::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  .left {
    flex: 1;
    padding: 60px 64px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0;
    position: relative;
    z-index: 1;
  }

  .right {
    width: 600px;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }

  .photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 40% 15%;
  }

  .photo-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right,
      #0e0e10 0%,
      rgba(14,14,16,0.4) 15%,
      rgba(14,14,16,0) 35%
    );
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 52px;
  }

  .logo-box {
    width: 36px;
    height: 36px;
    background: #fafafa;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: #0e0e10;
    letter-spacing: -0.02em;
  }

  .logo-domain {
    font-size: 15px;
    color: #71717a;
    font-weight: 400;
    letter-spacing: 0.01em;
  }

  .name {
    font-size: 68px;
    font-weight: 800;
    color: #fafafa;
    line-height: 1.0;
    letter-spacing: -0.03em;
    margin-bottom: 18px;
  }

  .title {
    font-size: 26px;
    font-weight: 500;
    color: #a1a1aa;
    margin-bottom: 40px;
    letter-spacing: -0.01em;
  }

  .tags {
    display: flex;
    gap: 8px;
  }

  .tag {
    padding: 5px 14px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: #71717a;
    letter-spacing: 0.01em;
  }
</style>
</head>
<body>
  <div class="left">
    <div class="logo">
      <div class="logo-box">GN</div>
      <span class="logo-domain">guillaumenaimi.dev</span>
    </div>
    <div class="name">Guillaume<br>Naimi</div>
    <div class="title">Front-end Developer</div>
    <div class="tags">
      <span class="tag">React</span>
      <span class="tag">TypeScript</span>
      <span class="tag">TanStack</span>
    </div>
  </div>
  <div class="right">
    <img class="photo" src="${photoSrc}" alt="">
    <div class="photo-overlay"></div>
  </div>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(html, { waitUntil: "networkidle" });

const buffer = await page.screenshot({ type: "png" });
writeFileSync(resolve(root, "public/og-image.png"), buffer);

await browser.close();

console.log("Generated public/og-image.png (1200×630)");
