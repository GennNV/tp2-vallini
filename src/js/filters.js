export function fillFilters(games, filterPlatform, filterGenre) {
  const platforms = new Set();
  const genres = new Set();

  games.forEach((game) => {
    game.platforms.forEach((p) => platforms.add(p.platform.name));
    game.genres.forEach((g) => genres.add(g.name));
  });

  filterPlatform.innerHTML = `<option value="">Todas las plataformas</option>`;
  [...platforms].forEach((p) => {
    filterPlatform.innerHTML += `<option value="${p}">${p}</option>`;
  });

  filterGenre.innerHTML = `<option value="">Todos los géneros</option>`;
  [...genres].forEach((g) => {
    filterGenre.innerHTML += `<option value="${g}">${g}</option>`;
  });
}
export function applyFilters(allGames, search, platform, genre) {
  let filtered = allGames;

  if (search) {
    filtered = filtered.filter((g) =>
      g.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (platform) {
    filtered = filtered.filter((g) =>
      g.platforms.some((p) => p.platform.name === platform)
    );
  }

  if (genre) {
    filtered = filtered.filter((g) => g.genres.some((g2) => g2.name === genre));
  }

  return filtered;
}
