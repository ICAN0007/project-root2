let videos = [];
let filteredVideos = [];
let currentPage = 1;
const itemsPerPage = 10;

async function loadVideos() {
  try {
    const res = await fetch('videos.json');
    const data = await res.json();
    videos = data.reverse(); // latest first
    filteredVideos = videos;
    displayVideos(currentPage);
    setupPagination();
  } catch (error) {
    console.error("Failed to load videos:", error);
  }
}

function displayVideos(page) {
  const videoGrid = document.getElementById("videoGrid");
  videoGrid.innerHTML = "";

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const videosToShow = filteredVideos.slice(start, end);

  if (videosToShow.length === 0) {
    videoGrid.innerHTML = "<p>No videos found.</p>";
    return;
  }

  videosToShow.forEach(video => {
    const card = document.createElement("div");
    card.className = "video-card";
    card.innerHTML = `
      <a href="video.html?vid=${video.id}">
        <img src="${video.thumbnail}" alt="${video.title}" />
        <div class="video-title">${video.title}</div>
      </a>
    `;
    videoGrid.appendChild(card);
  });
}

function setupPagination() {
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  let maxVisible = 3;
  let start = Math.max(1, currentPage - 1);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (start > 1) {
    pagination.appendChild(createPageButton("1"));
    if (start > 2) pagination.appendChild(createEllipsis());
  }

  for (let i = start; i <= end; i++) {
    pagination.appendChild(createPageButton(i));
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pagination.appendChild(createEllipsis());
    pagination.appendChild(createPageButton(totalPages));
  }
}

function createPageButton(page) {
  const btn = document.createElement("button");
  btn.textContent = page;
  btn.className = "page-btn";
  if (parseInt(page) === currentPage) btn.classList.add("active");

  btn.addEventListener("click", () => {
    currentPage = parseInt(page);
    displayVideos(currentPage);
    setupPagination();
  });

  return btn;
}

function createEllipsis() {
  const span = document.createElement("span");
  span.textContent = "...";
  span.style.color = "#999";
  return span;
}

function handleSearch(query) {
  query = query.toLowerCase();
  filteredVideos = videos.filter(video => video.title.toLowerCase().includes(query));
  currentPage = 1;
  displayVideos(currentPage);
  setupPagination();
}

loadVideos();




