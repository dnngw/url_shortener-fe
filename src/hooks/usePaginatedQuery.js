import { useCallback, useEffect, useState } from 'react'

/*
* Fetch a paginated list from the API
*
* fetchFn : service function that receives params and returns { data }, must be stable
*           (ex: linkService.getAll, not an inline arrow function)
* params  : request params, ex: { page, size, q }. A new value triggers a new request
*
* Return { data, error, isLoading, reload }
* data : { items, page, size, totalItems, totalPages }
* */
export function usePaginatedQuery(fetchFn, params) {
  // Increase to fetch again with the same params (ex: after create / delete)
  const [version, setVersion] = useState(0)

  // Params as a string, so a new object with the same values does not trigger a request
  const paramsKey = JSON.stringify(params)
  const requestKey = `${paramsKey}-${version}`

  // Keep the key of the finished request, loading = current key not finished yet
  const [result, setResult] = useState({ key: null, data: null, error: null })

  useEffect(() => {
    // Ignore response from an old request (ex: user changes page quickly)
    let ignore = false

    fetchFn(JSON.parse(paramsKey))
      .then((res) => {
        if (!ignore) setResult({ key: requestKey, data: res.data, error: null })
      })
      .catch((error) => {
        // Keep the previous data, so the table does not disappear on a failed page change
        if (!ignore) setResult((prev) => ({ key: requestKey, data: prev.data, error }))
      })

    return () => {
      ignore = true
    }
  }, [fetchFn, paramsKey, requestKey])

  const reload = useCallback(() => setVersion((v) => v + 1), [])

  return {
    data: result.data,
    error: result.error,
    isLoading: result.key !== requestKey,
    reload,
  }
}
