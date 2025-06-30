import { getGames, getGameById } from "./api.js";
import { renderModal, closeModal } from "./modal.js";

const gamesContainer = document.getElementById("gamesContainer");
const modal = document.getElementById("modal");

let allGames = [];

async function init() {
  try {
    allGames = await getGames();
    renderGames(allGames);
    // fillFilters(allGames, filterPlatform, filterGenre);
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
        <button class="fav-btn" data-id="${game.id}">🖤</button>
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

init();
