// =======================================
// FAVORITES MODULE
// =======================================

// Safely get favorites from localStorage
export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  } catch {
    return [];
  }
}

// Save updated list
export function saveFavorites(list) {
  localStorage.setItem("favorites", JSON.stringify(list));
}

// Add an item (no duplicates)
export function addFavorite(item) {
  const favs = getFavorites();

  if (favs.some(f => f.id === item.id)) return; // Already exists

  favs.push(item);
  saveFavorites(favs);
}

// Remove an item & re-render page
export function removeFavorite(id) {
  const updated = getFavorites().filter(f => f.id !== id);
  saveFavorites(updated);
  renderFavorites();
}

// =======================================
// DOM RENDERING
// =======================================

export function renderFavorites() {
  const container = document.querySelector("#favorites-list");
  if (!container) return; // Not on this page

  const favs = getFavorites();

  if (!favs.length) {
    container.innerHTML = "<p>No favorites yet.</p>";
    return;
  }

  container.innerHTML = favs
    .map(fav => {
      const title = sanitize(fav.title || fav.name || "Unknown");
      const img = fav.thumbnail || fav.img || "";

      return `
        <div class="card fade-in">
          <img 
            src="${img}" 
            alt="Favorite item: ${title}" 
            loading="lazy"
            class="card-img">

          <h3>${title}</h3>

          <button 
            class="remove-fav" 
            data-id="${fav.id}"
            type="button">
            Remove
          </button>
        </div>
      `;
    })
    .join("");

  // Attach remove listeners
  container.querySelectorAll(".remove-fav").forEach(btn => {
    btn.addEventListener("click", () => removeFavorite(btn.dataset.id));
  });
}

// =======================================
// Sanitize text to prevent HTML injection
// =======================================
function sanitize(text) {
  return String(text)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// =======================================
// AUTO INITIALIZE ON FAVORITES PAGE
// =======================================

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#favorites-list")) {
    renderFavorites();
  }
});
