import { ExternalLink, MoreHorizontal, Pencil, QrCode, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import CopyButton from '@/components/CopyButton'
import StatusBadge from '@/components/StatusBadge'
import { displayUrl, formatDate, getShortUrl } from '@/lib/format'

/*
* Link Table
*
* startNumber : number of the first row, continues across pages (page 2 starts at 11)
* onAction(type, link) → type : 'qr' | 'edit' | 'delete'
* */
function LinkTable({ links, startNumber = 1, onAction }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12 text-center">No</TableHead>
          <TableHead>Short link</TableHead>
          <TableHead>Destination URL</TableHead>
          <TableHead className="hidden md:table-cell">Created</TableHead>
          <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {links.map((link, index) => {
          const shortUrl = getShortUrl(link.shortCode)

          return (
            <TableRow key={link.id}>
              <TableCell className="text-center tabular-nums text-muted-foreground">
                {startNumber + index}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium hover:underline"
                  >
                    /{link.shortCode}
                  </a>
                  <CopyButton text={shortUrl} />
                  {/* Disabled by admin, the short code returns 410 instead of redirecting */}
                  {link.disabled && <StatusBadge status="disabled" label="Disabled by admin" />}
                </div>
              </TableCell>
              <TableCell className="max-w-48 md:max-w-80">
                <a
                  href={link.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  title={link.originalUrl}
                  className="block truncate text-muted-foreground hover:underline"
                >
                  {displayUrl(link.originalUrl)}
                </a>
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {formatDate(link.createdAt)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="ghost" size="icon-sm" aria-label="Actions" />}
                  >
                    <MoreHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-40">
                    <DropdownMenuItem onClick={() => window.open(shortUrl, '_blank', 'noreferrer')}>
                      <ExternalLink />
                      Open
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction('qr', link)}>
                      <QrCode />
                      QR code
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction('edit', link)}>
                      <Pencil />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => onAction('delete', link)}>
                      <Trash2 />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default LinkTable
