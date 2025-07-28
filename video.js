const isAdmin = false; // Set to true to view like/dislike counts (admin only)

const menu = document.getElementById('nav-menu');
const hamburger = document.getElementById('hamburger');
const ageModal = document.getElementById('age-modal');
const ageYesBtn = document.getElementById('age-yes');
const ageNoBtn = document.getElementById('age-no');

const likeBtn = document.getElementById('like-btn');
const dislikeBtn = document.getElementById('dislike-btn');
const likeCountsDiv = document.getElementById('like-counts');
const videoCategoriesDiv = document.getElementById('video-categories');
const videoTagsDiv = document.getElementById('video-tags');

let videoId = null;

hamburger.addEventListener('click', () => {
  const expanded = menu.classList.toggle('show');
  hamburger.setAttribute('aria-expanded', expanded);
});

function updateLikeDislikeUI(likes, dislikes, userStatus) {
  if (userStatus === 'liked') {
    likeBtn.classList.add('active');
    dislikeBtn.classList.remove('active');
  } else if (userStatus === 'disliked') {
    dislikeBtn.classList.add('active');
    likeBtn.classList.remove('active');
  } else {
    likeBtn.classList.remove('active');
    dislikeBtn.classList.remove('active');
  }

  if (isAdmin) {
    likeCountsDiv.style.display = 'block';
    likeCountsDiv.textContent = `Likes: ${likes} | Dislikes: ${dislikes}`;
  } else {
    likeCountsDiv.style.display = 'none';
  }
}

function getCounts() {
  const counts = JSON.parse(localStorage.getItem('video_likes_dislikes') || '{}');
  return counts[videoId] || { likes: 0, dislikes: 0 };
}

function setCounts(likes, dislikes) {
  const counts = JSON.parse(localStorage.getItem('video_likes_dislikes') || '{}');
  counts[videoId] = { likes, dislikes };
  localStorage.setItem('video_likes_dislikes', JSON.stringify(counts));
}

function getUserStatus() {
  return localStorage.getItem(`video_user_status_${videoId}`) || 'none';
}

function setUserStatus(status) {
  localStorage.setItem(`video_user_status_${videoId}`, status);
}

function likeClickHandler() {
  const currentStatus = getUserStatus();
  let counts = getCounts();

  if (currentStatus === 'liked') {
    counts.likes--;
    setUserStatus('none');
  } else {
    if (currentStatus === 'disliked') counts.dislikes--;
    counts.likes++;
    setUserStatus('liked');
  }
  setCounts(counts.likes, counts.dislikes);
  updateLikeDislikeUI(counts.likes, counts.dislikes, getUserStatus());
}

function dislikeClickHandler() {
  const currentStatus = getUserStatus();
  let counts = getCounts();

  if (currentStatus === 'disliked') {
    counts.dislikes--;
    setUserStatus('none');
  } else {
    if (currentStatus === 'liked') counts.likes--;
    counts.dislikes++;
    setUserStatus('disliked');
  }
  setCounts(counts.likes, counts.dislikes);
  updateLikeDislikeUI(counts.likes, counts.dislikes, getUserStatus());
}

async function loadVideo() {
  try {
    const response = await fetch('videos.json');
    const videos = await response.json();

    const params = new URLSearchParams(window.location.search);
    videoId = params.get('id');
    const video = videos.find(v => v.id === videoId);

    if (!video) {
      document.getElementById('video-title').textContent = "Video not found.";
      document.getElementById('video-player').style.display = 'none';
      return;
    }

    document.getElementById('video-player').src = video.src;
    document.getElementById('video-title').textContent = video.title;
    document.getElementById('video-description').textContent = video.description || '';

    videoCategoriesDiv.textContent = `Categories: ${video.categories.join(', ')}`;
    videoTagsDiv.textContent = `Tags: ${video.tags ? video.tags.join(', ') : 'None'}`;

    const counts = getCounts();
    updateLikeDislikeUI(counts.likes, counts.dislikes, getUserStatus());

    likeBtn.onclick = likeClickHandler;
    dislikeBtn.onclick = dislikeClickHandler;

    // Related videos by category with fallback random ones
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

checkAgeConfirmation();
