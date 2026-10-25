const PLACEHOLDER_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">' +
  '<rect width="200" height="200" rx="18" fill="#edf2e8"/>' +
  '<path d="M48 115h104l-12 52H60z" fill="#c58c62"/>' +
  '<path d="M100 118V54M100 82C65 82 61 55 61 55c28-4 39 10 39 27M100 96c36 0 42-29 42-29-29-4-42 12-42 29" fill="none" stroke="#52745b" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>' +
  '<text x="100" y="188" font-size="10" text-anchor="middle" fill="#35503c">HOMEHAVEN</text>' +
  '</svg>';
const PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(PLACEHOLDER_SVG)}`;
export function handleImageError(event) {
  const img = event.currentTarget;
  if (img.dataset.fallback) return;
  img.dataset.fallback = "true";
  img.src = PLACEHOLDER;
}
