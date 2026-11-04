import { Ban, CircleCheck, ExternalLink, MoreHorizontal } from 'lucide-react'
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
* Admin Link Table
*
* Read only for the link data, admin can only disable / enable a link
* startNumber : number of the first row, continues across pages
* busyId      : id of the link whose action is running, disables that row menu
* onAction(type, link) → type : 'disable' | 'enable'
* onOwnerClick(link)   → show only the links of this owner
* */
function AdminLinkTable({ links, startNumber = 1, busyId, onAction, onOwnerClick }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12 text-center">No</TableHead>
          <TableHead>Short link</TableHead>
          <TableHead>Destination URL</TableHead>
          <TableHead className="w-32">Owner</TableHead>
          <TableHead className="w-28">Status</TableHead>
          <TableHead className="hidden w-48 lg:table-cell">Created</TableHead>
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
                  <a href={shortUrl} target="_blank" rel="noreferrer" className="font-medium hover:underline">
                    /{link.shortCode}
                  </a>
                  <CopyButton text={shortUrl} />
                </div>
              </TableCell>
              <TableCell className="max-w-48 md:max-w-72">
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
              <TableCell>
                <button
                  type="button"
                  onClick={() => onOwnerClick(link)}
                  title={`Show links of ${link.ownerUsername}`}
                  className="max-w-full truncate text-left hover:underline"
                >
                  {link.ownerUsername}
                </button>
              </TableCell>
              <TableCell>
                <StatusBadge status={link.disabled ? 'disabled' : 'active'} />
              </TableCell>
              <TableCell className="hidden text-muted-foreground lg:table-cell">
                {formatDate(link.createdAt)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={busyId === link.id}
                        aria-label={`Actions for /${link.shortCode}`}
                      />
                    }
                  >
                    <MoreHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-40">
                    <DropdownMenuItem onClick={() => window.open(link.originalUrl, '_blank', 'noreferrer')}>
                      <ExternalLink />
                      Open destination
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {link.disabled ? (
                      <DropdownMenuItem onClick={() => onAction('enable', link)}>
                        <CircleCheck />
                        Enable
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem variant="destructive" onClick={() => onAction('disable', link)}>
                        <Ban />
                        Disable
                      </DropdownMenuItem>
                    )}
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

export default AdminLinkTable
