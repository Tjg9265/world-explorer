import { initAPIs } from "./apis.js";
import { renderFavorites } from "./favorites.js";

document.addEventListener("DOMContentLoaded", () => {
  initAPIs();

  // Only run favorites logic on the favorites page
  if (document.querySelector("#favorites-list")) {
    renderFavorites();
  }
});
