import { adminService } from '@/services/adminService'
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery'

/*
* Fetch paginated users for admin
*
* status : all | pending | active | inactive
* q      : search keyword (username), empty = all users
*
* Return { data, error, isLoading, reload }
* data : { items, page, size, totalItems, totalPages }
* */
export function useAdminUsers({ status = 'all', page = 1, size = 10, q = '' } = {}) {
  return usePaginatedQuery(adminService.getUsers, { status, page, size, q })
}
