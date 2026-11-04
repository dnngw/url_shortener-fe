import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import FullPageLoader from '@/components/FullPageLoader'

/*
* Protected Route
*
* roles (optional) : allowed roles, ex: ['user']. Without roles every logged in user is allowed
* */
function ProtectedRoute({ roles }) {
  const { user, isLoggedIn, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <FullPageLoader />

  // Remember the page, so after login user goes back to it
  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location }} />

  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />

  return <Outlet />
}

export default ProtectedRoute
