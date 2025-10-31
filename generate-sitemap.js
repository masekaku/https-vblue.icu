// generate-sitemap.js
// Static sitemap generator for Vercel (no Next.js)

const fs = require("fs");
const path = require("path");

const baseUrl = "https://vblue.icu"; // Ganti dengan domain kamu
const dataPath = path.join(__dirname, "video_data.json");

// Baca data video dari file JSON
const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
const videos = data.videos || [];

// Buat daftar URL berdasarkan ID video
const urls = videos.map(video => `
  <url>
    <loc>${baseUrl}/?videoID=${video.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`).join("");

// Template sitemap lengkap
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${urls}
</urlset>`;

// Pastikan folder 'public' ada
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

// Tulis sitemap.xml
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);

console.log("✅ sitemap.xml generated successfully!");