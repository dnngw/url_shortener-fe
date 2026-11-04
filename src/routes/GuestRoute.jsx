import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import FullPageLoader from '@/components/FullPageLoader'

/*
* Guest Route
*
* Only for user that not logged in yet (login, register).
* Redirect target follows the login page, so both agree where to go after login
* */
function GuestRoute() {
  const { isLoggedIn, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <FullPageLoader />
  if (isLoggedIn) return <Navigate to={location.state?.from?.pathname ?? '/dashboard'} replace />

  return <Outlet />
}

export default GuestRoute
