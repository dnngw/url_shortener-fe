import { useContext } from 'react'
import { PendingCountContext } from '@/contexts/pendingCountContext'

/*
* Return { count, refresh }
* refresh() fetches the count again (ex: after approving a user)
* */
export function usePendingCount() {
  const context = useContext(PendingCountContext)
  if (!context) {
    throw new Error('usePendingCount should be use in Pending Count Provider')
  }
  return context
}
