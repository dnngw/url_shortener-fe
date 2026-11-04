import { apiFetch } from "@/api/client";

export const qrService = {
  // Return PNG image as Blob (endpoint needs Bearer token, so <img src> cannot call it directly)
  generate : (url) => apiFetch(`/qr?url=${encodeURIComponent(url)}`, { responseType: 'blob' })
}
