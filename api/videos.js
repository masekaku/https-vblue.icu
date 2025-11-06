import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    // Pastikan path absolut supaya aman di serverless environment
    const jsonPath = path.join(process.cwd(), "api", "video_data.json");
    const rawData = fs.readFileSync(jsonPath, "utf-8");
    const data = JSON.parse(rawData);

    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const videoID = searchParams.get("videoID");
    const random = searchParams.get("random");

    const allVideos = data.videos || [];
    if (allVideos.length === 0) {
      throw new Error("No videos found in database");
    }

    let videoToReturn;
    if (videoID) {
      videoToReturn = allVideos.find((v) => v.id === videoID);
      if (!videoToReturn) {
        return res.status(404).json({ error: "Video not found" });
      }
    } else if (random === "true") {
      const randomIndex = Math.floor(Math.random() * allVideos.length);
      videoToReturn = allVideos[randomIndex];
    } else {
      videoToReturn = allVideos[0];
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ videos: [videoToReturn] });
  } catch (error) {
    console.error("Error processing video data:", error.message);
    res.status(500).json({ error: "Failed to load video data" });
  }
}