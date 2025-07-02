import { getGames, getGameById, getGameTrailers } from "./api.js";
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
        <p>${game.platforms.map((p) => p.platform.name).join(", ")}</p>
        <p>Rating: ${game.rating}</p>
        <button class="details-btn" data-id="${game.id}">Más detalles</button>
        <button class="fav-btn" data-id="${
          game.id
        }"><img src="../../public/assets/corazon.png" alt="" style="width: 20px; height: 20px;"></button>
      </div>
    `;

    let trailerCached = null; // para guardar la URL una sola vez

    card.addEventListener("mouseenter", async () => {
      try {
        if (!trailerCached) {
          const data = await getGameTrailers(game.id);
          if (data.results.length > 0) {
            trailerCached = data.results[0].data.max;
          }
        }

        if (trailerCached) {
          const img = card.querySelector("img");
          img.style.display = "none";

          // agregar video
          let video = document.createElement("video");
          video.src = trailerCached;
          video.autoplay = true;
          video.loop = true;
          video.muted = true;
          video.classList.add("trailer-video");
          video.style.width = "100%";
          video.style.height = "400px";

          card.prepend(video);
        }
      } catch (err) {
        console.error("Error obteniendo trailer:", err.message);
      }
    });

    card.addEventListener("mouseleave", () => {
      const video = card.querySelector("video");
      if (video) video.remove();
      const img = card.querySelector("img");
      img.style.display = "block";
    });

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

  const favButton = e.target.closest(".fav-btn");
  if (favButton) {
    saveFavorite(favButton.dataset.id);
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
