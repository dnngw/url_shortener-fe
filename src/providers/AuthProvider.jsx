import { refreshAccessToken } from "@/api/client";
import { AuthContext } from "@/contexts/authContext";
import { getUserFromToken, setSessionExpiredHandler, tokenStorage } from "@/lib/token";
import { authService } from "@/services/authService";
import { useEffect, useState } from "react"


function AuthProvider({ children }) {
  // Read saved token once on first render, so a valid session shows immediately
  const [user, setUser] = useState(() => getUserFromToken(tokenStorage.get()));
  const [isLoading, setIsLoading] = useState(() => !user);

  useEffect(() => {
    setSessionExpiredHandler(() => setUser(null));

    // Token still valid → no need to refresh
    if (getUserFromToken(tokenStorage.get())) {
      return;
    }

    // Token missing / expired → try restore session from refresh token cookie
    tokenStorage.remove()
    refreshAccessToken()
      .then((token) => setUser(getUserFromToken(token)))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))

  }, []);

  // Return the user, so the login page can redirect by role
  const login = async (credentials) => {
    const { data } = await authService.login(credentials)
    tokenStorage.set(data.accessToken)

    const loggedInUser = getUserFromToken(data.accessToken)
    setUser(loggedInUser)
    return loggedInUser
  }

  const register = (payload) => authService.register(payload)

  const logout = async () => {
    try {
      await authService.logout()
    } catch {
      // Cookie may already expired, session in FE still need to be cleared
    } finally {
      tokenStorage.remove()
      setUser(null)
    }
  }

  const value = {
    user,
    isLoggedIn: !!user,
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext value={value}>{children}</AuthContext>
}

export default AuthProvider
