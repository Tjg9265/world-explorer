// ============================================
// COUNTRY SEARCH MODULE
// ============================================

import { addFavorite } from "./favorites.js";

export async function initCountrySearch() {
  // -------------------------------------------------
  // 1. EARLY EXIT — Only run on pages that have search UI
  // -------------------------------------------------
  const input = document.querySelector("#countrySearchInput");
  const btn = document.querySelector("#countrySearchBtn");
  const results = document.querySelector("#countrySearchResults");

  if (!input || !btn || !results) {
    console.warn("Country Search UI not found — skipping module.");
    return;
  }

  // -------------------------------------------------
  // 2. SAFE DOM REFERENCES (These may not exist)
  // -------------------------------------------------
  const suggestions = document.querySelector("#suggestions");
  const voiceBtn = document.querySelector("#voiceSearchBtn");
  const historyEl = document.querySelector("#searchHistory");
  const trendingEl = document.querySelector("#trendingCountries");
  const geoEl = document.querySelector("#geoCountry");
  const geoStatus = document.querySelector("#geoStatus");
  const clearBtn = document.querySelector("#clearHistoryBtn");
  const mapModal = document.querySelector("#mapModal");
  const closeMap = document.querySelector("#closeMap");

  // Sanitizer
  const clean = str => String(str).replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // -------------------------------------------------
  // 3. Load REST Countries API
  // -------------------------------------------------
  const countries = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,flags,cca2,capital,region,population,latlng"
  ).then(r => r.json());

  // -------------------------------------------------
  // 4. TRENDING COUNTRIES (Top 8 by population)
  // -------------------------------------------------
  if (trendingEl) {
    const topTrending = [...countries]
      .sort((a, b) => b.population - a.population)
      .slice(0, 8);

    trendingEl.innerHTML = topTrending
      .map(c => `
        <div class="card fade-in trending-card" data-name="${clean(c.name.common)}">
          <img src="${c.flags.png}" loading="lazy" alt="Flag of ${clean(c.name.common)}">
          <h3>${clean(c.name.common)}</h3>
        </div>
      `)
      .join("");

    trendingEl.querySelectorAll(".trending-card").forEach(card =>
      card.addEventListener("click", () => {
        input.value = card.dataset.name;
        searchCountry();
      })
    );
  }

  // -------------------------------------------------
  // 5. AUTO-SUGGESTIONS
  // -------------------------------------------------
  if (suggestions) {
    input.addEventListener("input", () => {
      const term = input.value.toLowerCase().trim();

      if (!term) {
        suggestions.style.display = "none";
        return;
      }

      const matches = countries.filter(c =>
        c.name.common.toLowerCase().startsWith(term)
      );

      suggestions.innerHTML = matches
        .slice(0, 6)
        .map(c => `<div data-name="${clean(c.name.common)}">${clean(c.name.common)}</div>`)
        .join("");

      suggestions.style.display = "block";

      suggestions.querySelectorAll("div").forEach(s =>
        s.addEventListener("click", () => {
          input.value = s.dataset.name;
          suggestions.style.display = "none";
          searchCountry();
        })
      );
    });
  }

  // -------------------------------------------------
  // 6. SEARCH HISTORY
  // -------------------------------------------------
  function loadHistory() {
    if (!historyEl) return;

    const hist = JSON.parse(localStorage.getItem("searchHistory") || "[]");

    historyEl.innerHTML = hist
      .map(t => `<span data-term="${clean(t)}">${clean(t)}</span>`)
      .join("");

    historyEl.querySelectorAll("span").forEach(span =>
      span.addEventListener("click", () => {
        input.value = span.dataset.term;
        searchCountry();
      })
    );
  }

  function saveHistory(term) {
    if (!historyEl) return;

    let hist = JSON.parse(localStorage.getItem("searchHistory") || "[]");

    if (!hist.includes(term)) {
      hist.unshift(term);
      hist = hist.slice(0, 8);
      localStorage.setItem("searchHistory", JSON.stringify(hist));
    }

    loadHistory();
  }

  loadHistory();

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem("searchHistory");
      loadHistory();
    });
  }

  // -------------------------------------------------
  // 7. VOICE SEARCH
  // -------------------------------------------------
  if (voiceBtn && "webkitSpeechRecognition" in window) {
    const rec = new webkitSpeechRecognition();
    rec.lang = "en-US";

    voiceBtn.addEventListener("click", () => rec.start());

    rec.onresult = e => {
      input.value = e.results[0][0].transcript;
      searchCountry();
    };
  }

  // -------------------------------------------------
  // 8. GEOLOCATION
  // -------------------------------------------------
  if (navigator.geolocation && geoEl && geoStatus) {
    navigator.geolocation.getCurrentPosition(async pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      try {
        const info = await fetch(
          `https://geocode.xyz/${lat},${lng}?geoit=json`
        ).then(r => r.json());

        if (info.country) {
          geoStatus.textContent = "Your country:";

          const found = countries.find(
            c => c.name.common.toLowerCase() === info.country.toLowerCase()
          );

          if (found) {
            geoEl.innerHTML = `
              <div class="card fade-in">
                <img src="${found.flags.png}" loading="lazy" alt="Flag of ${clean(found.name.common)}">
                <h3>${clean(found.name.common)}</h3>
              </div>
            `;
          }
        }
      } catch {
        geoStatus.textContent = "Unable to detect location.";
      }
    });
  }

  // -------------------------------------------------
  // 9. MAIN SEARCH FUNCTION
  // -------------------------------------------------
  btn.addEventListener("click", searchCountry);
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") searchCountry();
  });

  function searchCountry() {
    const term = input.value.trim().toLowerCase();
    if (!term) return;

    if (suggestions) suggestions.style.display = "none";
    saveHistory(input.value);

    const matches = countries.filter(c =>
      c.name.common.toLowerCase().includes(term)
    );

    if (!matches.length) {
      results.innerHTML = "<p>No countries found.</p>";
      return;
    }

    results.innerHTML = matches
      .map(c => `
        <div class="card fade-in country-result"
             data-lat="${c.latlng[0]}"
             data-lng="${c.latlng[1]}">

          <img src="${c.flags.png}"
               loading="lazy"
               alt="Flag of ${clean(c.name.common)}"
               class="card-img" />

          <h3>${clean(c.name.common)}</h3>
          <p>Region: ${clean(c.region)}</p>
          <p>Population: ${c.population.toLocaleString()}</p>
          <p>Capital: ${clean(c.capital?.[0] || "N/A")}</p>

          <button class="btn-fav" data-id="${c.cca2}" type="button">❤️ Save</button>
          <button class="btn" data-map="true" type="button">🗺 View Map</button>
        </div>
      `)
      .join("");

    // FAVORITES
    results.querySelectorAll(".btn-fav").forEach(btn =>
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const country = matches.find(c => c.cca2 === id);

        addFavorite({
          id: country.cca2,
          name: country.name.common,
          img: country.flags.png
        });
      })
    );

    // MAP POPUP
    results.querySelectorAll("[data-map]").forEach(btn =>
      btn.addEventListener("click", () => {
        const card = btn.closest(".country-result");
        openMap(card.dataset.lat, card.dataset.lng);
      })
    );
  }

  // -------------------------------------------------
  // 10. MAP (LEAFLET MODAL)
  // -------------------------------------------------
  function openMap(lat, lng) {
    if (!mapModal) return;

    mapModal.style.display = "flex";

    setTimeout(() => {
      const mapBox = document.querySelector("#map");
      mapBox.innerHTML = "";

      const map = L.map("map").setView([lat, lng], 5);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19
      }).addTo(map);

      L.marker([lat, lng]).addTo(map);
    }, 50);
  }

  if (closeMap && mapModal) {
    closeMap.addEventListener("click", () => {
      mapModal.style.display = "none";
      document.querySelector("#map").innerHTML = "";
    });
  }
}
