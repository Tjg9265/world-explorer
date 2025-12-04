// Central API imports
import { getWikiNews, renderNews } from "./news.js";

import { initCompareTool } from "./compare.js";
import { initCountrySearch } from "./countrySearch.js";


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

 

  // COMPARE TOOL
  initCompareTool();

  
   // COUNTRY SEARCH
  initCountrySearch();
}
