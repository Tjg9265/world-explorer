export async function getWikiSummary(countryName) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${countryName}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Country not found");
    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}
