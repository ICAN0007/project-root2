let allVideos = [];
let currentPage = 1;
const videosPerPage = 6;

async function fetchVideos() {
  try {
    const res = await fetch("videos.json");
    const data = await res.json();
    allVideos = data.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    renderPage(currentPage);
  } catch (err) {
    console.error("Failed to load videos:", err);
  }
}

function renderPage(page) {
  currentPage = page;
  const start = (page - 1) * videosPerPage;
  const end = start + videosPerPage;
  const paginatedVideos = allVideos.slice(start, end);
  const grid = document.getElementById("videoGrid");

  grid.innerHTML = paginatedVideos.map(video => `
    <div class="video-card" onclick="window.location.href='video.html?id=${video.id}'">
      <img src="${video.thumb}" class="video-thumb" alt="${video.title}" />
      <div class="video-title">${video.title}</div>
    </div>
  `).join("");

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(allVideos.length / videosPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(totalPages, startPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => renderPage(i);
    pagination.appendChild(btn);
  }

  if (endPage < totalPages) {
    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Next →";
    nextBtn.onclick = () => renderPage(currentPage + 1);
    pagination.appendChild(nextBtn);
  }
}

function handleSearch(query) {
  const filtered = allVideos.filter(v => 
    v.title.toLowerCase().includes(query.toLowerCase())
  );
  const grid = document.getElementById("videoGrid");

  if (!query) {
    renderPage(1);
    return;
  }

  grid.innerHTML = filtered.map(video => `
    <div class="video-card" onclick="window.location.href='video.html?id=${video.id}'">
      <img src="${video.thumb}" class="video-thumb" alt="${video.title}" />
      <div class="video-title">${video.title}</div>
    </div>
  `).join("");

  document.getElementById("pagination").innerHTML = "";
}

fetchVideos();


