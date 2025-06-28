const apiKey = "735db206dc42440d88ce0bfc4f4e429b";
const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}`;

export async function getGames() {
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error("Error en la API");
  const data = await response.json();
  return data.results;
}

export async function getGameById(id) {
  const response = await fetch(
    `https://api.rawg.io/api/games/${id}?key=${apiKey}`
  );
  if (!response.ok) throw new Error("Error al cargar detalles");
  return await response.json();
}
