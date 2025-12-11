// =======================================
// ATTRACTIONS MODULE
// Loads local attractions.json and renders cards
// =======================================

import { addFavorite } from "./favorites.js";

// Basic sanitization so HTML never breaks
function clean(str) {
  return String(str).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// =======================================
// Load Attractions Data
// =======================================
export async function loadAttractions() {
  try {
    const response = await fetch("./assets/data/attractions.json");
    if (!response.ok) throw new Error("Attractions file not found");

    const data = await response.json();
    renderAttractions(data);
  } catch (err) {
    console.error("Attractions error:", err);

    const container = document.querySelector("#attractions-container");
    if (container) {
      container.innerHTML = "<p>Unable to load attractions.</p>";
    }
  }
}

// =======================================
// Render Attractions
// =======================================
export function renderAttractions(list) {
  const container = document.querySelector("#attractions-container");
  if (!container) return; // Page safety

  container.innerHTML = list
    .map(a => {
      const title = clean(a.name);
      const city = clean(a.city);
      const desc = clean(a.desc);
      const image = a.img || "";

      return `
        <div class="card fade-in">
          <img 
            src="${image}" 
            class="card-img" 
            loading="lazy"
            alt="Attraction: ${title} in ${city}">

          <h3>${title} – ${city}</h3>
          <p>${desc}</p>

          <div class="card-footer">
            <button 
              class="btn-fav" 
              data-id="${a.id}"
              type="button">
              ❤️ Save
            </button>
          </div>
        </div>
      `;
    })
    .join("");

  // Add favorite button listeners
  container.querySelectorAll(".btn-fav").forEach(btn =>
    btn.addEventListener("click", () => {
      const item = list.find(f => f.id === btn.dataset.id);

      if (item) {
        addFavorite({
          id: item.id,
          name: clean(item.name),
          img: item.img
        });
      }
    })
  );
}
