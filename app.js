// Your working API Key with HTTPS enabled for Vercel security
const API_KEY = '45e20a02'; 
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

const movieGrid = document.getElementById('movie-grid');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const sectionTitle = document.getElementById('section-title');
const loader = document.getElementById('loader');

// Fetch movies based on a search term
async function fetchMovies(searchTerm = 'Marvel') {
    showLoader(true);
    movieGrid.innerHTML = '';
    
    try {
        // Enforce HTTPS and use 's=' for searching arrays of movies
        const response = await fetch(`${BASE_URL}&s=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();

        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            movieGrid.innerHTML = `<p class="text-gray-400 text-center col-span-full">${data.Error}</p>`;
        }
    } catch (error) {
        console.error("Error fetching data: ", error);
        movieGrid.innerHTML = `<p class="text-red-500 text-center col-span-full">Something went wrong. Please try again later.</p>`;
    } finally {
        showLoader(false);
    }
}

// Display movie cards dynamically
function displayMovies(movies) {
    movieGrid.innerHTML = movies.map(movie => {
        const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image";
        
        return `
            <div class="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform duration-200 flex flex-col justify-between group">
                <div class="relative overflow-hidden">
                    <img src="${poster}" alt="${movie.Title}" class="w-full h-72 object-cover object-top">
                    <div class="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
                        <span class="border border-white text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-white hover:text-black transition">
                            View Details
                        </span>
                    </div>
                </div>
                <div class="p-4 flex-grow flex flex-col justify-between">
                    <h3 class="font-bold text-sm line-clamp-2 text-gray-100 group-hover:text-red-400 transition-colors">${movie.Title}</h3>
                    <div class="flex justify-between items-center mt-2 text-xs text-gray-400">
                        <span>${movie.Year}</span>
                        <span class="uppercase border border-gray-600 px-1.5 py-0.5 rounded">${movie.Type}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function showLoader(isLoading) {
    if (isLoading) {
        loader.classList.remove('hidden');
    } else {
        loader.classList.add('hidden');
    }
}

// Event Listeners
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        sectionTitle.textContent = `Search results for: "${query}"`;
        fetchMovies(query);
    }
});

// Initial load movies
fetchMovies('Batman');