// =======================================
// COUNTRY COMPARISON MODULE
// - Wikipedia Summary Compare
// - RESTCountries Data Compare
// =======================================

import { getWikiSummary } from "./api.js";

// Sanitization helper
function clean(str) {
  return String(str).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// =======================================
// 1. WIKIPEDIA COMPARE TOOL
// =======================================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("compareBtn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const a = document.getElementById("compareA").value.trim();
    const b = document.getElementById("compareB").value.trim();

    if (!a || !b) {
      alert("Please enter two countries.");
      return;
    }

    const dataA = await getWikiSummary(a);
    const dataB = await getWikiSummary(b);

    const container = document.getElementById("compareContainer");

    if (!dataA || !dataB) {
      container.innerHTML = "<p>One or both countries were not found.</p>";
      return;
    }

    const titleA = clean(dataA.title);
    const titleB = clean(dataB.title);

    container.innerHTML = `
      <div class="compare-card fade-in">
        <h3>${titleA}</h3>
        <img src="${dataA.thumbnail?.source || ""}" 
             alt="${titleA}" loading="lazy">
        <p>${clean(dataA.extract)}</p>
      </div>

      <div class="compare-card fade-in">
        <h3>${titleB}</h3>
        <img src="${dataB.thumbnail?.source || ""}" 
             alt="${titleB}" loading="lazy">
        <p>${clean(dataB.extract)}</p>
      </div>
    `;
  });
});

// =======================================
// 2. REST COUNTRIES COMPARE TOOL
// =======================================
export async function initCompareTool() {
  const selectA = document.querySelector("#countryA");
  const selectB = document.querySelector("#countryB");
  const btn = document.querySelector("#compare-btn");

  // Only run on compare.html
  if (!selectA || !selectB || !btn) return;

  // Fetch countries (FIXED ENDPOINT)
  let countries = [];
  try {
    countries = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2,flags,capital,region,population"
    ).then(r => r.json());
  } catch (err) {
    console.error("Failed to load country list.", err);
    return;
  }

  if (!countries.length) {
    console.error("Country list is empty.");
    return;
  }

  // Sort alphabetically
  const sorted = countries.sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );

  // Populate dropdowns
  const optionsHtml = sorted
    .map(c => `<option value="${c.cca2}">${clean(c.name.common)}</option>`)
    .join("");

  selectA.innerHTML += optionsHtml;
  selectB.innerHTML += optionsHtml;

  // Compare button action
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
      <h3>${clean(A.name.common)}</h3>
      <img src="${A.flags.png}" class="flag" loading="lazy"
           alt="Flag of ${clean(A.name.common)}">
      <p>Population: ${A.population.toLocaleString()}</p>
      <p>Capital: ${clean(A.capital?.[0] || "N/A")}</p>
      <p>Region: ${clean(A.region)}</p>
    </div>

    <div class="compare-card fade-in">
      <h3>${clean(B.name.common)}</h3>
      <img src="${B.flags.png}" class="flag" loading="lazy"
           alt="Flag of ${clean(B.name.common)}">
      <p>Population: ${B.population.toLocaleString()}</p>
      <p>Capital: ${clean(B.capital?.[0] || "N/A")}</p>
      <p>Region: ${clean(B.region)}</p>
    </div>
  `;
}
