import { linkService } from '@/services/linkService'
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery'

/*
* Fetch paginated links of the logged in user
*
* q : search keyword (short code or destination url), empty = all links
*
* Return { data, error, isLoading, reload }
* data : { items, page, size, totalItems, totalPages }
* */
export function useLinks({ page = 1, size = 10, q = '' } = {}) {
  return usePaginatedQuery(linkService.getAll, { page, size, q })
}
