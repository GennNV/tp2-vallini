// Importaciones de módulos externos
import { getGameById } from "./api.js";
import { renderModal, closeModal } from "./modal.js";
import { fillFilters, applyFilters } from "./filters.js";

// Referencias a elementos del DOM
const favoritesContainer = document.getElementById("favoritesContainer");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("modal");
const filterPlatform = document.getElementById("filterPlatform");
const filterGenre = document.getElementById("filterGenre");
const sortByName = document.getElementById("sortByName");
const sortByRating = document.getElementById("sortByRating");

// Variable global para almacenar los juegos favoritos cargados
let favoriteGames = [];

/**
 * Función para cargar los juegos favoritos desde localStorage
 * y obtener sus datos completos desde la API
 */
async function loadFavorites() {
  // Obtener los IDs de juegos favoritos desde localStorage
  const favoriteIds = getFavorites();
  favoriteGames = [];

  // Si no hay favoritos, mostrar mensaje informativo
  if (favoriteIds.length === 0) {
    favoritesContainer.innerHTML =
      "<p>Aun no tienes juegos favoritos, prueba agregando uno con el boton de favorito en la página principal</p>";
    return;
  }

  // Cargar los datos completos de cada juego favorito desde la API
  for (let id of favoriteIds) {
    try {
      const game = await getGameById(id);
      favoriteGames.push(game);
    } catch (err) {
      console.error(`Error cargando juego favorito ${id}`);
    }
  }

  // Renderizar los favoritos y configurar los filtros
  renderFavorites(favoriteGames);
  fillFilters(favoriteGames, filterPlatform, filterGenre);
}

/**
 * Función para renderizar las tarjetas de juegos favoritos
 * @param {Array} games - Array de juegos favoritos a renderizar
 */
function renderFavorites(games) {
  // Limpiar el contenedor antes de renderizar
  favoritesContainer.innerHTML = "";

  // Iterar sobre cada juego favorito y crear su tarjeta
  games.forEach((game) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // Crear el HTML de la tarjeta con información del juego favorito
    card.innerHTML = `
      <img src="${game.background_image}" alt="${game.name}">
      <div class="card-content">
        <h3>${game.name}</h3>
        <p>${game.description_raw.slice(0, 100)}...</p>
        <button class="details-btn" data-id="${game.id}">Ver detalles</button>
        <button class="remove-fav-btn" data-id="${
          game.id
        }">Quitar de favoritos</button>
      </div>
    `;
    favoritesContainer.appendChild(card);
  });
}

// ===== EVENTOS GLOBALES =====

// Event listener para manejar clicks en toda la página
document.addEventListener("click", async (e) => {
  // Si se hace click en el botón de detalles
  if (e.target.classList.contains("details-btn")) {
    const id = e.target.dataset.id;
    const game = await getGameById(id);
    renderModal(game);
  }

  // Si se hace click en el botón de cerrar modal
  if (e.target.classList.contains("close")) {
    closeModal();
  }

  // Si se hace click en el botón de quitar de favoritos
  if (e.target.classList.contains("remove-fav-btn")) {
    const id = e.target.dataset.id;
    removeFavorite(id);
    loadFavorites(); // Recargar la lista de favoritos
  }
});

// ===== EVENTOS DE BÚSQUEDA =====

// Evento de búsqueda en tiempo real en favoritos
searchInput.addEventListener("input", () => {
  const search = searchInput.value.toLowerCase();
  // Filtrar favoritos por nombre que contenga el texto de búsqueda
  const filtered = favoriteGames.filter((g) =>
    g.name.toLowerCase().includes(search)
  );
  renderFavorites(filtered);
});

// ===== FUNCIONES DE GESTIÓN DE FAVORITOS =====

/**
 * Función para guardar un juego en favoritos
 * @param {string} id - ID del juego a guardar
 */
export function saveFavorite(id) {
  // Obtener favoritos existentes desde localStorage
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Verificar si el juego ya está en favoritos
  if (!favorites.includes(id)) {
    favorites.push(id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Juego añadido a favoritos");
  } else {
    alert("Ya está en favoritos");
  }
}

/**
 * Función para obtener la lista de IDs de juegos favoritos
 * @returns {Array} Array de IDs de juegos favoritos
 */
export function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

/**
 * Función para remover un juego de favoritos
 * @param {string} id - ID del juego a remover
 */
export function removeFavorite(id) {
  // Obtener favoritos existentes
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  // Filtrar el ID a remover
  favorites = favorites.filter((f) => f !== id);
  // Guardar la lista actualizada
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// ===== EVENTOS DE FILTROS =====

// Evento de cambio en filtro de plataforma
filterPlatform.addEventListener("change", () => {
  const filtered = applyFilters(
    favoriteGames,
    searchInput.value,
    filterPlatform.value,
    filterGenre.value
  );
  renderFavorites(filtered);
});

// Evento de cambio en filtro de género
filterGenre.addEventListener("change", () => {
  const filtered = applyFilters(
    favoriteGames,
    searchInput.value,
    filterPlatform.value,
    filterGenre.value
  );
  renderFavorites(filtered);
});

// ===== EVENTOS DE ORDENAMIENTO =====

// Ordenar favoritos por nombre alfabéticamente
sortByName.addEventListener("click", () => {
  const sorted = [...favoriteGames].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  renderFavorites(sorted);
});

// Ordenar favoritos por rating de mayor a menor
sortByRating.addEventListener("click", () => {
  const sorted = [...favoriteGames].sort((a, b) => b.rating - a.rating);
  renderFavorites(sorted);
});

// Cargar favoritos al inicializar la página
loadFavorites();
