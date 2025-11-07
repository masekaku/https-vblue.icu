import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = "https://vblue.icu";
const jsonPath = path.join(__dirname, "api", "video_data.json");
const outputPath = path.join(__dirname, "public", "sitemap.xml");

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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${urls.join("\n")}
</urlset>`;

fs.writeFileSync(outputPath, sitemap.trim());
console.log("✅ sitemap.xml generated successfully!");