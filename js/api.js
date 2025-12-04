import { addFavorite } from "./favorites.js";

// 🔍 NEW FUNCTION — Needed for COUNTRY + COMPARE
export async function getWikiSummary(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    title
  )}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Wiki Summary Error:", err);
    return null;
  }
}

// 📰 WIKIPEDIA NEWS FEED
export async function getWikiNews() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");

  const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${y}/${m}/${d}`;

  const response = await fetch(url, {
    headers: { "User-Agent": "BYUI-WorldExplorer/1.0" }
  });

  if (!response.ok) throw new Error("Wiki error");

  const data = await response.json();
  const items = data.news || [];

  return items.map((n, i) => ({
    id: `news-${i}`,
    title: `Wikipedia News #${i + 1}`,
    summary: strip(n.story).slice(0, 200) + "...",
    img: "https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg",
    link: "https://en.wikipedia.org/wiki/Portal:Current_events"
  }));
}

export function renderNews(list) {
  const container = document.querySelector("#news-container");
  container.innerHTML = list
    .map(
      (n) => `
    <div class="card fade-in">
      <img src="${n.img}" class="card-img" />
      <h3>${n.title}</h3>
      <p>${n.summary}</p>
      <div class="card-footer">
        <a href="${n.link}" target="_blank">Read More</a>
        <button class="btn-fav" data-id="${n.id}">❤️ Save</button>
      </div>
    </div>
    `
    )
    .join("");

  document.querySelectorAll(".btn-fav").forEach((btn) =>
    btn.addEventListener("click", () => {
      const item = list.find((n) => n.id === btn.dataset.id);
      addFavorite({
        id: item.id,
        name: item.title,
        img: item.img
      });
    })
  );
}

function strip(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
}
