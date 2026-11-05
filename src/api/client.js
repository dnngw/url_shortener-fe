import { tokenStorage, notifySessionExpired } from '@/lib/token'

const BASE_URL = import.meta.env.VITE_API_URL

// ngrok free answers browser requests with an HTML warning page (no CORS headers)
// unless this header is present. Harmless for any other backend.
const DEFAULT_HEADERS = { 'ngrok-skip-browser-warning': 'true' }

// Error from API, keep http status so the UI can react (ex: 409 → field error)
export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

let refreshPromise = null;

// Backend rotates the refresh token, so only one refresh request may run at a time.
// Every caller that comes while refreshing shares the same promise.
export function refreshAccessToken() {

  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',   // send cookie refresh token
      headers: DEFAULT_HEADERS,
    })
      .then(async (res) => {
        if (!res.ok) throw new ApiError('Session ended', res.status);
        const data = await res.json();
        tokenStorage.set(data.data.accessToken);
        return data.data.accessToken;
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

// request
function request(endpoint, { body, headers, ...options }) {
  const token = tokenStorage.get()

  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...DEFAULT_HEADERS,
      ...(body && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
}

// Endpoint that should not trigger refresh when the response is 401
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

/*
* Fetch wrapper
*
* options.responseType : 'json' (default) or 'blob' (ex: QR code image)
* */
export async function apiFetch(endpoint, { responseType = 'json', ...options } = {}) {
  let res = await request(endpoint, options)

  // token expired → try recreate access token, repeat the request again
  if (res.status === 401 && !AUTH_ENDPOINTS.includes(endpoint)) {
    try {
      await refreshAccessToken()
    } catch {
      tokenStorage.remove()
      notifySessionExpired()
      throw new ApiError('Session ended, please login again', 401)
    }
    res = await request(endpoint, options)
  }

  if (res.ok && responseType === 'blob') {
    return res.blob()
  }

  // Gson omits null fields, so "data" may not exist in the body
  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new ApiError(data?.message || 'Something went wrong', res.status)
  }

  return data
}
