import { adminService } from '@/services/adminService'
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery'

/*
* Fetch every link for admin
*
* status : all | active | disabled
* userId : only links of this user, empty = every user
* q      : search keyword (short code, destination url or owner username)
*
* Return { data, error, isLoading, reload }
* data : { items, page, size, totalItems, totalPages }
* */
export function useAdminLinks({ status = 'all', userId = '', page = 1, size = 10, q = '' } = {}) {
  return usePaginatedQuery(adminService.getLinks, { status, userId, page, size, q })
}
