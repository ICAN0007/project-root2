let videos = [];
let currentPage = 1;
const itemsPerPage = 9;

fetch('videos.json')
  .then(res => res.json())
  .then(data => {
    videos = data.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    renderPage(currentPage);
  });

function renderPage(page) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentVideos = videos.slice(start, end);

  const grid = document.getElementById('videoGrid');
  grid.innerHTML = currentVideos.map(video => `
    <div class="video-card" onclick="window.location.href='video.html?id=${video.id}'">
      <img class="video-thumb" src="${video.thumb}" alt="${video.title}" />
      <div class="video-title">${video.title}</div>
    </div>
  `).join('');

  renderPagination(page);
}

function renderPagination(page) {
  const totalPages = Math.ceil(videos.length / itemsPerPage);
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  let start = Math.max(1, page - 1);
  let end = Math.min(totalPages, page + 1);

  if (start > 1) {
    pagination.innerHTML += `<button onclick="changePage(1)">1</button>`;
    if (start > 2) pagination.innerHTML += `<span style="color:gray;">...</span>`;
  }

  for (let i = start; i <= end; i++) {
    pagination.innerHTML += `<button class="${i === page ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pagination.innerHTML += `<span style="color:gray;">...</span>`;
    pagination.innerHTML += `<button onclick="changePage(${totalPages})">${totalPages}</button>`;
  }
}

function changePage(page) {
  currentPage = page;
  renderPage(currentPage);
}

function handleSearch(query) {
  const filtered = videos.filter(v => v.title.toLowerCase().includes(query.toLowerCase()));
  const grid = document.getElementById('videoGrid');
  grid.innerHTML = filtered.map(video => `
    <div class="video-card" onclick="window.location.href='video.html?id=${video.id}'">
      <img class="video-thumb" src="${video.thumb}" alt="${video.title}" />
      <div class="video-title">${video.title}</div>
    </div>
  `).join('');
}


