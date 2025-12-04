import { addFavorite } from "./favorites.js";

export async function loadAttractions() {
  const data = await fetch("./assets/data/attractions.json").then((r) =>
    r.json()
  );
  renderAttractions(data);
}

export function renderAttractions(list) {
  const container = document.querySelector("#attractions-container");
  container.innerHTML = list
    .map(
      (a) => `
    <div class="card fade-in">
      <img src="${a.img}" class="card-img">
      <h3>${a.name} – ${a.city}</h3>
      <p>${a.desc}</p>
      <div class="card-footer">
        <button class="btn-fav" data-id="${a.id}">❤️ Save</button>
      </div>
    </div>
  `
    )
    .join("");

  document.querySelectorAll(".btn-fav").forEach((btn) =>
    btn.addEventListener("click", () => {
      const item = list.find((f) => f.id === btn.dataset.id);
      addFavorite({
        id: item.id,
        name: item.name,
        img: item.img
      });
    })
  );
}
