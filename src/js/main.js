// Importaciones de módulos externos
import { getGames, getGameById, getGameTrailers } from "./api.js";
import { renderModal, closeModal } from "./modal.js";
import { fillFilters, applyFilters } from "./filters.js";
import { saveFavorite } from "./favorites.js";
import heart from "../../public/assets/corazon.png";

// Referencias a elementos del DOM
const gamesContainer = document.getElementById("gamesContainer");
const searchInput = document.getElementById("searchInput");
const filterPlatform = document.getElementById("filterPlatform");
const filterGenre = document.getElementById("filterGenre");
const sortByName = document.getElementById("sortByName");
const sortByRating = document.getElementById("sortByRating");

// Variable global para almacenar todos los juegos
let allGames = [];

/**
 * Función de inicialización que carga los juegos y configura los filtros
 */
async function init() {
  try {
    // Obtener todos los juegos de la API
    allGames = await getGames();
    // Renderizar los juegos en el contenedor
    renderGames(allGames);
    // Llenar los filtros con las opciones disponibles
    fillFilters(allGames, filterPlatform, filterGenre);
  } catch (error) {
    // Mostrar mensaje de error si falla la carga
    gamesContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

/**
 * Función para renderizar las tarjetas de juegos en el contenedor
 * @param {Array} games - Array de juegos a renderizar
 */
function renderGames(games) {
  // Limpiar el contenedor antes de renderizar
  gamesContainer.innerHTML = "";

  // Iterar sobre cada juego y crear su tarjeta
  games.forEach((game) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // Crear el HTML de la tarjeta con la información del juego
    card.innerHTML = `
      <img src="${game.background_image}" alt="${game.name}">
      <div class="card-content">
        <h3>${game.name}</h3>
        <p>${game.platforms.map((p) => p.platform.name).join(", ")}</p>
        <p>Rating: ${game.rating}</p>
        <button class="details-btn" data-id="${game.id}">Más detalles</button>
        <button class="fav-btn" data-id="${
          game.id
        }"><img src="${heart}" alt="" style="width: 20px; height: 20px;"></button>
      </div>
    `;

    // Variable para cachear la URL del trailer y evitar múltiples llamadas a la API
    let trailerCached = null;

    // Evento cuando el mouse entra en la tarjeta - mostrar trailer
    card.addEventListener("mouseenter", async () => {
      try {
        // Solo obtener el trailer si no está cacheado
        if (!trailerCached) {
          const data = await getGameTrailers(game.id);
          if (data.results.length > 0) {
            trailerCached = data.results[0].data.max;
          }
        }

        // Si hay trailer disponible, reemplazar la imagen con el video
        if (trailerCached) {
          const img = card.querySelector("img");
          img.style.display = "none";

          // Crear elemento de video para el trailer
          let video = document.createElement("video");
          video.src = trailerCached;
          video.autoplay = true;
          video.loop = true;
          video.muted = true;
          video.classList.add("trailer-video");
          video.style.width = "100%";
          video.style.height = "400px";

          // Insertar el video al inicio de la tarjeta
          card.prepend(video);
        }
      } catch (err) {
        console.error("Error obteniendo trailer:", err.message);
      }
    });

    // Evento cuando el mouse sale de la tarjeta - restaurar imagen
    card.addEventListener("mouseleave", () => {
      const video = card.querySelector("video");
      if (video) video.remove();
      const img = card.querySelector("img");
      img.style.display = "block";
    });

    // Agregar la tarjeta al contenedor
    gamesContainer.appendChild(card);
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

  // Si se hace click en el botón de favoritos
  const favButton = e.target.closest(".fav-btn");
  if (favButton) {
    saveFavorite(favButton.dataset.id);
  }
});

// ===== EVENTOS DE FILTROS Y BÚSQUEDA =====

// Evento de búsqueda en tiempo real
searchInput.addEventListener("input", () => {
  const filtered = applyFilters(
    allGames,
    searchInput.value,
    filterPlatform.value,
    filterGenre.value
  );
  renderGames(filtered);
});

// Evento de cambio en filtro de plataforma
filterPlatform.addEventListener("change", () => {
  const filtered = applyFilters(
    allGames,
    searchInput.value,
    filterPlatform.value,
    filterGenre.value
  );
  renderGames(filtered);
});

// Evento de cambio en filtro de género
filterGenre.addEventListener("change", () => {
  const filtered = applyFilters(
    allGames,
    searchInput.value,
    filterPlatform.value,
    filterGenre.value
  );
  renderGames(filtered);
});

// ===== EVENTOS DE ORDENAMIENTO =====

// Ordenar por nombre alfabéticamente
sortByName.addEventListener("click", () => {
  const sorted = [...allGames].sort((a, b) => a.name.localeCompare(b.name));
  renderGames(sorted);
});

// Ordenar por rating de mayor a menor
sortByRating.addEventListener("click", () => {
  const sorted = [...allGames].sort((a, b) => b.rating - a.rating);
  renderGames(sorted);
});

// Inicializar la aplicación
init();
