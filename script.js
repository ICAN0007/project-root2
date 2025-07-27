let videos = [];
let currentPage = 1;
const videosPerPage = 6;

async function fetchVideos() {
  const res = await fetch("videos.json");
  videos = await res.json();
  renderVideos();
  renderPagination();
}

function renderVideos() {
  const videoGrid = document.getElementById("videoGrid");
  videoGrid.innerHTML = "";

  const start = (currentPage - 1) * videosPerPage;
  const end = start + videosPerPage;
  const pageVideos = videos.slice(start, end);

  pageVideos.forEach(video => {
    const div = document.createElement("div");
    div.className = "video-card";
    div.onclick = () => {
      window.location.href = `video.html?id=${video.id}`;
    };

    div.innerHTML = `
      <img class="video-thumb" src="${video.thumb}" alt="${video.title}" />
      <div class="video-info">
        <div class="video-title">${video.title}</div>
        <div>${Math.floor(video.duration / 60)}:${String(video.duration % 60).padStart(2, '0')}</div>
      </div>
    `;
    videoGrid.appendChild(div);
  });
  document.getElementById("pageNum").innerText = `Page ${currentPage}`;
}

function changePage(offset) {
  const totalPages = Math.ceil(videos.length / videosPerPage);
  currentPage += offset;
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;
  renderVideos();
  renderPagination();
}

function goToPage(p) {
  currentPage = p;
  renderVideos();
  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(videos.length / videosPerPage);
  const pagination = document.getElementById("pageNum");

  let html = `<button onclick="changePage(-1)">Prev</button> `;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button onclick="goToPage(${i})" ${i === currentPage ? 'style="font-weight:bold;"' : ''}>${i}</button> `;
  }
  html += `<button onclick="changePage(1)">Next</button>`;

  pagination.innerHTML = html;
}

function handleSearch(query) {
  const q = query.toLowerCase();
  videos = videos.filter(v => v.title.toLowerCase().includes(q));
  currentPage = 1;
  renderVideos();
  renderPagination();
}

fetchVideos();




