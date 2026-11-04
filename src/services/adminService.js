import { apiFetch } from "@/api/client";

export const adminService = {
  // status : all | pending | active | inactive, q : search by username (optional)
  getUsers : ({ status = 'all', page = 1, size = 10, q = '' } = {}) => {
    const params = new URLSearchParams({ page, size })
    if (status !== 'all') params.set('status', status)
    if (q) params.set('q', q)
    return apiFetch(`/admin/users?${params}`)
  },
  getPendingCount : () => apiFetch('/admin/users/pending-count'),
  // { pendingUsers, activeUsers, inactiveUsers, totalLinks }
  getStats : () => apiFetch('/admin/stats'),
  approve : (id) => apiFetch(`/admin/users/${id}/approve`, { method: 'PATCH' }),
  reject : (id) => apiFetch(`/admin/users/${id}`, { method: 'DELETE' }),
  deactivate : (id) => apiFetch(`/admin/users/${id}/deactivate`, { method: 'PATCH' }),
  activate : (id) => apiFetch(`/admin/users/${id}/activate`, { method: 'PATCH' }),

  // status : all | active | disabled, userId : links of one user (optional), q : search (optional)
  getLinks : ({ status = 'all', userId = '', page = 1, size = 10, q = '' } = {}) => {
    const params = new URLSearchParams({ page, size })
    if (status !== 'all') params.set('status', status)
    if (userId) params.set('userId', userId)
    if (q) params.set('q', q)
    return apiFetch(`/admin/links?${params}`)
  },
  disableLink : (id) => apiFetch(`/admin/links/${id}/disable`, { method: 'PATCH' }),
  enableLink : (id) => apiFetch(`/admin/links/${id}/enable`, { method: 'PATCH' }),
}
