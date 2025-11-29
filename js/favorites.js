document.addEventListener("DOMContentLoaded", () => {
  const favoritesList = document.getElementById("favoritesList");

  let saved = JSON.parse(localStorage.getItem("favorites")) || [];

  if (saved.length === 0) {
    favoritesList.innerHTML = "<p>No saved countries yet.</p>";
    return;
  }

  favoritesList.innerHTML = saved
    .map(
      (country) => `
      <div class="card">
        <img src="${country.flag || ""}" alt="${country.name}">
        <p>${country.name}</p>
      </div>
    `
    )
    .join("");
});
