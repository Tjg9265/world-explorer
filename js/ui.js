// Utility to sanitize text from APIs or user input
function sanitize(str) {
  return String(str)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function createCard(title, imageUrl) {
  const safeTitle = sanitize(title);

  return `
    <div class="card">
      <img 
        src="${imageUrl}" 
        alt="${safeTitle}" 
        loading="lazy">
      <p>${safeTitle}</p>
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
  const safeText = sanitize(text);
  return `<h3 class="section-title">${safeText}</h3>`;
}
