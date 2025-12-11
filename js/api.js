// =======================================
// NEWS + WIKI API MODULE
// =======================================

// Import only once — FIXED
import { addFavorite } from "./favorites.js";

// Basic sanitization so HTML never breaks
function clean(str) {
  return String(str).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ---------------------------------------
// Get Wikipedia summary for Compare + Details
// ---------------------------------------
export async function getWikiSummary(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    return await response.json();
  } catch (err) {
    console.error("Wiki Summary Error:", err);
    return null;
  }
}

// ---------------------------------------
// WIKIPEDIA FEATURED NEWS
// ---------------------------------------
export async function getWikiNews() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");

  const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${y}/${m}/${d}`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "BYUI-WorldExplorer/1.0" }
    });

    if (!response.ok) throw new Error("Wikipedia News Error");

    const data = await response.json();
    const items = data.news || [];

    return items.map((n, i) => ({
      id: `news-${i}`,
      title: clean(`Wikipedia News #${i + 1}`),
      summary: clean(strip(n.story || "").slice(0, 200) + "..."),
      img: "https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg",
      link: "https://en.wikipedia.org/wiki/Portal:Current_events"
    }));
  } catch (err) {
    console.error("News API Error:", err);
    return [];
  }
}

/// ---------------------------------------
// RENDER NEWS CARDS (SAFE VERSION)
// ---------------------------------------
export function renderNews(list) {
  const container = document.querySelector("#news-container");
  if (!container) return;   // 🔥 Prevents crash on pages without news section

  if (!list.length) {
    container.innerHTML = "<p>Unable to load news.</p>";
    return;
  }

  container.innerHTML = list
    .map(n => `
      <div class="card fade-in">
        <img 
          src="${n.img}" 
          class="card-img" 
          loading="lazy"
          alt="Wikipedia news thumbnail">

        <h3>${n.title}</h3>
        <p>${n.summary}</p>

        <div class="card-footer">
          <a href="${n.link}" target="_blank" rel="noopener">Read More</a>
          <button 
            class="btn-fav" 
            data-id="${n.id}" 
            type="button">
            ❤️ Save
          </button>
        </div>
      </div>
    `)
    .join("");

  // Favorite buttons
  container.querySelectorAll(".btn-fav").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = list.find(n => n.id === btn.dataset.id);
      if (!item) return;

      addFavorite({
        id: item.id,
        name: item.title,
        img: item.img
      });
    });
  });
}


// ---------------------------------------
// Strip HTML Tags
// ---------------------------------------
function strip(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
}
