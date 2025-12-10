import { initAPIs } from "./apis.js";
import { renderFavorites } from "./favorites.js";

/**
 * ==================================================
 * MAIN APP INITIALIZATION
 * ==================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("World Explorer Loaded");

  // Run all API loading for homepage
  safeInit(initAPIs);

  // Favorites page logic
  if (document.querySelector("#favorites-list")) {
    safeInit(renderFavorites);
  }

  // Initialize UI Systems
  initDarkMode();
  initModalSystem();
  initKeyboardAccessibility();
});


/**
 * ==================================================
 * SAFE WRAPPER FOR API MODULE FUNCTIONS
 * Prevents UI crashes if an API call fails
 * ==================================================
 */
function safeInit(fn) {
  try {
    fn();
  } catch (err) {
    console.warn("Module failed:", fn.name, err);
  }
}


/**
 * ==================================================
 * DARK MODE HANDLER
 * ==================================================
 */
function initDarkMode() {
  const themeSwitch = document.querySelector("#themeSwitch");
  if (!themeSwitch) return;

  const saved = localStorage.getItem("darkMode");

  if (saved === "on") {
    document.body.classList.add("dark-mode");
    themeSwitch.checked = true;
  }

  themeSwitch.addEventListener("change", () => {
    const isDark = themeSwitch.checked;
    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem("darkMode", isDark ? "on" : "off");
  });
}


/**
 * ==================================================
 * MAP MODAL IMPROVED SYSTEM
 * Proper fade-in/out and ARIA updates
 * ==================================================
 */
function initModalSystem() {
  const modal = document.querySelector("#mapModal");
  const closeBtn = document.querySelector("#closeMap");
  if (!modal || !closeBtn) return;

  // Handle ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMapModal();
  });

  closeBtn.addEventListener("click", closeMapModal);

  function closeMapModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    setTimeout(() => (modal.style.display = "none"), 200);
  }

  // Allow other modules to open modal globally
  window.openMapModal = () => {
    modal.style.display = "flex";
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  };
}


/**
 * ==================================================
 * KEYBOARD ACCESSIBILITY FIXES
 * ==================================================
 * Lets user navigate cards and suggestions
 * using arrow keys and enter.
 */
function initKeyboardAccessibility() {
  const suggestions = document.querySelector("#suggestions");
  const searchInput = document.querySelector("#countrySearchInput");

  if (!suggestions || !searchInput) return;

  let focusIndex = -1;

  searchInput.addEventListener("keydown", (e) => {
    const items = suggestions.querySelectorAll("div");
    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusIndex = (focusIndex + 1) % items.length;
      items[focusIndex].scrollIntoView({ block: "nearest" });
      items[focusIndex].focus();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      focusIndex = (focusIndex - 1 + items.length) % items.length;
      items[focusIndex].scrollIntoView({ block: "nearest" });
      items[focusIndex].focus();
    }

    if (e.key === "Enter" && focusIndex >= 0) {
      e.preventDefault();
      items[focusIndex].click();
    }
  });
}
