let allVideos = [];
let currentPage = 1;
const videosPerPage = 6;

const videoGrid = document.getElementById('videoGrid');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const categoryFiltersContainer = document.getElementById('category-filters');

async function fetchVideos() {
  try {
    const res = await fetch('videos.json');
    const data = await res.json();
    allVideos = data.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    createCategoryFilters();
    renderPage(1);
  } catch (err) {
    console.error('Failed to load videos:', err);
    videoGrid.innerHTML = '<div class="no-results">Failed to load videos.</div>';
  }
}

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
  if (category === 'all') {
    renderPage(1);
    searchInput.value = '';
  } else {
    const filtered = allVideos.filter(video => video.categories.includes(category));
    renderFiltered(filtered);
    searchInput.value = '';
  }
  setActiveCategory(category);
}

function setActiveCategory(category) {
  categoryFiltersContainer.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });
}

function renderPage(page) {
  currentPage = page;
  const start = (page - 1) * videosPerPage;
  const end = start + videosPerPage;
  const paginatedVideos = allVideos.slice(start, end);

  renderVideoCards(paginatedVideos);
  renderPagination(allVideos.length);
}

function renderFiltered(videos) {
  if (videos.length === 0) {
    videoGrid.innerHTML = `<div class="no-results">No videos found.</div>`;
    pagination.innerHTML = '';
    return;
  }
  renderVideoCards(videos);
  pagination.innerHTML = '';
}

function renderVideoCards(videos) {
  videoGrid.innerHTML = videos
    .map(video => `
      <a href="video.html?id=${video.id}" class="video-card-link" role="listitem" aria-label="Watch ${video.title}">
        <div class="video-card">
          <img src="${video.thumb}" loading="lazy" alt="${video.title} thumbnail" class="video-thumb" />
          <div class="video-title">${video.title}</div>
        </div>
      </a>
    `)
    .join('');
}

function renderPagination(totalVideos) {
  const totalPages = Math.ceil(totalVideos / videosPerPage);
  pagination.innerHTML = '';

  if (totalPages <= 1) return;

  // Previous button
  if (currentPage > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.innerText = '← Prev';
    prevBtn.onclick = () => renderPage(currentPage - 1);
    pagination.appendChild(prevBtn);
  }

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.innerText = i;
    if (i === currentPage) btn.classList.add('active');
    btn.onclick = () => renderPage(i);
    pagination.appendChild(btn);
  }

  // Next button
  if (currentPage < totalPages) {
    const nextBtn = document.createElement('button');
    nextBtn.innerText = 'Next →';
    nextBtn.onclick = () => renderPage(currentPage + 1);
    pagination.appendChild(nextBtn);
  }
}

function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    filterByCategory('all');
    return;
  }
  const filtered = allVideos.filter(v => v.title.toLowerCase().includes(query));
  renderFiltered(filtered);
  setActiveCategory(''); // reset category highlight on search
}

searchInput.addEventListener('input', handleSearch);

fetchVideos();

// Hamburger toggle for nav menu
document.getElementById('hamburger').addEventListener('click', () => {
  const menu = document.getElementById('nav-menu');
  const expanded = menu.classList.toggle('show');
  document.getElementById('hamburger').setAttribute('aria-expanded', expanded);
});



