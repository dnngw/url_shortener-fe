import { Link } from 'react-router'
import { Check, MoreHorizontal, Power, PowerOff, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import StatusBadge from '@/components/StatusBadge'
import { formatDate } from '@/lib/format'

/*
* Actions available for each status, shown in the row menu
* */
const ACTIONS_BY_STATUS = {
  pending: [
    { type: 'approve', label: 'Approve', icon: Check },
    { type: 'reject', label: 'Reject', icon: X, destructive: true },
  ],
  active: [
    { type: 'deactivate', label: 'Deactivate', icon: PowerOff, destructive: true },
  ],
  inactive: [
    { type: 'activate', label: 'Activate', icon: Power },
  ],
}

/*
* User Table
*
* startNumber : number of the first row, continues across pages
* busyId      : id of the user whose action is running, disables that row menu
* onAction(type, user) → type : 'approve' | 'reject' | 'deactivate' | 'activate'
* */
function UserTable({ users, startNumber = 1, busyId, onAction }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {/* Fixed widths, the remaining space goes to the username column */}
          <TableHead className="w-12 text-center">No</TableHead>
          <TableHead>Username</TableHead>
          <TableHead className="w-28">Status</TableHead>
          <TableHead className="w-28 text-center">Total links</TableHead>
          <TableHead className="hidden w-48 sm:table-cell">Registered</TableHead>
          <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => {
          const actions = ACTIONS_BY_STATUS[user.status] ?? []

          return (
            <TableRow key={user.id}>
              <TableCell className="text-center tabular-nums text-muted-foreground">
                {startNumber + index}
              </TableCell>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>
                <StatusBadge status={user.status} />
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {/* Pending users cannot login yet, so they never have links */}
                {user.status === 'pending' ? (
                  <span className="text-muted-foreground" aria-label="Not available">–</span>
                ) : user.linkCount > 0 ? (
                  // Open the admin link list filtered by this user
                  <Link
                    to={`/admin/links?userId=${user.id}&owner=${encodeURIComponent(user.username)}`}
                    className="underline-offset-4 hover:underline"
                    title={`Show links of ${user.username}`}
                  >
                    {user.linkCount}
                  </Link>
                ) : (
                  0
                )}
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {formatDate(user.createdAt)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={busyId === user.id}
                        aria-label={`Actions for ${user.username}`}
                      />
                    }
                  >
                    <MoreHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-40">
                    {actions.map((action) => (
                      <DropdownMenuItem
                        key={action.type}
                        variant={action.destructive ? 'destructive' : 'default'}
                        onClick={() => onAction(action.type, user)}
                      >
                        <action.icon />
                        {action.label}
                      </DropdownMenuItem>
                    ))}
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

export default UserTable
