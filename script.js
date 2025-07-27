let currentPage = 1;
const itemsPerPage = 10;
let filteredVideos = [...videos].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));

function toggleMenu() {
  document.getElementById("menu").classList.toggle("show");
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function renderVideos() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageVideos = filteredVideos.slice(start, end);
  
  const grid = document.getElementById("videoGrid");
  grid.innerHTML = "";

  if (pageVideos.length === 0) {
    grid.innerHTML = "<p>No videos found.</p>";
    return;
  }

  pageVideos.forEach(video => {
    const div = document.createElement("div");
    div.className = "bg-gray-800 rounded shadow hover:shadow-lg p-2";
    div.innerHTML = `
      <video class="w-full h-40 object-cover" poster="${video.thumb}" controls>
        <source src="${video.src}" type="video/mp4">
      </video>
      <div class="text-sm font-bold mt-1">${video.title}</div>
      <div class="text-xs">${video.categories.join(", ")} | ${formatDuration(video.duration)}</div>
    `;
    grid.appendChild(div);
  });

  document.getElementById("pageNum").textContent = `Page ${currentPage}`;
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = end >= filteredVideos.length;
}

function changePage(delta) {
  currentPage += delta;
  renderVideos();
}

function handleSearch(query) {
  currentPage = 1;
  query = query.toLowerCase();
  filteredVideos = videos
    .filter(v => v.title.toLowerCase().includes(query) || v.categories.join(" ").toLowerCase().includes(query))
    .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
  renderVideos();
}

window.onload = renderVideos;



