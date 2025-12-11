// ===============================
// WIKIPEDIA NEWS FEED (Week 6)
// ===============================

// Fetch Featured News from Wikimedia API
export async function getWikiNews() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");

  // Using api_user_agent instead of forbidden User-Agent header
  const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${y}/${m}/${d}?api_user_agent=BYUI-WorldExplorer`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Wikipedia API Error");

  const data = await response.json();
  const items = data.news || [];

  // Fallback if no news available for today
  if (items.length === 0) {
    return [{
      id: "news-none",
      title: "No news available today",
      summary: "Wikipedia has not published today's featured news yet.",
      url: "https://en.wikipedia.org/wiki/Portal:Current_events",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/120px-Wikipedia-logo-v2.svg.png"
    }];
  }

  return items.map((item, i) => {
    const clean = stripHtml(item.story);

    // Safer summary slicing
    const short =
      clean.length > 200
        ? clean.slice(0, clean.lastIndexOf(" ", 200)) + "..."
        : clean;

    return {
      id: `news-${i}`,
      title: `Wikipedia News #${i + 1}`,
      summary: short,
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
        <img 
          src="${item.thumbnail}" 
          alt="Wikipedia news thumbnail" 
          loading="lazy" 
          class="card-img">
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <div class="card-footer">
          <a href="${item.url}" target="_blank" rel="noopener noreferrer">Read More</a>
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
