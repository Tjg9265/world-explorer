// ===============================
// WIKIPEDIA NEWS FEED (Week 6)
// ===============================

// You may need an access token depending on your instructor's API requirements.
// For now this uses the public Featured Feed endpoint.

export async function getWikiNews() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");

  const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${y}/${m}/${d}`;

  const headers = {
    "User-Agent": "BYUI-Student-WorldExplorer/1.0"
  };

  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error("Wikipedia API Error");

  const data = await response.json();
  const items = data.news || [];

  // Clean small HTML blocks from Wikipedia summaries
  return items.map((item, i) => {
    const summary = stripHtml(item.story).slice(0, 200) + "...";
    return {
      id: `news-${i}`,
      title: `Wikipedia News #${i + 1}`,
      summary,
      url: "https://en.wikipedia.org/wiki/Portal:Current_events",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/120px-Wikipedia-logo-v2.svg.png"
    };
  });
}

export function renderNews(newsArray) {
  const container = document.querySelector("#news-container");
  container.innerHTML = "";

  newsArray.forEach(item => {
    const card = `
      <div class="card fade-in">
        <img src="${item.thumbnail}" alt="" class="card-img">
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <div class="card-footer">
          <a href="${item.url}" target="_blank">Read More</a>
          <button class="fav-btn" data-id="${item.id}">❤️</button>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });
}

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
}
