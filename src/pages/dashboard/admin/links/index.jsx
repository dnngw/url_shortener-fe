import { useState } from 'react'
import { Link2, RotateCw, SearchX, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ConfirmDialog from '@/components/ConfirmDialog'
import PageHeader from '@/components/PageHeader'
import Pagination from '@/components/Pagination'
import SearchInput from '@/components/SearchInput'
import { useAdminLinks } from '@/hooks/useAdminLinks'
import { useListParams } from '@/hooks/useListParams'
import { adminService } from '@/services/adminService'
import AdminLinkTable from './components/AdminLinkTable'

const PAGE_SIZE_OPTIONS = [10, 25, 50]

const STATUS_FILTERS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'disabled', label: 'Disabled' },
]

/*
* Admin actions
*
* confirm : shown in a dialog before running, null = run directly
* */
const ACTIONS = {
  disable: {
    run: adminService.disableLink,
    success: (link) => `/${link.shortCode} disabled`,
    confirm: {
      title: 'Disable this link?',
      description: (link) =>
        `Visitors of /${link.shortCode} will see "This link has been disabled" instead of being redirected. ` +
        'The owner can still see the link, and you can enable it again later.',
      confirmLabel: 'Disable',
      loadingLabel: 'Disabling...',
      variant: 'destructive',
    },
  },
  enable: {
    run: adminService.enableLink,
    success: (link) => `/${link.shortCode} enabled`,
    confirm: null,
  },
}

function AdminLinks() {
  // Filters, page, size and search are kept in the url (?status=disabled&userId=3&owner=alice01&q=promo)
  const {
    page,
    pageSize,
    keyword,
    filters,
    searchInput,
    onSearchChange,
    clearSearch,
    setPage,
    setPageSize,
    setFilter,
    setFilters,
  } = useListParams({
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    // owner is only the label of the userId filter
    filters: { status: 'all', userId: '', owner: '' },
  })

  // Unknown status in the url falls back to "all"
  const statusFilter = STATUS_FILTERS.find((f) => f.value === filters.status) ?? STATUS_FILTERS[0]
  const status = statusFilter.value

  const { data, error, isLoading, reload } = useAdminLinks({
    status,
    userId: filters.userId,
    page,
    size: pageSize,
    q: keyword,
  })

  // Id of the link whose action is running
  const [busyId, setBusyId] = useState(null)

  // Action waiting for confirmation. Kept after closing so the text stays during close animation
  const [confirm, setConfirm] = useState({ open: false, type: null, link: null })

  const runAction = async (type, link) => {
    const action = ACTIONS[type]
    setBusyId(link.id)

    try {
      await action.run(link.id)
      toast.success(action.success(link))
      setConfirm((prev) => ({ ...prev, open: false }))

      // The row leaves the list only when filtered by status. Last row of the last page → go back one page
      const leavesList = status !== 'all'
      if (leavesList && data?.items.length === 1 && page > 1) setPage(page - 1)
      else reload()
    } catch (err) {
      toast.error(err.message)
      // 409 = status changed by someone else, show the latest data
      if (err.status === 409 || err.status === 404) reload()
    } finally {
      setBusyId(null)
    }
  }

  const handleAction = (type, link) => {
    if (ACTIONS[type].confirm) setConfirm({ open: true, type, link })
    else runAction(type, link)
  }

  const showOwner = (link) => setFilters({ userId: String(link.ownerId), owner: link.ownerUsername })
  const clearOwner = () => setFilters({ userId: '', owner: '' })

  const links = data?.items ?? []
  const confirmAction = confirm.type ? ACTIONS[confirm.type].confirm : null
  const isFiltered = !!keyword || !!filters.userId || status !== 'all'

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader title="Links" description="Every short link in the app. Disable links that break the rules." />

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={searchInput}
            onChange={onSearchChange}
            onClear={clearSearch}
            placeholder="Search by short code, URL or owner..."
            aria-label="Search links"
            maxLength={100}
            className="w-full sm:max-w-sm"
          />

          <Select
            value={status}
            onValueChange={(value) => setFilter('status', value)}
            items={STATUS_FILTERS}
          >
            <SelectTrigger className="w-full sm:w-44" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active owner filter, removable */}
        {filters.userId && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Owner:</span>
            <span className="inline-flex items-center gap-1 rounded-md border bg-muted/50 py-0.5 pr-1 pl-2 font-medium">
              {filters.owner || `User #${filters.userId}`}
              <Button variant="ghost" size="icon-xs" onClick={clearOwner} aria-label="Remove owner filter">
                <X />
              </Button>
            </span>
          </div>
        )}
      </div>

      <Card className="py-0">
        <CardContent className="p-0">
          {/* First load: no data yet */}
          {isLoading && !data ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : error && !data ? (
            <div className="flex flex-col items-center gap-3 p-10 text-center">
              <p className="text-sm text-destructive">{error.message}</p>
              <Button variant="outline" size="sm" onClick={reload}>
                <RotateCw />
                Try again
              </Button>
            </div>
          ) : links.length === 0 && data.totalItems > 0 ? (
            // Page number in the url is bigger than total pages
            <div className="flex flex-col items-center gap-3 p-10 text-center">
              <p className="text-sm text-muted-foreground">Page {page} not found.</p>
              <Button variant="outline" size="sm" onClick={() => setPage(1)}>
                Go to first page
              </Button>
            </div>
          ) : links.length === 0 && isFiltered ? (
            <div className="flex flex-col items-center gap-3 p-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <SearchX className="size-5 text-muted-foreground" />
              </div>
              <p className="font-medium">No links match the current filters</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearSearch()
                  setFilters({ status: 'all', userId: '', owner: '' })
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : links.length === 0 ? (
            <div className="flex flex-col items-center gap-3 p-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Link2 className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No links have been created yet</p>
            </div>
          ) : (
            // Dim old data while the next page is loading
            <div className={isLoading ? 'opacity-60 transition-opacity' : undefined}>
              <AdminLinkTable
                links={links}
                startNumber={(page - 1) * pageSize + 1}
                busyId={busyId}
                onAction={handleAction}
                onOwnerClick={showOwner}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {data && data.totalItems > 0 && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          totalItems={data.totalItems}
          onPageChange={setPage}
          pageSize={pageSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onPageSizeChange={setPageSize}
        />
      )}

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={(open) => !open && !busyId && setConfirm((prev) => ({ ...prev, open: false }))}
        title={confirmAction?.title}
        description={confirm.link && confirmAction?.description(confirm.link)}
        confirmLabel={confirmAction?.confirmLabel}
        loadingLabel={confirmAction?.loadingLabel}
        variant={confirmAction?.variant}
        isLoading={!!busyId}
        onConfirm={() => runAction(confirm.type, confirm.link)}
      />
    </div>
  )
}

export default AdminLinks
