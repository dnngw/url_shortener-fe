import { useState } from 'react'
import { RotateCw, SearchX, Users as UsersIcon } from 'lucide-react'
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
import { useAdminUsers } from '@/hooks/useAdminUsers'
import { useListParams } from '@/hooks/useListParams'
import { usePendingCount } from '@/hooks/usePendingCount'
import { adminService } from '@/services/adminService'
import UserTable from './components/UserTable'

const PAGE_SIZE_OPTIONS = [10, 25, 50]

const STATUS_FILTERS = [
  { value: 'all', label: 'All statuses', empty: 'No users yet' },
  { value: 'pending', label: 'Pending', empty: 'No registrations waiting for approval' },
  { value: 'active', label: 'Active', empty: 'No active users' },
  { value: 'inactive', label: 'Inactive', empty: 'No inactive users' },
]

/*
* Admin actions
*
* confirm : shown in a dialog before running, null = run directly
* */
const ACTIONS = {
  approve: {
    run: adminService.approve,
    success: (user) => `${user.username} approved`,
    confirm: null,
  },
  reject: {
    run: adminService.reject,
    success: (user) => `Registration of ${user.username} rejected`,
    confirm: {
      title: 'Reject this registration?',
      description: (user) =>
        `The account "${user.username}" will be deleted. They can register again with the same username.`,
      confirmLabel: 'Reject',
      loadingLabel: 'Rejecting...',
      variant: 'destructive',
    },
  },
  deactivate: {
    run: adminService.deactivate,
    success: (user) => `${user.username} deactivated`,
    confirm: {
      title: 'Deactivate this user?',
      description: (user) =>
        `"${user.username}" will not be able to log in or create links. ` +
        'An open session ends within 15 minutes. Existing short links keep working.',
      confirmLabel: 'Deactivate',
      loadingLabel: 'Deactivating...',
      variant: 'destructive',
    },
  },
  activate: {
    run: adminService.activate,
    success: (user) => `${user.username} activated`,
    confirm: null,
  },
}

function AdminUsers() {
  // Status filter, page, size and search are kept in the url (?status=active&q=bob&page=2)
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
  } = useListParams({ pageSizeOptions: PAGE_SIZE_OPTIONS, filters: { status: 'all' } })

  // Unknown status in the url falls back to "all"
  const statusFilter = STATUS_FILTERS.find((f) => f.value === filters.status) ?? STATUS_FILTERS[0]
  const status = statusFilter.value

  const { data, error, isLoading, reload } = useAdminUsers({ status, page, size: pageSize, q: keyword })
  const { count: pendingCount, refresh: refreshPendingCount } = usePendingCount()

  // Id of the user whose action is running
  const [busyId, setBusyId] = useState(null)

  // Action waiting for confirmation. Kept after closing so the text stays during close animation
  const [confirm, setConfirm] = useState({ open: false, type: null, user: null })

  const runAction = async (type, user) => {
    const action = ACTIONS[type]
    setBusyId(user.id)

    try {
      await action.run(user.id)
      toast.success(action.success(user))
      setConfirm((prev) => ({ ...prev, open: false }))

      // The row leaves the list when the user is deleted (reject) or no longer matches the status filter.
      // Last row of the last page → go back one page
      const leavesList = type === 'reject' || status !== 'all'
      if (leavesList && data?.items.length === 1 && page > 1) setPage(page - 1)
      else reload()
    } catch (err) {
      toast.error(err.message)
      // 409 = status changed by someone else, show the latest data
      if (err.status === 409 || err.status === 404) reload()
    } finally {
      setBusyId(null)
      refreshPendingCount()
    }
  }

  const handleAction = (type, user) => {
    if (ACTIONS[type].confirm) setConfirm({ open: true, type, user })
    else runAction(type, user)
  }

  const users = data?.items ?? []
  const confirmAction = confirm.type ? ACTIONS[confirm.type].confirm : null

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader title="Users" description="Approve new registrations and manage user accounts." />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={searchInput}
          onChange={onSearchChange}
          onClear={clearSearch}
          placeholder="Search by username..."
          aria-label="Search users"
          maxLength={100}
          className="w-full sm:max-w-xs"
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
                {f.value === 'pending' && pendingCount > 0 && (
                  <span className="ml-auto rounded-md bg-amber-100 px-1.5 text-xs text-amber-800 tabular-nums dark:bg-amber-500/15 dark:text-amber-300">
                    {pendingCount}
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          ) : users.length === 0 && data.totalItems > 0 ? (
            // Page number in the url is bigger than total pages
            <div className="flex flex-col items-center gap-3 p-10 text-center">
              <p className="text-sm text-muted-foreground">Page {page} not found.</p>
              <Button variant="outline" size="sm" onClick={() => setPage(1)}>
                Go to first page
              </Button>
            </div>
          ) : users.length === 0 && keyword ? (
            <div className="flex flex-col items-center gap-3 p-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <SearchX className="size-5 text-muted-foreground" />
              </div>
              <p className="font-medium">No users match "{keyword}"</p>
              <Button variant="outline" size="sm" onClick={clearSearch}>
                Clear search
              </Button>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center gap-3 p-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <UsersIcon className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">{statusFilter.empty}</p>
            </div>
          ) : (
            // Dim old data while the next page is loading
            <div className={isLoading ? 'opacity-60 transition-opacity' : undefined}>
              <UserTable
                users={users}
                startNumber={(page - 1) * pageSize + 1}
                busyId={busyId}
                onAction={handleAction}
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
          itemLabel={['user', 'users']}
        />
      )}

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={(open) => !open && !busyId && setConfirm((prev) => ({ ...prev, open: false }))}
        title={confirmAction?.title}
        description={confirm.user && confirmAction?.description(confirm.user)}
        confirmLabel={confirmAction?.confirmLabel}
        loadingLabel={confirmAction?.loadingLabel}
        variant={confirmAction?.variant}
        isLoading={!!busyId}
        onConfirm={() => runAction(confirm.type, confirm.user)}
      />
    </div>
  )
}

export default AdminUsers
