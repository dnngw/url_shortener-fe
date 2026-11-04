import { useCallback, useEffect, useState } from "react"
import { PendingCountContext } from "@/contexts/pendingCountContext"
import { useAuth } from "@/hooks/useAuth"
import { adminService } from "@/services/adminService"

// Check for new registrations every minute
const POLL_INTERVAL = 60_000

/*
* Pending Count Provider
*
* Only fetches for admin, other roles always get 0
* */
function PendingCountProvider({ children }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [count, setCount] = useState(0)

  const refresh = useCallback(() => {
    if (!isAdmin) return

    adminService
      .getPendingCount()
      .then((res) => setCount(res.data.count))
      // Badge is not critical, keep the last value when the request fails
      .catch(() => {})
  }, [isAdmin])

  useEffect(() => {
    if (!isAdmin) return

    refresh()
    const timer = setInterval(refresh, POLL_INTERVAL)
    return () => clearInterval(timer)
  }, [isAdmin, refresh])

  const value = { count: isAdmin ? count : 0, refresh }

  return <PendingCountContext value={value}>{children}</PendingCountContext>
}

export default PendingCountProvider
