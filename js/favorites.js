// =======================================
// FAVORITES MODULE (exported functions)
// =======================================

export function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}

export function saveFavorites(list) {
  localStorage.setItem("favorites", JSON.stringify(list));
}

export function addFavorite(item) {
  const favs = getFavorites();

  // prevent duplicates
  if (favs.some(f => f.id === item.id)) return;

  favs.push(item);
  saveFavorites(favs);
}

export function removeFavorite(id) {
  const newList = getFavorites().filter(f => f.id !== id);
  saveFavorites(newList);
  renderFavorites();
}

export function renderFavorites() {
  const container = document.querySelector("#favorites-list");
  if (!container) return; // not on this page

  const favs = getFavorites();

  if (!favs.length) {
    container.innerHTML = "<p>No favorites yet.</p>";
    return;
  }

  container.innerHTML = favs
    .map(
      fav => `
      <div class="card fade-in">
        <img src="${fav.thumbnail || fav.img || ""}" class="card-img">
        <h3>${fav.title || fav.name}</h3>
        <button class="remove-fav" data-id="${fav.id}">Remove</button>
      </div>
    `
    )
    .join("");

  // remove buttons
  document.querySelectorAll(".remove-fav").forEach(btn => {
    btn.addEventListener("click", () => removeFavorite(btn.dataset.id));
  });
}

// =======================================
// PAGE INITIALIZATION (runs only if page has #favorites-list)
// =======================================

document.addEventListener("DOMContentLoaded", () => {
  const favoritesList = document.querySelector("#favorites-list");

  if (favoritesList) {
    renderFavorites();
  }
});
