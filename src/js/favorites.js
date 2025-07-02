import { getGameById } from "./api.js";
import { renderModal, closeModal } from "./modal.js";
import { fillFilters, applyFilters } from "./filters.js";

const favoritesContainer = document.getElementById("favoritesContainer");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("modal");
const filterPlatform = document.getElementById("filterPlatform");
const filterGenre = document.getElementById("filterGenre");
const sortByName = document.getElementById("sortByName");
const sortByRating = document.getElementById("sortByRating");

let favoriteGames = [];

async function loadFavorites() {
  const favoriteIds = getFavorites();
  favoriteGames = [];

  if (favoriteIds.length === 0) {
    favoritesContainer.innerHTML =
      '<p>Aun no tienes juegos favoritos, prueba agregando uno con el boton de <img src="../../public/assets/corazon.png" alt="" style="width: 20px; height: 20px;"> en la página principal</p>';
    return;
  }

  for (let id of favoriteIds) {
    try {
      const game = await getGameById(id);
      favoriteGames.push(game);
    } catch (err) {
      console.error(`Error cargando juego favorito ${id}`);
    }
  }

  renderFavorites(favoriteGames);
  fillFilters(favoriteGames, filterPlatform, filterGenre);
}

function renderFavorites(games) {
  favoritesContainer.innerHTML = "";

  games.forEach((game) => {
    const card = document.createElement("div");
    card.classList.add("card");
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

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("details-btn")) {
    const id = e.target.dataset.id;
    const game = await getGameById(id);
    renderModal(game);
  }

  if (e.target.classList.contains("close")) {
    closeModal();
  }

  if (e.target.classList.contains("remove-fav-btn")) {
    const id = e.target.dataset.id;
    removeFavorite(id);
    loadFavorites(); // recargar
  }
});

searchInput.addEventListener("input", () => {
  const search = searchInput.value.toLowerCase();
  const filtered = favoriteGames.filter((g) =>
    g.name.toLowerCase().includes(search)
  );
  renderFavorites(filtered);
});

export function saveFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.includes(id)) {
    favorites.push(id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Juego añadido a favoritos");
  } else {
    alert("Ya está en favoritos");
  }
}

export function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

export function removeFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter((f) => f !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

filterPlatform.addEventListener("change", () => {
  const filtered = applyFilters(
    favoriteGames,
    searchInput.value,
    filterPlatform.value,
    filterGenre.value
  );
  renderFavorites(filtered);
});

filterGenre.addEventListener("change", () => {
  const filtered = applyFilters(
    favoriteGames,
    searchInput.value,
    filterPlatform.value,
    filterGenre.value
  );
  renderFavorites(filtered);
});

sortByName.addEventListener("click", () => {
  const sorted = [...favoriteGames].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  renderFavorites(sorted);
});

sortByRating.addEventListener("click", () => {
  const sorted = [...favoriteGames].sort((a, b) => b.rating - a.rating);
  renderFavorites(sorted);
});

loadFavorites();
