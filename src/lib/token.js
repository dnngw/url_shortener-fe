import { jwtDecode } from "jwt-decode";

// localstorage key for access token
const TOKEN_KEY = "access_token";

// function utilities for local storage
export const tokenStorage = {
  get : () => localStorage.getItem(TOKEN_KEY),
  set : (token) => localStorage.setItem(TOKEN_KEY, token),
  remove : () => localStorage.removeItem(TOKEN_KEY)  
};

// Decode jwt token
export function decoder(token) {
  if (!token) {
    return null;
  }

  try {
    const payload = jwtDecode(token);

    if (payload.exp && payload.exp * 1000 < Date.now() ) {
      return null;
    }
    
    return payload;

  }catch {
    return null
  }
}


// Map jwt payload to user object used by the UI
export function getUserFromToken(token) {
  const payload = decoder(token);

  if (!payload) {
    return null;
  }

  return {
    id: Number(payload.sub),
    username: payload.username,
    role: payload.role,
  };
}


// arlert for session token expired
let onSessionExpired = null;

export function setSessionExpiredHandler(fn) {
  onSessionExpired = fn;
}

export function notifySessionExpired() {
  onSessionExpired?.()
}



