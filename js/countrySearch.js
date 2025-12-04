import { addFavorite } from "./favorites.js";

export async function initCountrySearch() {
  const input = document.querySelector("#countrySearchInput");
  const btn = document.querySelector("#countrySearchBtn");
  const suggestions = document.querySelector("#suggestions");
  const results = document.querySelector("#countrySearchResults");
  const voiceBtn = document.querySelector("#voiceSearchBtn");
  const historyEl = document.querySelector("#searchHistory");
  const trendingEl = document.querySelector("#trendingCountries");
  const geoEl = document.querySelector("#geoCountry");
  const geoStatus = document.querySelector("#geoStatus");
  const clearBtn = document.querySelector("#clearHistoryBtn");
  const mapModal = document.querySelector("#mapModal");
  const closeMap = document.querySelector("#closeMap");

  if (!input || !btn) return;

  // Load countries
  const countries = await fetch(
  "https://restcountries.com/v3.1/all?fields=name,flags,cca2,capital,region,population,latlng"
).then(r => r.json());

  // ===============================
  // CLICKABLE TRENDING COUNTRIES
  // ===============================
  const topTrending = [...countries]
    .sort((a, b) => b.population - a.population)
    .slice(0, 8);

  trendingEl.innerHTML = topTrending
    .map(c => `
      <div class="card fade-in trending-card" data-name="${c.name.common}">
        <img src="${c.flags.png}">
        <h3>${c.name.common}</h3>
      </div>
    `)
    .join("");

  document.querySelectorAll(".trending-card").forEach(card =>
    card.addEventListener("click", () => {
      input.value = card.dataset.name;
      searchCountry();
    })
  );

  // ===============================
  // AUTO-SUGGESTIONS
  // ===============================
  input.addEventListener("input", () => {
    const term = input.value.toLowerCase();
    if (!term) return (suggestions.style.display = "none");

    const matches = countries.filter(c =>
      c.name.common.toLowerCase().startsWith(term)
    );

    suggestions.innerHTML = matches
      .slice(0, 6)
      .map(c => `<div data-name="${c.name.common}">${c.name.common}</div>`)
      .join("");

    suggestions.style.display = "block";

    document.querySelectorAll("#suggestions div").forEach(s =>
      s.addEventListener("click", () => {
        input.value = s.dataset.name;
        suggestions.style.display = "none";
        searchCountry();
      })
    );
  });

  // ===============================
  // CLEAR SEARCH HISTORY
  // ===============================
  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("searchHistory");
    historyEl.innerHTML = "";
  });

  // ===============================
  // SEARCH HISTORY
  // ===============================
  function loadHistory() {
    const hist = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    historyEl.innerHTML = hist
      .map(t => `<span data-term="${t}">${t}</span>`)
      .join("");

    document.querySelectorAll(".history-list span").forEach(span =>
      span.addEventListener("click", () => {
        input.value = span.dataset.term;
        searchCountry();
      })
    );
  }

  function saveHistory(term) {
    let hist = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    if (!hist.includes(term)) {
      hist.unshift(term);
      hist = hist.slice(0, 8);
      localStorage.setItem("searchHistory", JSON.stringify(hist));
    }
    loadHistory();
  }

  loadHistory();

  // ===============================
  // VOICE SEARCH
  // ===============================
  if ("webkitSpeechRecognition" in window) {
    const rec = new webkitSpeechRecognition();
    rec.lang = "en-US";

    voiceBtn.addEventListener("click", () => rec.start());

    rec.onresult = (e) => {
      input.value = e.results[0][0].transcript;
      searchCountry();
    };
  }

  // ===============================
  // GEOLOCATION
  // ===============================
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const info = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
        .then(r => r.json());

      if (info.country) {
        geoStatus.textContent = "Your country:";

        const found = countries.find(c => 
          c.name.common.toLowerCase() === info.country.toLowerCase()
        );

        if (found) {
          geoEl.innerHTML = `
            <div class="card fade-in">
              <img src="${found.flags.png}">
              <h3>${found.name.common}</h3>
            </div>
          `;
        }
      }
    });
  }

  // ===============================
  // MAIN SEARCH FUNCTION
  // ===============================
  btn.addEventListener("click", () => searchCountry());
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchCountry();
  });

  function searchCountry() {
    const term = input.value.trim().toLowerCase();
    if (!term) return;

    suggestions.style.display = "none";

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
        
        <img src="${c.flags.png}" class="card-img" />
        <h3>${c.name.common}</h3>
        <p>Region: ${c.region}</p>
        <p>Population: ${c.population.toLocaleString()}</p>
        <p>Capital: ${c.capital?.[0] || "N/A"}</p>
        <button class="btn-fav" data-id="${c.cca2}">❤️ Save</button>
        <button class="btn" data-map="true">🗺 View Map</button>
      </div>
    `)
      .join("");

    // Favorite buttons
    document.querySelectorAll(".btn-fav").forEach(f =>
      f.addEventListener("click", () => {
        const code = f.dataset.id;
        const country = matches.find(c => c.cca2 === code);
        addFavorite({
          id: country.cca2,
          name: country.name.common,
          img: country.flags.png
        });
      })
    );

    // MAP BUTTONS
    document.querySelectorAll("[data-map]").forEach(m =>
      m.addEventListener("click", () => {
        const card = m.closest(".country-result");
        const lat = card.dataset.lat;
        const lng = card.dataset.lng;

        openMap(lat, lng);
      })
    );
  }

  // ===============================
  // MAP (Leaflet.js)
  // ===============================
  function openMap(lat, lng) {
    mapModal.style.display = "flex";

    setTimeout(() => {
      const map = L.map("map").setView([lat, lng], 5);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      L.marker([lat, lng]).addTo(map);
    }, 50);
  }

  closeMap.addEventListener("click", () => {
    mapModal.style.display = "none";
    document.querySelector("#map").innerHTML = "";
  });
}
