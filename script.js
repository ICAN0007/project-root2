let currentPage = 1;
const videosPerPage = 10;
let videos = [];

async function fetchVideos() {
  try {
    const response = await fetch('videos.json');
    videos = await response.json();
    renderVideos();
    renderPagination();
  } catch (error) {
    console.error('Failed to load videos:', error);
  }
}

function renderVideos() {
  const videoGrid = document.getElementById('video-grid');
  videoGrid.innerHTML = '';

  const start = (currentPage - 1) * videosPerPage;
  const end = start + videosPerPage;
  const videosToDisplay = videos.slice(start, end);

  videosToDisplay.forEach(video => {
    const videoCard = document.createElement('div');
    videoCard.className = 'bg-gray-800 rounded overflow-hidden shadow-lg';

    videoCard.innerHTML = `
      <a href="${video.url}" target="_blank">
        <img src="${video.thumbnail}" alt="${video.title}" class="w-full object-cover" style="width:510px; height:290px;">
        <div class="p-2 text-center">${video.title}</div>
      </a>
    `;

    videoGrid.appendChild(videoCard);
  });

  const showMoreDiv = document.createElement('div');
  showMoreDiv.className = 'col-span-full mt-6 text-center';
  showMoreDiv.innerHTML = `
    <a href="index.html" class="text-blue-400 underline">Show more from homepage</a>
  `;
  videoGrid.appendChild(showMoreDiv);
}

function renderPagination() {
  const paginationDiv = document.querySelector('.pagination');
  if (!paginationDiv) {
    const newPaginationDiv = document.createElement('div');
    newPaginationDiv.className = 'pagination flex justify-center mt-6 space-x-2';
    document.querySelector('main').appendChild(newPaginationDiv);
  } else {
    paginationDiv.innerHTML = '';
  }

  const totalPages = Math.ceil(videos.length / videosPerPage);

  const pagination = document.querySelector('.pagination');

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Prev';
  prevBtn.className = 'px-3 py-1 bg-gray-700 rounded hover:bg-gray-600';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderVideos();
      renderPagination();
    }
  };
  pagination.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.className = `px-3 py-1 rounded ${i === currentPage ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`;
    pageBtn.onclick = () => {
      currentPage = i;
      renderVideos();
      renderPagination();
    };
    pagination.appendChild(pageBtn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.className = 'px-3 py-1 bg-gray-700 rounded hover:bg-gray-600';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderVideos();
      renderPagination();
    }
  };
  pagination.appendChild(nextBtn);
}

document.getElementById('search').addEventListener('input', (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = videos.filter(v => v.title.toLowerCase().includes(keyword));
  currentPage = 1;
  videos = filtered;
  renderVideos();
  renderPagination();
});

window.onload = fetchVideos;


