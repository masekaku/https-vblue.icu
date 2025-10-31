// File: api/videos.js
// --- VERSI FINAL YANG DIPERBAIKI ---
// Menggunakan import langsung (lebih aman dari 'fs')
import data from './video_data.json';

export default async function handler(req, res) {
  // Cloudflare Pages/Functions menangani 'req' secara berbeda.
  // Cara paling aman untuk mendapatkan query adalah dari URL lengkap.
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);

  try {
    const videoID = searchParams.get('videoID');
    const random = searchParams.get('random');
    
    let videoToReturn = null;
    const allVideos = data.videos || []; // Fallback jika 'videos' tidak ada

    if (allVideos.length === 0) {
      throw new Error("No videos found in database");
    }

    if (videoID) {
      // 1. Cari video berdasarkan ID
      videoToReturn = allVideos.find(v => v.id === videoID);
      if (!videoToReturn) {
        // Jika ID diminta tapi tidak ada, kirim 404
        return res.status(404).json({ error: 'Video not found' });
      }
    } else if (random === 'true') {
      // 2. Ambil video acak
      const randomIndex = Math.floor(Math.random() * allVideos.length);
      videoToReturn = allVideos[randomIndex];
    } else {
      // 3. Ambil video PERTAMA sebagai default jika tidak ada parameter
      videoToReturn = allVideos[0];
    }

    // Kirim data sebagai respons
    // app.js mengharapkan format { videos: [...] }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ videos: [videoToReturn] });

  } catch (error) {
    console.error('Error processing video data:', error.message);
    res.status(500).json({ error: 'Failed to load video data' });
  }
}