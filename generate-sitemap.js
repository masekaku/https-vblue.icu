// generate-sitemap.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = "https://vblue.icu";
const jsonPath = path.join(__dirname, "api", "video_data.json");
const publicDir = path.join(__dirname, "public");

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

const sitemapPath = path.join(publicDir, "sitemap.xml");
const robotsPath = path.join(publicDir, "robots.txt");

const rawData = fs.readFileSync(jsonPath, "utf-8");
const data = JSON.parse(rawData);

const urls = data.videos.map(
  (v) => `
  <url>
    <loc>${baseUrl}/f/${v.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${urls.join("\n")}
</urlset>`;

fs.writeFileSync(sitemapPath, sitemap.trim());
console.log("✅ sitemap.xml generated successfully!");

// ---- Generate robots.txt ----
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

fs.writeFileSync(robotsPath, robotsTxt.trim());
console.log("✅ robots.txt generated successfully!");