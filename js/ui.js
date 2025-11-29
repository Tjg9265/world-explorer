export function createCard(title, imageUrl) {
  return `
    <div class="card">
      <img src="${imageUrl}" alt="${title}">
      <p>${title}</p>
    </div>
  `;
}

export function createPlaceholderCard() {
  return `
    <div class="card placeholder-card">
      <div class="placeholder-image"></div>
      <p>Loading...</p>
    </div>
  `;
}

export function sectionTitle(text) {
  return `<h3 class="section-title">${text}</h3>`;
}
