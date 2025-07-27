const menu = document.getElementById('nav-menu');
const hamburger = document.getElementById('hamburger');
const ageModal = document.getElementById('age-modal');
const ageYesBtn = document.getElementById('age-yes');
const ageNoBtn = document.getElementById('age-no');

hamburger.addEventListener('click', () => {
  const expanded = menu.classList.toggle('show');
  hamburger.setAttribute('aria-expanded', expanded);
});

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

async function loadVideo() {
  try {
    const response = await fetch('videos.json');
    const videos = await response.json();

    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('id');
    const video = videos.find(v => v.id === videoId);

    if (!video) {
      document.getElementById('video-title').textContent = "Video not found.";
      document.getElementById('video-player').style.display = 'none';
      return;
    }

    document.getElementById('video-player').src = video.src;
    document.getElementById('video-title').textContent = video.title;
    document.getElementById('video-description').textContent = video.description || '';
    document.getElementById('video-duration').textContent = `Duration: ${formatDuration(video.duration)}`;

    // Track views locally
    const viewKey = `video_views_${video.id}`;
    let views = +localStorage.getItem(viewKey) || 0;
    views++;
    localStorage.setItem(viewKey, views);

    // Related videos by category
    let related = videos.filter(v =>
      v.id !== videoId && v.categories.some(cat => video.categories.includes(cat))
    );
    if (related.length === 0) {
      related = videos.filter(v => v.id !== videoId).sort(() => 0.5 - Math.random());
    }
    related = related.slice(0, 6);

    const relatedDiv = document.getElementById('related-videos');
    relatedDiv.innerHTML = '';
    related.forEach(v => {
      const card = document.createElement('div');
      card.innerHTML = `
        <a href="video.html?id=${v.id}" class="related-video-link" aria-label="Watch ${v.title}">
          <img src="${v.thumb}" loading="lazy" alt="${v.title} thumbnail" class="video-thumb" />
          <div class="video-title">${v.title}</div>
        </a>
      `;
      relatedDiv.appendChild(card);
    });

  } catch (err) {
    console.error('Failed to load video data:', err);
  }
}

function checkAgeConfirmation() {
  const confirmed = localStorage.getItem('age_confirmed');
  if (!confirmed) {
    ageModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  } else {
    loadVideo();
  }
}

ageYesBtn.addEventListener('click', () => {
  localStorage.setItem('age_confirmed', '1');
  ageModal.classList.add('hidden');
  document.body.style.overflow = '';
  loadVideo();
});

ageNoBtn.addEventListener('click', () => {
  window.location.href = 'https://google.com';
});

// Run on page load
checkAgeConfirmation();
