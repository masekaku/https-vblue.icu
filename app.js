document.addEventListener('DOMContentLoaded', function() {
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
});

document.addEventListener('DOMContentLoaded', function() {
  const videoElement = document.getElementById('mainVideo');
  const loadingMessage = document.getElementById('loadingMessage');

  if (!videoElement || !loadingMessage) {
    console.error('HTML element (mainVideo or loadingMessage) not found.');
    return;
  }

  const baseUrls = {
    videy: "https://cdn.videy.co/",
    quax: "https://qu.ax/"
  };

  function loadVideo() {
    const urlParams = new URLSearchParams(window.location.search);
    const requestedVideoId = urlParams.get('videoID');
    const apiUrl = requestedVideoId 
      ? `/api/videos?videoID=${requestedVideoId}` 
      : `/api/videos?random=true`;

    fetch(apiUrl)
      .then(handleResponse)
      .then(handleVideoData)
      .then(initializePlayer)
      .catch(handleError);
  }

  function handleResponse(response) {
    if (!response.ok) {
      return response.text().then(text => {
        throw new Error(`HTTP error! Status: ${response.status}. Response: ${text}`);
      });
    }
    return response.json();
  }

  function handleVideoData(data) {
    if (typeof data === 'string') {
      throw new Error(`Failed to parse JSON. The server may have returned HTML. Response: ${data}`);
    }

    if (!data.videos || data.videos.length === 0) {
      throw new Error('Video not found or list is empty');
    }

    const selectedVideo = data.videos[0];
    if (!selectedVideo?.id) {
      throw new Error('Video data is incomplete');
    }

    const source = selectedVideo.source || 'videy';
    const videoUrl = (baseUrls[source] || baseUrls.videy) + selectedVideo.id + ".mp4";

    videoElement.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;
    videoElement.load();

    loadingMessage.innerHTML = '';
    videoElement.style.display = 'block';
    loadingMessage.appendChild(videoElement);
  }

  function initializePlayer() {
    try {
      const player = new Plyr(videoElement);
    } catch(e) {
      console.error("Failed to initialize Plyr:", e);
      handleError(new Error("Failed to load the video player."));
    }
  }

  function handleError(error) {
    loadingMessage.innerHTML = `
      <i data-lucide="alert-triangle" class="w-8 h-8 mr-3 text-yellow-400"></i>
      <span>Error: ${error.message}</span>
    `;
    lucide.createIcons();
    console.error('Video loading failed:', error);
  }

  loadVideo();
});