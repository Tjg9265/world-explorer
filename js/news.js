// ===============================
// WIKIPEDIA NEWS FEED (Working Version)
// ===============================

// Fetch Featured News from *Wikipedia REST API* (CORS-Friendly)
export async function getWikiNews() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");

  // ✔ This endpoint works — NO CORS ERRORS
  const url = `https://en.wikipedia.org/api/rest_v1/feed/featured/${y}/${m}/${d}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Wikipedia API Error");

    const data = await response.json();
    const items = data.news || [];

    if (!items.length) {
      return [{
        id: "news-none",
        title: "No Featured News Today",
        summary: "Wikipedia has not published today's featured stories.",
        url: "https://en.wikipedia.org/wiki/Portal:Current_events",
        thumbnail:
          "https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg"
      }];
    }

    return items.map((item, i) => {
      const cleanSummary = stripHtml(item.story || "");
      const summary =
        cleanSummary.length > 200
          ? cleanSummary.slice(0, cleanSummary.lastIndexOf(" ", 200)) + "..."
          : cleanSummary;

      return {
        id: `news-${i}`,
        title: item.titles?.normalized || `Wikipedia News #${i + 1}`,
        summary,
        url: item.links?.[0]?.url || "https://en.wikipedia.org/wiki/Portal:Current_events",
        thumbnail:
          item.thumbnail?.source ||
          "https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg"
      };
    });
  } catch (err) {
    console.error("News API Error:", err);
    return [{
      id: "news-error",
      title: "Unable to load news",
      summary: "There was an error fetching the Wikipedia news feed.",
      url: "https://en.wikipedia.org/wiki/Portal:Current_events",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg"
    }];
  }
}

// Render news cards
export function renderNews(newsArray) {
  const container = document.querySelector("#news-container");
  if (!container) return;

  container.innerHTML = newsArray
    .map(item => `
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
    `)
    .join("");
}

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
}
