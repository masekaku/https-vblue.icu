// File: app.js
// Video Loader Module (Sistem Baru)

document.addEventListener('DOMContentLoaded', function() {
    // Elemen HTML yang baru
    const videoElement = document.getElementById('mainVideo');
    const loadingMessage = document.getElementById('loadingMessage');
    
    // Basis URL Anda
    const baseUrls = {
        videy: "https://cdn.videy.co/",
        quax: "https://qu.ax/"
    };
    let player; // Variabel untuk Plyr

    // --- Logika Menu Mobile & Ikon ---
    try {
      if (lucide) lucide.createIcons();
    } catch (e) { console.error('Lucide icons failed to load.', e); }

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
          if (lucide) lucide.createIcons();
        }
      });
    }
    // --- Akhir Logika Menu ---


    function loadVideo() {
        // Logika baru Anda: membaca ?videoID=
        const urlParams = new URLSearchParams(window.location.search);
        const requestedVideoId = urlParams.get('videoID');
        
        // Memanggil API berdasarkan ?videoID
        const apiUrl = requestedVideoId 
            ? `/api/videos?videoID=${requestedVideoId}` 
            : `/api/videos?random=true`; // Meminta video acak jika tidak ada ID

        fetch(apiUrl)
            .then(handleResponse)
            .then(handleVideoData)
            .catch(handleError);
    }

    function handleResponse(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    function handleVideoData(data) {
        if (!data.videos || data.videos.length === 0) {
            throw new Error('Video not found or list is empty');
        }

        const selectedVideo = data.videos[0];
        
        // Memastikan 'id' dan 'source' ada
        if (!selectedVideo?.id || !selectedVideo?.source) {
            throw new Error('Video data is incomplete (missing id or source)');
        }

        // Membangun URL sesuai logika baru Anda
        const source = selectedVideo.source || 'videy';
        const videoUrl = (baseUrls[source] || baseUrls.videy) + selectedVideo.id + ".mp4";

        // Memasukkan source ke video
        videoElement.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;
        
        // Menampilkan video & menyembunyikan loading
        videoElement.style.display = 'block';
        const loadingDiv = loadingMessage.querySelector('.video-loading-message');
        if (loadingDiv) loadingDiv.style.display = 'none';

        // Inisialisasi Plyr SETELAH video dimuat
        player = new Plyr(videoElement);
    }

    function handleError(error) {
        // Menampilkan error di dalam container
        const loadingDiv = loadingMessage.querySelector('.video-loading-message');
        if (loadingDiv) {
            loadingDiv.innerHTML = `
                <i data-lucide="alert-triangle" class="w-8 h-8 mr-3 text-yellow-400"></i>
                <span>Error: ${error.message}</span>
            `;
            // Render ikon error
            if (lucide) lucide.createIcons();
        }
        console.error('Video loading failed:', error);
    }

    // Memulai pemuatan video
    loadVideo();
});