export function saveFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.includes(id)) {
    favorites.push(id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Juego añadido a favoritos");
  } else {
    alert("Ya está en favoritos");
  }
}

export function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

export function removeFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter((f) => f !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}
