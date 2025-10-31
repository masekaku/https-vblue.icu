// File: app.js
// --- VERSI FINAL LENGKAP ---

// --- BAGIAN 1: Logika Menu Mobile & Ikon ---
document.addEventListener('DOMContentLoaded', function() {
  // Inisialisasi Ikon
  try {
    lucide.createIcons();
  } catch (e) {
    console.error('Lucide icons failed to load.', e);
  }

  // Logika Menu Mobile
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
        lucide.createIcons(); // Render ulang ikon yang baru
      }
    });
  }
});


// --- BAGIAN 2: Logika Pemuatan Video (Sesuai Skrip Anda) ---
document.addEventListener('DOMContentLoaded', function() {
    const videoElement = document.getElementById('mainVideo');
    const loadingMessage = document.getElementById('loadingMessage');
    
    // Pastikan elemen ada sebelum melanjutkan
    if (!videoElement || !loadingMessage) {
        console.error('Elemen HTML (mainVideo atau loadingMessage) tidak ditemukan.');
        return;
    }

    const baseUrls = {
        videy: "https://cdn.videy.co/",
        quax: "https://qu.ax/"
    };

    function loadVideo() {
        const urlParams = new URLSearchParams(window.location.search);
        const requestedVideoId = urlParams.get('videoID');
        
        // Membangun URL API
        // Jika ada ID, minta video itu.
        // Jika tidak, minta video default (saya set 'random=false' agar API mengirim video pertama)
        const apiUrl = requestedVideoId 
            ? `/api/videos?videoID=${requestedVideoId}` 
            : `/api/videos?random=true`; // Ambil video default/pertama

        fetch(apiUrl)
            .then(handleResponse)    // 1. Ubah ke JSON
            .then(handleVideoData)   // 2. Proses data video
            .then(initializePlayer)  // 3. Inisialisasi Plyr
            .catch(handleError);     // Tangani jika ada error
    }

    function handleResponse(response) {
        if (!response.ok) {
            // Jika server error (404, 500), ubah ke text agar bisa baca error HTML
            return response.text().then(text => {
                throw new Error(`HTTP error! Status: ${response.status}. Respons: ${text}`);
            });
        }
        // Jika OK, proses sebagai JSON
        return response.json();
    }

    function handleVideoData(data) {
        // Cek error 'Unexpected token '<'
        if (typeof data === 'string') {
            throw new Error(`Gagal mem-parsing JSON. Server mungkin mengirim HTML. Respons: ${data}`);
        }
        
        if (!data.videos || data.videos.length === 0) {
            throw new Error('Video not found or list is empty');
        }

        const selectedVideo = data.videos[0];
        if (!selectedVideo?.id) {
            throw new Error('Video data is incomplete');
        }

        const source = selectedVideo.source || 'videy'; // Default ke 'videy' jika source null
        const videoUrl = (baseUrls[source] || baseUrls.videy) + selectedVideo.id + ".mp4";

        // Masukkan <source> ke dalam <video>
        videoElement.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;
        videoElement.load();
        
        // Sembunyikan pesan loading dan tampilkan video
        loadingMessage.innerHTML = ''; // Hapus "Loading..."
        videoElement.style.display = 'block'; // Tampilkan video
        loadingMessage.appendChild(videoElement); // Masukkan video ke container
    }

    function initializePlayer() {
      // Inisialisasi Plyr PADA videoElement
      try {
        const player = new Plyr(videoElement);
      } catch(e) {
        console.error("Gagal menginisialisasi Plyr:", e);
        handleError(new Error("Gagal memuat pemutar video."));
      }
    }

    function handleError(error) {
        // Tampilkan error di dalam elemen loading
        loadingMessage.innerHTML = `
          <i data-lucide="alert-triangle" class="w-8 h-8 mr-3 text-yellow-400"></i>
          <span>Error: ${error.message}</span>
        `;
        lucide.createIcons(); // Render ikon error
        console.error('Video loading failed:', error);
    }

    // Mulai proses
    loadVideo();
});