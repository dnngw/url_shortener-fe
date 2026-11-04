import { useState } from 'react'
import { Link2, Plus, RotateCw, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import PageHeader from '@/components/PageHeader'
import Pagination from '@/components/Pagination'
import SearchInput from '@/components/SearchInput'
import { useLinks } from '@/hooks/useLinks'
import { useListParams } from '@/hooks/useListParams'
import LinkTable from './components/LinkTable'
import LinkFormDialog from './components/LinkFormDialog'
import DeleteLinkDialog from './components/DeleteLinkDialog'
import QrLinkDialog from './components/QrLinkDialog'

const PAGE_SIZE_OPTIONS = [10, 25, 50]

function Links() {
  // Page, size and search are kept in the url (?q=promo&page=2&size=25)
  const {
    page,
    pageSize,
    keyword,
    searchInput,
    onSearchChange,
    clearSearch,
    setPage,
    setPageSize,
  } = useListParams({ pageSizeOptions: PAGE_SIZE_OPTIONS })

  const { data, error, isLoading, reload } = useLinks({ page, size: pageSize, q: keyword })

  // Which dialog is open. "link" is kept after closing so the content stays during close animation
  const [dialog, setDialog] = useState({ type: null, link: null })
  const openDialog = (type, link = null) => setDialog({ type, link })
  const closeDialog = () => setDialog((prev) => ({ ...prev, type: null }))

  const handleCreated = () => {
    closeDialog()
    // New link appears on the first page (newest first).
    // Clear the search too, the new link may not match the keyword
    if (page === 1 && !keyword) reload()
    else clearSearch()
  }

  const handleUpdated = () => {
    closeDialog()
    reload()
  }

  const handleDeleted = () => {
    closeDialog()
    // Last item on the last page was deleted → go back one page
    if (data?.items.length === 1 && page > 1) setPage(page - 1)
    else reload()
  }

  const links = data?.items ?? []

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader
        title="My Links"
        description="Manage all of your short links."
        action={
          <Button onClick={() => openDialog('create')}>
            <Plus />
            Create link
          </Button>
        }
      />

      <SearchInput
        value={searchInput}
        onChange={onSearchChange}
        onClear={clearSearch}
        placeholder="Search by short code or URL..."
        aria-label="Search links"
        maxLength={100}
        className="w-full sm:max-w-sm"
      />

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
          ) : links.length === 0 && keyword ? (
            // Search has no result
            <div className="flex flex-col items-center gap-3 p-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <SearchX className="size-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">No links match "{keyword}"</p>
                <p className="text-sm text-muted-foreground">Try another short code or URL.</p>
              </div>
              <Button variant="outline" size="sm" onClick={clearSearch}>
                Clear search
              </Button>
            </div>
          ) : links.length === 0 ? (
            <div className="flex flex-col items-center gap-3 p-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Link2 className="size-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">No links yet</p>
                <p className="text-sm text-muted-foreground">Create your first short link now.</p>
              </div>
              <Button size="sm" onClick={() => openDialog('create')}>
                <Plus />
                Create link
              </Button>
            </div>
          ) : (
            // Dim old data while the next page is loading
            <div className={isLoading ? 'opacity-60 transition-opacity' : undefined}>
              <LinkTable links={links} startNumber={(page - 1) * pageSize + 1} onAction={openDialog} />
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

      <LinkFormDialog
        open={dialog.type === 'create' || dialog.type === 'edit'}
        onOpenChange={(open) => !open && closeDialog()}
        // 'create' opens with link = null, so this stays correct while closing
        link={dialog.link}
        onSuccess={dialog.link ? handleUpdated : handleCreated}
      />
      <DeleteLinkDialog
        open={dialog.type === 'delete'}
        onOpenChange={(open) => !open && closeDialog()}
        link={dialog.link}
        onSuccess={handleDeleted}
      />
      <QrLinkDialog
        open={dialog.type === 'qr'}
        onOpenChange={(open) => !open && closeDialog()}
        link={dialog.link}
      />
    </div>
  )
}

export default Links
