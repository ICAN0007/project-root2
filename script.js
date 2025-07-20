let videos = [];
let currentPage = 1;
const itemsPerPage = 10;
let currentCategory = null;
let searchQuery = '';

const grid = document.getElementById('video-grid');
const filterBar = document.getElementById('filter-bar');
const searchInput = document.getElementById('search');

function renderVideos() {
  grid.innerHTML = '';
  let filtered = videos;
  if (currentCategory) {
    filtered = filtered.filter(v => v.categories.includes(currentCategory));
  }
  if (searchQuery) {
    filtered = filtered.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);
  paginated.forEach(v => {
    const card = document.createElement('div');
    card.className = "bg-gray-800 rounded shadow overflow-hidden hover:shadow-lg transition";
    card.innerHTML = `
      <a href="video.html?id=${v.id}">
        <img src="${v.thumb}" alt="${v.title}" class="w-full h-40 object-cover">
        <div class="p-2">
          <h3 class="font-bold text-sm truncate">${v.title}</h3>
          <p class="text-xs">${v.categories.join(", ")}</p>
        </div>
      </a>
    `;
    grid.appendChild(card);
  });
  document.getElementById('prevPage').disabled = currentPage === 1;
  document.getElementById('nextPage').disabled = (start + itemsPerPage) >= filtered.length;
}

function renderFilters() {
  const categories = [...new Set(videos.flatMap(v => v.categories))];
  filterBar.innerHTML = '';
  categories.forEach(cat => {
    const tag = document.createElement('span');
    tag.className = 'filter-tag' + (cat === currentCategory ? ' active' : '');
    tag.textContent = cat;
    tag.onclick = () => {
      currentCategory = currentCategory === cat ? null : cat;
      currentPage = 1;
      renderFilters();
      renderVideos();
    };
    filterBar.appendChild(tag);
  });
}

document.getElementById('prevPage').onclick = () => { if (currentPage > 1) { currentPage--; renderVideos(); } };
document.getElementById('nextPage').onclick = () => { currentPage++; renderVideos(); };
searchInput.oninput = (e) => { searchQuery = e.target.value; currentPage = 1; renderVideos(); };

fetch('videos.json')
  .then(res => res.json())
  .then(data => {
    videos = data.sort((a,b) => new Date(b.addedAt) - new Date(a.addedAt));
    renderFilters();
    renderVideos();
  });

// Hamburger
document.getElementById('hamburger').onclick = () => {
  document.getElementById('menu').classList.toggle('show');
};
