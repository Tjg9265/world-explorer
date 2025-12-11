// ===================================================
// MAIN APP INITIALIZATION
// ===================================================

import { initAPIs } from "./apis.js";
import { renderFavorites } from "./favorites.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("%cWorld Explorer Loaded", "color:#3a7; font-weight:bold;");

  // Homepage → load APIs (news, compare, search)
  safeInit(initAPIs);

  // Favorites page
  if (document.querySelector("#favorites-list")) {
    safeInit(renderFavorites);
  }

  // Global UI Systems
  initDarkMode();
  initModalSystem();
  initKeyboardAccessibility();
});


// ===================================================
// SAFE WRAPPER — Prevents UI crashes
// ===================================================
function safeInit(fn) {
  try {
    fn();
  } catch (err) {
    console.warn(`Module failed: ${fn.name}`, err);
  }
}


// ===================================================
// DARK MODE SYSTEM
// ===================================================
function initDarkMode() {
  const toggle = document.querySelector("#themeSwitch");
  if (!toggle) return;

  // Load previously saved theme
  const saved = localStorage.getItem("darkMode");
  if (saved === "on") {
    document.body.classList.add("dark-mode");
    toggle.checked = true;
  }

  toggle.addEventListener("change", () => {
    const enabled = toggle.checked;
    document.body.classList.toggle("dark-mode", enabled);
    localStorage.setItem("darkMode", enabled ? "on" : "off");
  });
}


// ===================================================
// MAP MODAL SYSTEM
// Handles accessibility + animations
// ===================================================
function initModalSystem() {
  const modal = document.querySelector("#mapModal");
  const closeBtn = document.querySelector("#closeMap");

  if (!modal || !closeBtn) return;

  // Close modal
  function closeMapModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    setTimeout(() => (modal.style.display = "none"), 180);
  }

  // Allow modules like countrySearch to open modal safely
  window.openMapModal = () => {
    modal.style.display = "flex";
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  };

  // Close button
  closeBtn.addEventListener("click", closeMapModal);

  // ESC key support
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMapModal();
  });
}


// ===================================================
// KEYBOARD ACCESSIBILITY ENHANCEMENTS
// Arrow-key navigation for suggestions
// ===================================================
function initKeyboardAccessibility() {
  const suggestions = document.querySelector("#suggestions");
  const searchInput = document.querySelector("#countrySearchInput");

  if (!suggestions || !searchInput) return;

  let focusIndex = -1;

  searchInput.addEventListener("keydown", (e) => {
    const items = suggestions.querySelectorAll("div");
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusIndex = (focusIndex + 1) % items.length;
      items[focusIndex].focus();
      items[focusIndex].scrollIntoView({ block: "nearest" });
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      focusIndex = (focusIndex - 1 + items.length) % items.length;
      items[focusIndex].focus();
      items[focusIndex].scrollIntoView({ block: "nearest" });
    }

    if (e.key === "Enter" && focusIndex >= 0) {
      e.preventDefault();
      items[focusIndex].click();
    }
  });
}
