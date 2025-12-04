// ================================
// 1. WIKIPEDIA COMPARE TOOL
// ================================
import { getWikiSummary } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const wikiBtn = document.getElementById("compareBtn");

  if (wikiBtn) {
    wikiBtn.addEventListener("click", async () => {
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
  }
});

// ================================
// 2. REST COUNTRIES COMPARE TOOL
// ================================
export async function initCompareTool() {
  const selectA = document.querySelector("#countryA");
  const selectB = document.querySelector("#countryB");
  const btn = document.querySelector("#compare-btn");

  // Only run if the dropdowns exist on this page
  if (!selectA || !selectB || !btn) return;

  // Load countries
  const countries = await fetch("https://restcountries.com/v3.1/all")
    .then(r => r.json());

  const sorted = countries.sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );

  // Populate dropdowns
  sorted.forEach(c => {
    const option = `<option value="${c.cca2}">${c.name.common}</option>`;
    selectA.innerHTML += option;
    selectB.innerHTML += option;
  });

  // Compare button
  btn.addEventListener("click", () => compareCountries(sorted));
}

function compareCountries(list) {
  const a = document.querySelector("#countryA").value;
  const b = document.querySelector("#countryB").value;
  const output = document.querySelector("#compare-results");

  if (!a || !b || a === b) {
    output.innerHTML = "<p>Please choose two DIFFERENT countries.</p>";
    return;
  }

  const A = list.find(x => x.cca2 === a);
  const B = list.find(x => x.cca2 === b);

  output.innerHTML = `
    <div class="compare-card fade-in">
      <h3>${A.name.common}</h3>
      <img src="${A.flags.png}" class="flag">
      <p>Population: ${A.population.toLocaleString()}</p>
      <p>Capital: ${A.capital?.[0] || "N/A"}</p>
      <p>Region: ${A.region}</p>
    </div>
    <div class="compare-card fade-in">
      <h3>${B.name.common}</h3>
      <img src="${B.flags.png}" class="flag">
      <p>Population: ${B.population.toLocaleString()}</p>
      <p>Capital: ${B.capital?.[0] || "N/A"}</p>
      <p>Region: ${B.region}</p>
    </div>
  `;
}
