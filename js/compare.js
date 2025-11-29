import { getWikiSummary } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("compareBtn");

  btn.addEventListener("click", async () => {
    const a = document.getElementById("compareA").value.trim();
    const b = document.getElementById("compareB").value.trim();

    if (!a || !b) {
      alert("Please enter two countries.");
      return;
    }

    const dataA = await getWikiSummary(a);
    const dataB = await getWikiSummary(b);

    if (!dataA || !dataB) {
      document.getElementById("compareContainer").innerHTML =
        "<p>One or both countries were not found.</p>";
      return;
    }

    document.getElementById("compareContainer").innerHTML = `
      <div class="compare-card">
        <h3>${dataA.title}</h3>
        <img src="${dataA.thumbnail?.source || ""}" alt="${dataA.title}">
        <p>${dataA.extract}</p>
      </div>

      <div class="compare-card">
        <h3>${dataB.title}</h3>
        <img src="${dataB.thumbnail?.source || ""}" alt="${dataB.title}">
        <p>${dataB.extract}</p>
      </div>
    `;
  });
});
