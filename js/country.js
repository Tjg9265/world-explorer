import { getWikiSummary } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const countryName = params.get("name");

  const data = await getWikiSummary(countryName);

  if (!data) {
    document.getElementById("app").innerHTML = "<p>Country not found.</p>";
    return;
  }

  document.getElementById("app").innerHTML = `
    <section class="country-header">
      <h2>${data.title}</h2>
      <img src="${data.thumbnail?.source || ""}" alt="${data.title}">
    </section>

    <section class="country-info">
      <p>${data.extract}</p>
    </section>

    <section class="must-see">
      <h3>Must-See Places</h3>
      <div id="mustSeeList" class="card-grid">

        <div class="card placeholder-card">
          <div class="placeholder-image"></div>
          <p>Coming soon</p>
        </div>

        <div class="card placeholder-card">
          <div class="placeholder-image"></div>
          <p>Coming soon</p>
        </div>

        <div class="card placeholder-card">
          <div class="placeholder-image"></div>
          <p>Coming soon</p>
        </div>

      </div>
    </section>
  `;
});

/* ------------------------------
   Placeholder exports needed
   for apis.js (NO ERRORS)
--------------------------------*/

export function loadAttractions() {
  console.warn("loadAttractions() not implemented yet.");
}

export function renderAttractions() {
  console.warn("renderAttractions() not implemented yet.");
}
