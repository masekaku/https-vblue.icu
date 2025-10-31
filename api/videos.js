// File: api/videos.js
// Dijalankan di server Cloudflare, BUKAN di browser
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Membaca file database dari folder 'api' yang sama
    const filePath = path.join(__dirname, 'video_data.json');
    const fileContents = await fs.promises.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    const { videoID, random } = req.query;

    let videoToReturn = null;

    if (videoID) {
      // 1. Cari video berdasarkan ID
      videoToReturn = data.videos.find(v => v.id === videoID);
      if (!videoToReturn) {
        // Jika ID diminta tapi tidak ada, kirim 404
        return res.status(404).json({ error: 'Video not found' });
      }
    } else if (random === 'true') {
      // 2. Ambil video acak
      const randomIndex = Math.floor(Math.random() * data.videos.length);
      videoToReturn = data.videos[randomIndex];
    } else {
      // 3. Ambil video pertama sebagai default (jika ?random=false atau tidak ada)
      videoToReturn = data.videos[0];
    }

    if (!videoToReturn) {
       // Jika database kosong
       return res.status(500).json({ error: 'No videos available' });
    }

    // Kirim data sebagai respons
    // app.js mengharapkan format { videos: [...] }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ videos: [videoToReturn] });

  } catch (error) {
    console.error('Error reading video data:', error);
    res.status(500).json({ error: 'Failed to load video data' });
  }
}