import { apiFetch } from "@/api/client";

export const linkService = {
  // q : search by short code or destination url (optional)
  getAll : ({ page = 1, size = 10, q = '' } = {}) => {
    const params = new URLSearchParams({ page, size })
    if (q) params.set('q', q)
    return apiFetch(`/link?${params}`)
  },
  getById : (id) => apiFetch(`/link/${id}`),
  create : (data) => apiFetch('/link', { method: 'POST', body: data }),
  update : (id, data) => apiFetch(`/link/${id}`, { method: 'PATCH', body: data }),
  remove : (id) => apiFetch(`/link/${id}`, { method: 'DELETE' })
}
