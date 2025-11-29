document.addEventListener("DOMContentLoaded", () => {
  console.log("World Explorer loaded.");

  const input = document.getElementById("countrySearchInput");
  const button = document.getElementById("countrySearchBtn");

  if (button) {
    button.addEventListener("click", () => {
      const query = input.value.trim();
      if (query.length > 0) {
        window.location.href = `country.html?name=${query}`;
      }
    });
  }
});
