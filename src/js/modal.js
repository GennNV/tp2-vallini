import { getGameScreenshots } from "./api.js";

/**
 * Función para renderizar el modal con los detalles completos de un juego
 * Incluye descripción, requisitos del sistema y capturas de pantalla
 * @param {Object} game - Objeto con los datos del juego
 */
export async function renderModal(game) {
  let screenshotsHTML = "";

  // Intentar obtener las capturas de pantalla del juego
  try {
    const screenshotsData = await getGameScreenshots(game.id);
    // Crear HTML para las capturas de pantalla
    screenshotsHTML = screenshotsData.results
      .map((s) => `<img src="${s.image}" style="width:60%; margin:5px auto;">`)
      .join("");
  } catch (err) {
    // Si no se pueden obtener capturas, mostrar mensaje
    screenshotsHTML = "<p>No hay capturas disponibles.</p>";
  }

  // ===== PROCESAMIENTO DE REQUISITOS DEL SISTEMA =====
  let requisitosHTML = "";

  // Buscar la plataforma PC en las plataformas del juego
  const pcPlatform = game.platforms.find((p) => p.platform.name === "PC");

  // Si existe la plataforma PC y tiene requisitos
  if (pcPlatform && pcPlatform.requirements) {
    requisitosHTML = `
      <strong>Requisitos mínimos:</strong><br>
      ${
        pcPlatform.requirements.minimum
          ? pcPlatform.requirements.minimum.replace(/\n/g, "<br>")
          : "No especificados"
      }<br><br>
      <strong>Requisitos recomendados:</strong><br>
      ${
        pcPlatform.requirements.recommended
          ? pcPlatform.requirements.recommended.replace(/\n/g, "<br>")
          : "No especificados"
      }
    `;
  } else {
    // Si no hay requisitos disponibles
    requisitosHTML = "Requisitos no disponibles.";
  }

  // Renderizar el contenido completo del modal
  modalBody.innerHTML = `
    <h2 class="modal-title">${game.name}</h2>
    <p>${game.description_raw || "Sin descripción."}</p>
    <p><strong>Rating:</strong> ${game.rating}</p>
    <h3>Requisitos:</h3>
    <p>${requisitosHTML}</p>
    <h3>Capturas:</h3>
    ${screenshotsHTML}
  `;

  // Mostrar el modal removiendo la clase 'hidden'
  modal.classList.remove("hidden");
}

/**
 * Función para cerrar el modal
 * Agrega la clase 'hidden' para ocultar el modal
 */
export function closeModal() {
  modal.classList.add("hidden");
}
