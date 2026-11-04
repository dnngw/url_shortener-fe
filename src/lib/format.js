// Base url for the short link, short code is served by the backend at root path
const SHORT_URL_BASE = import.meta.env.VITE_SHORT_URL_BASE || window.location.origin;

export function getShortUrl(shortCode) {
  return `${SHORT_URL_BASE}/${shortCode}`;
}

// Show short url without protocol, ex: localhost:8080/promo
export function displayUrl(url) {
  return url.replace(/^https?:\/\//, "");
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

// createdAt from backend is ISO-8601 string
export function formatDate(value) {
  return value ? dateFormatter.format(new Date(value)) : "-";
}
