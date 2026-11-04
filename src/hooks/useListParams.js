import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'

/*
* List params kept in the url : page, size, search (q) and extra filters
* ex: /links?q=promo&page=2&size=25, /admin/users?status=active
*
* They survive refresh, can be shared and work with the browser back button.
* Default values are left out of the url to keep it clean.
*
* pageSizeOptions : allowed page sizes, the first one is the default
* filters         : extra params with their default value, ex: { status: 'pending' }
* */
export function useListParams({ pageSizeOptions, filters: filterDefaults = {} }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const defaultSize = pageSizeOptions[0]

  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const sizeParam = Number(searchParams.get('size'))
  const pageSize = pageSizeOptions.includes(sizeParam) ? sizeParam : defaultSize
  const q = searchParams.get('q') ?? ''

  const filters = Object.fromEntries(
    Object.entries(filterDefaults).map(([name, defaultValue]) => [name, searchParams.get(name) ?? defaultValue])
  )

  // Text in the search box, updates on every key press. The url (q) is updated after a short delay
  const [searchInput, setSearchInput] = useState(q)

  // Keep the box in sync when q changes from outside (ex: browser back button)
  const [syncedQ, setSyncedQ] = useState(q)
  if (q !== syncedQ) {
    setSyncedQ(q)
    setSearchInput(q)
  }

  const updateParams = (changes) => {
    const next = { page, size: pageSize, q, ...filters, ...changes }
    const params = {}

    for (const [name, defaultValue] of Object.entries(filterDefaults)) {
      if (next[name] !== defaultValue) params[name] = next[name]
    }
    if (next.q.trim()) params.q = next.q
    if (next.page > 1) params.page = String(next.page)
    if (next.size !== defaultSize) params.size = String(next.size)

    setSearchParams(params)
  }

  // New keyword → results start from page 1
  const [applySearch, cancelSearch] = useDebouncedCallback((value) => {
    updateParams({ page: 1, q: value })
  }, 300)

  const onSearchChange = (value) => {
    setSearchInput(value)
    applySearch(value)
  }

  const clearSearch = () => {
    cancelSearch()
    setSearchInput('')
    updateParams({ page: 1, q: '' })
  }

  return {
    page,
    pageSize,
    keyword: q.trim(),
    filters,
    searchInput,
    onSearchChange,
    clearSearch,
    setPage: (nextPage) => updateParams({ page: nextPage }),
    // Back to page 1, the current page may not exist anymore with the new size
    setPageSize: (nextSize) => updateParams({ page: 1, size: nextSize }),
    // Changing a filter (ex: status) starts from page 1
    setFilter: (name, value) => updateParams({ page: 1, [name]: value }),
    // Change several filters in one url update, ex: { userId: '3', owner: 'alice01' }
    setFilters: (changes) => updateParams({ page: 1, ...changes }),
  }
}
