const videosPerPage = 10;
let currentPage = 1;
let allVideos = [];

function loadVideos() {
  // Example dummy data
  allVideos = Array.from({ length: 43 }, (_, i) => ({
    title: `Video Title ${i + 1}`,
    thumbnail: `https://via.placeholder.com/640x360?text=Thumbnail+${i + 1}`,
    link: `video.html?id=${i + 1}`
  }));
  displayVideos();
  displayPagination();
}

function displayVideos() {
  const grid = document.getElementById("videoGrid");
  grid.innerHTML = "";

  const start = (currentPage - 1) * videosPerPage;
  const end = start + videosPerPage;
  const currentVideos = allVideos.slice(start, end);

  currentVideos.forEach(video => {
    const videoEl = document.createElement("div");
    videoEl.className = "video-item";
    videoEl.innerHTML = `
      <a href="${video.link}">
        <img src="${video.thumbnail}" alt="${video.title}" />
        <div class="video-title">${video.title}</div>
      </a>
    `;
    grid.appendChild(videoEl);
  });
}

function displayPagination() {
  const totalPages = Math.ceil(allVideos.length / videosPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, start + 2);

  for (let i = start; i <= end; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === currentPage ? "active" : "";
    btn.onclick = () => {
      currentPage = i;
      displayVideos();
      displayPagination();
    };
    pagination.appendChild(btn);
  }

  if (end < totalPages) {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.onclick = () => {
      currentPage++;
      displayVideos();
      displayPagination();
    };
    pagination.appendChild(nextBtn);
  }
}

function handleSearch(value) {
  const query = value.toLowerCase();
  const filtered = allVideos.filter(video => video.title.toLowerCase().includes(query));
  const grid = document.getElementById("videoGrid");
  grid.innerHTML = "";

  filtered.forEach(video => {
    const videoEl = document.createElement("div");
    videoEl.className = "video-item";
    videoEl.innerHTML = `
      <a href="${video.link}">
        <img src="${video.thumbnail}" alt="${video.title}" />
        <div class="video-title">${video.title}</div>
      </a>
    `;
    grid.appendChild(videoEl);
  });

  document.getElementById("pagination").style.display = filtered.length === allVideos.length ? "block" : "none";
}

window.onload = loadVideos;




