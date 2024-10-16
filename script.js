const apiKey = 'a49cea5b42013279473e1768a567447c'; // Reemplaza con tu clave API de themoviedb
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('details');
const detailsContainer = document.getElementById('movie-details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');
let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

// Función para obtener y mostrar las películas populares
async function fetchPopularMovies() {
    try {
        const response = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}&language=es-ES&page=1`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error al obtener las películas populares:', error);
    }
}

// Función para mostrar las películas en el HTML
function displayMovies(movies) {
    movieList.innerHTML = ''; // Limpiar la lista de películas
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
        `;
        li.onclick = () => showMovieDetails(movie.id); // Muestra detalles cuando haces clic en una película
        movieList.appendChild(li);
    });
}

// Función para mostrar detalles de la película seleccionada
async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`${apiUrl}/movie/${movieId}?api_key=${apiKey}&language=es-ES`);
        const movie = await response.json();

        // Guardar el ID de la película seleccionada
        selectedMovieId = movieId;

        // Mostrar detalles de la película
        movieDetails.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.overview}</p>
            <p>Fecha de lanzamiento: ${movie.release_date}</p>
            <p>Valoración: ${movie.vote_average}/10</p>
        `;

        detailsContainer.classList.remove('hidden'); // Mostrar la sección de detalles
    } catch (error) {
        console.error('Error al obtener los detalles de la película:', error);
    }
}

// Función para buscar películas según el término ingresado
searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (query) {
        try {
            const response = await fetch(`${apiUrl}/search/movie?api_key=${apiKey}&query=${query}&language=es-ES`);
            const data = await response.json();
            displayMovies(data.results); // Muestra los resultados de la búsqueda
        } catch (error) {
            console.error('Error al buscar las películas:', error);
        }
    }
});

// Función para agregar la película seleccionada a la lista de favoritos
addToFavoritesButton.addEventListener('click', () => {
    if (selectedMovieId) {
        const favoriteMovie = {
            id: selectedMovieId,
            title: document.querySelector('#details h3').textContent
        };

        if (!favoriteMovies.some(movie => movie.id === selectedMovieId)) {
            favoriteMovies.push(favoriteMovie);
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); // Guardar en localStorage
            displayFavorites(); // Actualizar la lista de favoritos
        }
    }
});

// Función para mostrar las películas guardadas como favoritas
function displayFavorites() {
    favoritesList.innerHTML = ''; // Limpiar la lista de favoritos
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        favoritesList.appendChild(li);
    });
}

// Obtener películas populares al cargar la página
fetchPopularMovies();
displayFavorites(); // Mostrar películas favoritas guardadas
