let currentPage = 1;
const videosPerPage = 6;
let allVideos = [];

function toggleMenu() {
  document.getElementById("menu").classList.toggle("show");
}

fetch('videos.json')
  .then(res => res.json())
  .then(videos => {
    allVideos = videos.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    renderVideos();
  });

function renderVideos() {
  const start = (currentPage - 1) * videosPerPage;
  const end = start + videosPerPage;
  const grid = document.getElementById("videoGrid");
  grid.innerHTML = "";

  const paginated = allVideos.slice(start, end);
  paginated.forEach(video => {
    const card = document.createElement("div");
    card.innerHTML = `
      <a href="video.html?id=${video.id}">
        <img src="${video.thumb}" style="width:510px; height:290px; object-fit:cover;" />
        <div class="p-2">
          <h4 class="font-bold text-sm">${video.title}</h4>
        </div>
      </a>
    `;
    grid.appendChild(card);
  });

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(allVideos.length / videosPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const prevBtn = `<button onclick="changePage(-1)" ${currentPage === 1 ? "disabled" : ""}>Prev</button>`;
  const nextBtn = `<button onclick="changePage(1)" ${currentPage === totalPages ? "disabled" : ""}>Next</button>`;

  let pageNumbers = "";
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers += `<button onclick="goToPage(${i})" ${i === currentPage ? "disabled" : ""}>${i}</button>`;
  }

  pagination.innerHTML = prevBtn + pageNumbers + nextBtn;
}

function changePage(step) {
  const totalPages = Math.ceil(allVideos.length / videosPerPage);
  currentPage += step;
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;
  renderVideos();
}

function goToPage(page) {
  currentPage = page;
  renderVideos();
}

function handleSearch(query) {
  query = query.trim().toLowerCase();
  if (query === "") {
    fetch('videos.json')
      .then(res => res.json())
      .then(videos => {
        allVideos = videos.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        currentPage = 1;
        renderVideos();
      });
    return;
  }

  const filtered = allVideos.filter(video =>
    video.title.toLowerCase().includes(query)
  );

  const grid = document.getElementById("videoGrid");
  const pagination = document.getElementById("pagination");
  grid.innerHTML = "";
  pagination.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML = "<p>No videos found.</p>";
    return;
  }

  filtered.forEach(video => {
    const card = document.createElement("div");
    card.innerHTML = `
      <a href="video.html?id=${video.id}">
        <img src="${video.thumb}" style="width:510px; height:290px; object-fit:cover;" />
        <div class="p-2">
          <h4 class="font-bold text-sm">${video.title}</h4>
        </div>
      </a>
    `;
    grid.appendChild(card);
  });
}




