import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/*
* Colors for each status (user and link)
* pending           : yellow, needs an action from admin
* active            : green
* inactive/disabled : red
* */
const STATUS_STYLES = {
  pending: {
    label: 'Pending',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  active: {
    label: 'Active',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  inactive: {
    label: 'Inactive',
    badge: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300',
    dot: 'bg-red-500',
  },
  disabled: {
    label: 'Disabled',
    badge: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300',
    dot: 'bg-red-500',
  },
}

/*
* Status Badge
*
* Color + text, so the status is still readable without seeing colors
* label (optional) : replace the default text, ex: "Disabled by admin"
* */
function StatusBadge({ status, label }) {
  const style = STATUS_STYLES[status]

  if (!style) {
    return <Badge variant="outline">{status}</Badge>
  }

  return (
    <Badge className={style.badge}>
      <span className={cn('size-1.5 rounded-full', style.dot)} aria-hidden="true" />
      {label ?? style.label}
    </Badge>
  )
}

export default StatusBadge
