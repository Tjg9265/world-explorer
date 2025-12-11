// =======================================
// COUNTRY DETAILS PAGE
// Loads Wikipedia summary for the selected country
// =======================================

import { getWikiSummary } from "./api.js";

// Simple sanitization for safety
function sanitize(str) {
  return String(str).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const countryName = params.get("name");

  // Early return if no name in URL
  if (!countryName) {
    document.getElementById("app").innerHTML = "<p>Country not found.</p>";
    return;
  }

  let data = null;

  try {
    data = await getWikiSummary(countryName);
  } catch (err) {
    console.error("Wikipedia Summary Error:", err);
  }

  if (!data) {
    document.getElementById("app").innerHTML = "<p>Country not found.</p>";
    return;
  }

  const title = sanitize(data.title || "Unknown Country");
  const extract = sanitize(data.extract || "No summary available.");
  const thumbnail = data.thumbnail?.source || "";

  // ==========================
  // Render Country Details
  // ==========================
  document.getElementById("app").innerHTML = `
    <section class="country-header">
      <h2>${title}</h2>
      <img 
        src="${thumbnail}" 
        alt="Country image for ${title}"
        loading="lazy">
    </section>

    <section class="country-info">
      <p>${extract}</p>
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
