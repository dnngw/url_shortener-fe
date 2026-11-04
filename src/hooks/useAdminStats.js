import { useEffect, useState } from 'react'
import { adminService } from '@/services/adminService'

/*
* Fetch numbers for the admin dashboard
*
* Return { data, error, isLoading }
* data : { pendingUsers, activeUsers, inactiveUsers, totalLinks }
* */
export function useAdminStats() {
  const [result, setResult] = useState({ done: false, data: null, error: null })

  useEffect(() => {
    // Ignore the response when the page is closed before it arrives
    let ignore = false

    adminService
      .getStats()
      .then((res) => {
        if (!ignore) setResult({ done: true, data: res.data, error: null })
      })
      .catch((error) => {
        if (!ignore) setResult({ done: true, data: null, error })
      })

    return () => {
      ignore = true
    }
  }, [])

  return {
    data: result.data,
    error: result.error,
    isLoading: !result.done,
  }
}
