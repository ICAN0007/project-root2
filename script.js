let videos = [];
let currentPage = 1;
const itemsPerPage = 10;
let currentCategory = null;
let searchQuery = '';

const grid = document.getElementById('video-grid');
const filterBar = document.getElementById('filter-bar');
const searchInput = document.getElementById('search');

// Track if footer links already added
let footerLinksAdded = false;

// Render Videos
function renderVideos() {
  grid.innerHTML = '';
  let filtered = videos;

  // Filter by category
  if (currentCategory) {
    filtered = filtered.filter(v => v.categories.includes(currentCategory));
  }

  // Filter by search
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(v =>
      v.title.toLowerCase().includes(query) ||
      v.categories.some(cat => cat.toLowerCase().includes(query)) ||
      v.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Pagination
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  // Create video cards
  paginated.forEach(v => {
    const card = document.createElement('div');
    card.className = "bg-gray-800 rounded shadow overflow-hidden hover:shadow-lg transition";
    card.innerHTML = `
      <a href="video.html?id=${v.id}">
        <img src="${v.thumb}" alt="${v.title}" style="width: 510px; height: 290px; object-fit: cover;">
        <div class="p-2">
          <h3 class="font-bold text-sm truncate">${v.title}</h3>
          <p class="text-xs">${v.categories.join(", ")}</p>
        </div>
      </a>
    `;
    grid.appendChild(card);
  });

  // Pagination buttons
  document.getElementById('prevPage').disabled = currentPage === 1;
  document.getElementById('nextPage').disabled = (start + itemsPerPage) >= filtered.length;

  // Add footer links once
  if (!footerLinksAdded) {
    const links = document.createElement('div');
    links.className = 'text-center text-sm text-gray-400 mt-6 mb-4';
    links.innerHTML = `
      <a href="privacy.html" class="hover:underline">Privacy Policy</a> • 
      <a href="terms.html" class="hover:underline">Terms & Conditions</a>
    `;
    grid.parentNode.appendChild(links);
    footerLinksAdded = true;
  }
}

// Render Filters
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

// Pagination buttons
document.getElementById('prevPage').onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    renderVideos();
  }
};
document.getElementById('nextPage').onclick = () => {
  currentPage++;
  renderVideos();
};

// Search
searchInput.oninput = (e) => {
  searchQuery = e.target.value.trim();
  currentPage = 1;
  renderVideos();
};

// Fetch videos
fetch('videos.json')
  .then(res => res.json())
  .then(data => {
    videos = data.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    renderFilters();
    renderVideos();
  });

// Hamburger Menu
document.getElementById('hamburger').onclick = () => {
  document.getElementById('menu').classList.toggle('hidden');
};

