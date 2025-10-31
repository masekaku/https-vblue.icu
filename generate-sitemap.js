const fs = require("fs");
const path = require("path");

const baseUrl = "https://vblue.icu";
const dataPath = path.join(__dirname, "api", "video_data.json");

if (!fs.existsSync(dataPath)) {
  console.error("❌ video_data.json not found:", dataPath);
  process.exit(1);
}

const rawData = fs.readFileSync(dataPath, "utf8");
const data = JSON.parse(rawData);

if (!data.videos || !Array.isArray(data.videos)) {
  console.error("❌ Invalid JSON format. Expected 'videos' array.");
  process.exit(1);
}

const urls = data.videos.map((video) => {
  return `
    <url>
      <loc>${baseUrl}/?videoID=${video.id}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `;
});

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${urls.join("\n")}
</urlset>`;

fs.writeFileSync(path.join(__dirname, "sitemap.xml"), sitemapContent.trim());
console.log("✅ sitemap.xml generated successfully!");