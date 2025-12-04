// Central API imports
import { getWikiNews, renderNews } from "./news.js";
import { loadAttractions, renderAttractions } from "./country.js";
import { initCompareTool } from "./compare.js";

// Main function called by app.js
export async function initAPIs() {
  // NEWS
  try {
    const news = await getWikiNews();
    renderNews(news);
  } catch {
    document.querySelector("#news-container").innerHTML =
      "<p>Unable to load Wikipedia News.</p>";
  }

  // ATTRACTIONS
  loadAttractions();
  renderAttractions();

  // COMPARE TOOL
  initCompareTool();
}
