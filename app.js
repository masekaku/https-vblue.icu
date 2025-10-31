// File: app.js

document.addEventListener('DOMContentLoaded', async () => {
        
  // --- 1. Logika Menu Mobile & Ikon ---
  try {
    lucide.createIcons();
  } catch (e) {
    console.error('Lucide icons failed to load.', e);
  }
  
  const menuBtn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !isExpanded);
      
      if (isExpanded) {
        menu.classList.add('hidden');
        menu.style.display = 'none';
      } else {
        menu.classList.remove('hidden');
        menu.style.display = 'block';
      }
      
      const icon = menuBtn.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', isExpanded ? 'menu' : 'x');
        lucide.createIcons();
      }
    });
  }

  // --- 2. Logika Pemuatan Video Dinamis (Versi Pretty URL) ---
  
  const videoPlayer = document.getElementById('videoPlayer');
  const videoContainer = document.getElementById('videoContainer');
  let player; 

  try {
      // Dapatkan path URL (misal: "/f/vid_abc_123")
      const path = window.location.pathname;
      
      // Pisahkan path untuk mendapatkan ID-nya
      // path.split('/') akan menjadi ["", "f", "vid_abc_100"]
      const pathParts = path.split('/');
      
      // Ambil bagian terakhir sebagai ID, hapus trailing slash jika ada
      let videoId = pathParts[pathParts.length - 1];
      if (videoId === "") {
        videoId = pathParts[pathParts.length - 2]; // Ambil sebelum trailing slash
      }

      // Cek apakah path diawali dengan /f/
      const isPrettyUrlFormat = path.startsWith('/f/') && videoId;

      if (!isPrettyUrlFormat) {
           // Jika format URL salah (bukan /f/ atau ID kosong)
          throw new Error('Format URL tidak valid.');
      }

      // Ambil videos.json dari root domain
      // PENTING: Pastikan videos.json ada di root /
      const response = await fetch('/chrome.json'); 
      if (!response.ok) {
          throw new Error('Gagal memuat file chrome.json');
      }
      const chrome = await response.json();

      // Cari video yang cocok
      const videoData = chrome.find(v => v.id_unik_video === videoId);

      if (videoData) {
          // Video DITEMUKAN
          const source = document.createElement('source');
          source.setAttribute('src', videoData.url_video);
          source.setAttribute('type', 'video/mp4'); 
          videoPlayer.appendChild(source);
          
          // Inisialisasi Plyr
          player = new Plyr(videoPlayer);
      } else {
          // Video TIDAK DITEMUKAN
          throw new Error('Video dengan ID ini tidak tersedia.');
      }

  } catch (error) {
      console.error('Error memuat video:', error.message);
      if (videoContainer) {
          videoContainer.innerHTML = `
              <div class="video-error-message">
                  <i data-lucide="alert-triangle" class="w-8 h-8 mr-3 text-yellow-400"></i>
                  <span>Error: ${error.message}</span>
              </div>
          `;
          lucide.createIcons();
      }
  }
});

