/**
 * Función para llenar los selectores de filtros con las opciones disponibles
 * Extrae plataformas y géneros únicos de la lista de juegos
 * @param {Array} games - Array de juegos para extraer opciones
 * @param {HTMLElement} filterPlatform - Elemento select para plataformas
 * @param {HTMLElement} filterGenre - Elemento select para géneros
 */
export function fillFilters(games, filterPlatform, filterGenre) {
  // Conjuntos para almacenar plataformas y géneros únicos
  const platforms = new Set();
  const genres = new Set();

  // Iterar sobre cada juego para extraer plataformas y géneros
  games.forEach((game) => {
    // Agregar cada plataforma al conjunto (Set evita duplicados)
    game.platforms.forEach((p) => platforms.add(p.platform.name));
    // Agregar cada género al conjunto
    game.genres.forEach((g) => genres.add(g.name));
  });

  // Llenar el selector de plataformas con las opciones extraídas
  filterPlatform.innerHTML = `<option value="">Todas las plataformas</option>`;
  [...platforms].forEach((p) => {
    filterPlatform.innerHTML += `<option value="${p}">${p}</option>`;
  });

  // Llenar el selector de géneros con las opciones extraídas
  filterGenre.innerHTML = `<option value="">Todos los géneros</option>`;
  [...genres].forEach((g) => {
    filterGenre.innerHTML += `<option value="${g}">${g}</option>`;
  });
}

/**
 * Función para aplicar filtros a la lista de juegos
 * Permite filtrar por búsqueda de texto, plataforma y género
 * @param {Array} allGames - Array completo de juegos
 * @param {string} search - Texto de búsqueda
 * @param {string} platform - Plataforma seleccionada
 * @param {string} genre - Género seleccionado
 * @returns {Array} Array filtrado de juegos
 */
export function applyFilters(allGames, search, platform, genre) {
  let filtered = allGames;

  // Filtrar por texto de búsqueda (nombre del juego)
  if (search) {
    filtered = filtered.filter((g) =>
      g.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filtrar por plataforma seleccionada
  if (platform) {
    filtered = filtered.filter((g) =>
      g.platforms.some((p) => p.platform.name === platform)
    );
  }

  // Filtrar por género seleccionado
  if (genre) {
    filtered = filtered.filter((g) => g.genres.some((g2) => g2.name === genre));
  }

  return filtered;
}
