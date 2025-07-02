import { getGameScreenshots } from "./api.js";

export async function renderModal(game) {
  let screenshotsHTML = "";

  try {
    const screenshotsData = await getGameScreenshots(game.id);
    screenshotsHTML = screenshotsData.results
      .map((s) => `<img src="${s.image}" style="width:60%; margin:5px auto;">`)
      .join("");
  } catch (err) {
    screenshotsHTML = "<p>No hay capturas disponibles.</p>";
  }

  // requisitos
  let requisitosHTML = "";
  const pcPlatform = game.platforms.find((p) => p.platform.name === "PC");
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
    requisitosHTML = "Requisitos no disponibles.";
  }

  modalBody.innerHTML = `
    <h2 class="modal-title">${game.name}</h2>
    <p>${game.description_raw || "Sin descripción."}</p>
    <p><strong>Rating:</strong> ${game.rating}</p>
    <h3>Requisitos:</h3>
    <p>${requisitosHTML}</p>
    <h3>Capturas:</h3>
    ${screenshotsHTML}
  `;

  modal.classList.remove("hidden");
}

export function closeModal() {
  modal.classList.add("hidden");
}
