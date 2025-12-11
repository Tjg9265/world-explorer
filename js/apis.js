// =======================================================
// Central API Loader for World Explorer
// Handles: News Feed, Compare Tool, Country Search
// Called by: app.js
// =======================================================

// NEWS MODULE
import { getWikiNews, renderNews } from "./news.js";

// COMPARE TOOL
import { initCompareTool } from "./compare.js";

// COUNTRY SEARCH
import { initCountrySearch } from "./countrySearch.js";

// =======================================================
// Initialize all external APIs and main features
// =======================================================
export async function initAPIs() {
  // -------------------------
  // 1. Load Wikipedia News
  // -------------------------
  try {
    if (document.querySelector("#news-container")) {
      const news = await getWikiNews();
      renderNews(news);
}

  } catch (err) {
    console.error("News API failed:", err);
    document.querySelector("#news-container").innerHTML =
      "<p>Unable to load Wikipedia News.</p>";
  }

  // -------------------------
  // 2. Initialize Compare Tool
  // -------------------------
  initCompareTool();

  // -------------------------
  // 3. Initialize Country Search
  // -------------------------
  initCountrySearch();
}
