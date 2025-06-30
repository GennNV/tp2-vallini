import { getGames, getGameById } from "./api.js";
import { renderModal, closeModal } from "./modal.js";
import { fillFilters, applyFilters } from "./filters.js";
import { saveFavorite } from "./favorites.js";

const gamesContainer = document.getElementById("gamesContainer");
const searchInput = document.getElementById("searchInput");
const filterPlatform = document.getElementById("filterPlatform");
const filterGenre = document.getElementById("filterGenre");
const sortByName = document.getElementById("sortByName");
const sortByRating = document.getElementById("sortByRating");
let allGames = [];

async function init() {
  try {
    allGames = await getGames();
    renderGames(allGames);
    fillFilters(allGames, filterPlatform, filterGenre);
  } catch (error) {
    gamesContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

function renderGames(games) {
  gamesContainer.innerHTML = "";
  games.forEach((game) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${game.background_image}" alt="${game.name}">
      <div class="card-content">
        <h3>${game.name}</h3>
        <p>Plataformas: ${game.platforms
          .map((p) => p.platform.name)
          .join(", ")}</p>
        <p>Puntuación: ${game.rating}</p>
        <button class="details-btn" data-id="${game.id}">Más detalles</button>
        <button class="fav-btn" data-id="${game.id}">❤</button>
      </div>
    `;
    gamesContainer.appendChild(card);
  });
}

// Eventos

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("details-btn")) {
    const id = e.target.dataset.id;
    const game = await getGameById(id);
    renderModal(game);
  }

  if (e.target.classList.contains("close")) {
    closeModal();
  }

  if (e.target.classList.contains("fav-btn")) {
    saveFavorite(e.target.dataset.id);
  }
});

searchInput.addEventListener("input", () => {
  const filtered = applyFilters(
    allGames,
    searchInput.value,
    filterPlatform.value,
    filterGenre.value
  );
  renderGames(filtered);
});

filterPlatform.addEventListener("change", () => {
  const filtered = applyFilters(
    allGames,
    searchInput.value,
    filterPlatform.value,
    filterGenre.value
  );
  renderGames(filtered);
});

filterGenre.addEventListener("change", () => {
  const filtered = applyFilters(
    allGames,
    searchInput.value,
    filterPlatform.value,
    filterGenre.value
  );
  renderGames(filtered);
});

sortByName.addEventListener("click", () => {
  const sorted = [...allGames].sort((a, b) => a.name.localeCompare(b.name));
  renderGames(sorted);
});

sortByRating.addEventListener("click", () => {
  const sorted = [...allGames].sort((a, b) => b.rating - a.rating);
  renderGames(sorted);
});

init();
