import { apiFetch } from "@/api/client";

export const authService = {
  login : (data) => apiFetch('/auth/login', { method: 'POST', body: data }),
  register : (data) => apiFetch('/auth/register', { method: 'POST', body: data }),
  logout : () => apiFetch('/auth/logout', { method: 'POST' })
}
