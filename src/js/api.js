// Configuración de la API RAWG
const apiKey = "735db206dc42440d88ce0bfc4f4e429b";
const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}`;

/**
 * Función para obtener la lista de juegos desde la API RAWG
 * @returns {Promise<Array>} Promise que resuelve con un array de juegos
 * @throws {Error} Si hay un error en la respuesta de la API
 */
export async function getGames() {
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error("Error en la API");
  const data = await response.json();
  return data.results;
}

/**
 * Función para obtener los detalles completos de un juego específico por ID
 * @param {string|number} id - ID del juego a obtener
 * @returns {Promise<Object>} Promise que resuelve con los datos completos del juego
 * @throws {Error} Si hay un error al cargar los detalles
 */
export async function getGameById(id) {
  const response = await fetch(
    `https://api.rawg.io/api/games/${id}?key=${apiKey}`
  );
  if (!response.ok) throw new Error("Error al cargar detalles");
  return await response.json();
}

/**
 * Función para obtener las capturas de pantalla de un juego específico
 * @param {string|number} id - ID del juego
 * @returns {Promise<Object>} Promise que resuelve con las capturas de pantalla
 * @throws {Error} Si hay un error al obtener las capturas
 */
export async function getGameScreenshots(id) {
  const response = await fetch(
    `https://api.rawg.io/api/games/${id}/screenshots?key=${apiKey}`
  );
  if (!response.ok) throw new Error("Error al traer capturas");
  return await response.json();
}

/**
 * Función para obtener los trailers/videos de un juego específico
 * @param {string|number} id - ID del juego
 * @returns {Promise<Object>} Promise que resuelve con los trailers del juego
 * @throws {Error} Si hay un error al cargar los trailers
 */
export async function getGameTrailers(id) {
  const response = await fetch(
    `https://api.rawg.io/api/games/${id}/movies?key=${apiKey}`
  );
  if (!response.ok) throw new Error("No se pudieron cargar los trailers");
  return await response.json();
}
