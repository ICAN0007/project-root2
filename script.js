let allVideos = [];
let currentPage = 1;
const videosPerPage = 6;

const videoGrid = document.getElementById('videoGrid');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const categoryFiltersContainer = document.getElementById('category-filters');
const hashtagFiltersContainer = document.getElementById('hashtag-filters');

const viralBtn = document.getElementById('viralBtn');
const latestBtn = document.getElementById('latestBtn');

let activeCategory = 'all';
let activeHashtag = '';

async function fetchVideos() {
  try {
    const res = await fetch('videos.json');
    const data = await res.json();
    allVideos = data.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    createCategoryFilters();
    createHashtagFilters();
    renderPage(1);
  } catch (err) {
    console.error('Failed to load videos:', err);
    videoGrid.innerHTML = '<div class="no-results">Failed to load videos.</div>';
  }
}

// CATEGORY FILTERS
function createCategoryFilters() {
  const categoriesSet = new Set();
  allVideos.forEach(video => video.categories.forEach(cat => categoriesSet.add(cat)));

  const categories = ['all', ...Array.from(categoriesSet)];
  categoryFiltersContainer.innerHTML = categories
    .map(cat => `<button class="category-btn" data-category="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</button>`)
    .join('');
  categoryFiltersContainer.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterByCategory(btn.dataset.category);
    });
  });
}

function filterByCategory(category) {
  activeCategory = category;
  activeHashtag = '';
  setActiveCategory(category);
  setActiveHashtag('');
  setQuickFilterActive(null);
  searchInput.value = '';
  renderPage(1);
}

function setActiveCategory(category) {
  categoryFiltersContainer.querySelectorAll('.category-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.category === category));
}

// HASHTAG FILTERS
function createHashtagFilters() {
  const tagsSet = new Set();
  allVideos.forEach(video => video.tags?.forEach(tag => tagsSet.add(tag)));
  const hashtags = ['all', ...Array.from(tagsSet)];
  hashtagFiltersContainer.innerHTML = hashtags
    .map(tag => `<button class="hashtag-btn" data-hashtag="${tag}">#${tag.charAt(0).toUpperCase() + tag.slice(1)}</button>`)
    .join('');
  hashtagFiltersContainer.querySelectorAll('.hashtag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterByHashtag(btn.dataset.hashtag);
    });
  });
}

function filterByHashtag(hashtag) {
  activeHashtag = hashtag;
  activeCategory = 'all';
  setActiveHashtag(hashtag);
  setActiveCategory('');
  setQuickFilterActive(null);
  searchInput.value = '';
  renderPage(1);
}

function setActiveHashtag(tag) {
  hashtagFiltersContainer.querySelectorAll('.hashtag-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.hashtag === tag));
}

// PAGINATION AND RENDERING
function renderPage(page) {
  currentPage = page;

  let filteredVideos = allVideos;

  if (activeCategory !== 'all' && activeCategory) {
    filteredVideos = allVideos.filter(video => video.categories.includes(activeCategory));
  } else if (activeHashtag !== 'all' && activeHashtag) {
    filteredVideos = allVideos.filter(video => video.tags?.includes(activeHashtag));
  }

  const start = (page - 1) * videosPerPage;
  const end = start + videosPerPage;
  const paginatedVideos = filteredVideos.slice(start, end);

  renderVideoCards(paginatedVideos);
  renderPagination(filteredVideos.length);
}

function renderVideoCards(videos) {
  videoGrid.innerHTML = videos.length === 0
    ? '<div class="no-results">No videos found.</div>'
    : videos.map(video => `
      <a href="video.html?id=${video.id}" class="video-card-link" role="listitem" aria-label="Watch ${video.title}">
        <div class="video-card">
          <img src="${video.thumb}" loading="lazy" alt="${video.title} thumbnail" class="video-thumb" />
          <div class="video-title">${video.title}</div>
        </div>
      </a>
    `).join('');
}

function renderPagination(totalVideos) {
  const totalPages = Math.ceil(totalVideos / videosPerPage);
  pagination.innerHTML = '';

  if (totalPages <= 1) return;

  if (currentPage > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.innerText = '← Prev';
    prevBtn.onclick = () => renderPage(currentPage - 1);
    pagination.appendChild(prevBtn);
  }

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.innerText = i;
    if (i === currentPage) btn.classList.add('active');
    btn.onclick = () => renderPage(i);
    pagination.appendChild(btn);
  }

  if (currentPage < totalPages) {
    const nextBtn = document.createElement('button');
    nextBtn.innerText = 'Next →';
    nextBtn.onclick = () => renderPage(currentPage + 1);
    pagination.appendChild(nextBtn);
  }
}

// SEARCH
function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    activeCategory = 'all';
    activeHashtag = '';
    setActiveCategory('all');
    setActiveHashtag('');
    setQuickFilterActive(null);
    renderPage(1);
    return;
  }
  const filtered = allVideos.filter(v => v.title.toLowerCase().includes(query));
  renderFiltered(filtered);
  setActiveCategory('');
  setActiveHashtag('');
  setQuickFilterActive(null);
}

function renderFiltered(videos) {
  if (videos.length === 0) {
    videoGrid.innerHTML = '<div class="no-results">No videos found.</div>';
    pagination.innerHTML = '';
    return;
  }
  renderVideoCards(videos);
  pagination.innerHTML = '';
}

searchInput.addEventListener('input', handleSearch);

// QUICK FILTER BUTTONS (Viral, Latest)
function setQuickFilterActive(type) {
  viralBtn.classList.toggle('active', type === 'viral');
  latestBtn.classList.toggle('active', type === 'latest');
}

viralBtn.addEventListener('click', () => {
  activeCategory = 'viral';
  activeHashtag = '';
  setActiveCategory('viral');
  setActiveHashtag('');
  setQuickFilterActive('viral');
  searchInput.value = '';
  renderPage(1);
});

latestBtn.addEventListener('click', () => {
  activeCategory = 'latest';
  activeHashtag = '';
  setActiveCategory('latest');
  setActiveHashtag('');
  setQuickFilterActive('latest');
  searchInput.value = '';
  renderPage(1);
});

// Reset quick filters when search or other filters used
searchInput.addEventListener('input', () => setQuickFilterActive(null));
categoryFiltersContainer.addEventListener('click', () => setQuickFilterActive(null));
hashtagFiltersContainer.addEventListener('click', () => setQuickFilterActive(null));

// Hamburger menu
document.getElementById('hamburger').addEventListener('click', () => {
  const menu = document.getElementById('nav-menu');
  const expanded = menu.classList.toggle('show');
  document.getElementById('hamburger').setAttribute('aria-expanded', expanded);
});

fetchVideos();



