// File: api/videos.js
// Menggunakan import langsung, bukan 'fs' (File System)
import data from './video_data.json';

export default async function handler(req, res) {
  try {
    // 'data' adalah file video_data.json yang sudah di-load
    // Tidak perlu lagi 'fs.promises.readFile'

    // Dapatkan parameter dari URL (format baru /api/videos?videoID=...)
    const url = new URL(req.url, `http://${req.headers.host}`);
    const { searchParams } = url;
    const videoID = searchParams.get('videoID');
    const random = searchParams.get('random');

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
    console.error('Error processing video data:', error);
    res.status(500).json({ error: 'Failed to load video data' });
  }
}