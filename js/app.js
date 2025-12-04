import { initAPIs } from "./apis.js";
import { renderFavorites } from "./favorites.js";

document.addEventListener("DOMContentLoaded", () => {
  // Load APIs for home/index
  initAPIs();

  // If on favorites page, load them
  if (document.querySelector("#favorites-list")) {
    renderFavorites();
  }

  // ============================
  // DARK MODE SYSTEM (WORKING)
  // ============================
  const themeSwitch = document.querySelector("#themeSwitch");

  // Load saved theme
  const saved = localStorage.getItem("darkMode");
  if (saved === "on") {
    document.body.classList.add("dark-mode");
    if (themeSwitch) themeSwitch.checked = true;
  }

  // Toggle theme
  if (themeSwitch) {
    themeSwitch.addEventListener("change", () => {
      const isDark = themeSwitch.checked;

      document.body.classList.toggle("dark-mode", isDark);

      localStorage.setItem("darkMode", isDark ? "on" : "off");
    });
  }
});

