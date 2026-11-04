import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/*
* Pagination : rows per page + page info + previous / next
*
* Always shown, buttons are disabled when there is no other page
* itemLabel : [singular, plural] used in the total text, ex: ['user', 'users']
* */
function Pagination({
  page,
  totalPages,
  totalItems,
  onPageChange,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  itemLabel = ['link', 'links'],
}) {
  // Backend returns totalPages = 0 when there is no data
  const lastPage = Math.max(totalPages, 1)

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Rows per page</span>
        <Select value={pageSize} onValueChange={onPageSizeChange}>
          <SelectTrigger size="sm" aria-label="Rows per page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <p className="text-sm text-muted-foreground">
          Page {page} of {lastPage} · {totalItems} {totalItems === 1 ? itemLabel[0] : itemLabel[1]}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= lastPage}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Pagination
