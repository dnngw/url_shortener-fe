import { Link } from 'react-router'
import { ArrowRight, Link2, QrCode, UserCheck, UserPlus, UserX } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import CopyButton from '@/components/CopyButton'
import PageHeader from '@/components/PageHeader'
import StatusBadge from '@/components/StatusBadge'
import { useAdminStats } from '@/hooks/useAdminStats'
import { useAuth } from '@/hooks/useAuth'
import { useLinks } from '@/hooks/useLinks'
import { usePendingCount } from '@/hooks/usePendingCount'
import { displayUrl, formatDate, getShortUrl } from '@/lib/format'

const RECENT_SIZE = 5

/*
* Dashboard for role user : summary + recent links
* */
function UserDashboard({ name }) {
  // totalItems from the first page is enough for the summary
  const { data, error, isLoading } = useLinks({ page: 1, size: RECENT_SIZE })
  const recentLinks = data?.items ?? []

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader title={`Hello, ${name}`} description="An overview of your short links." />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Total links</CardDescription>
            <CardTitle className="text-3xl tabular-nums">
              {isLoading ? <Skeleton className="h-9 w-16" /> : data?.totalItems ?? '-'}
            </CardTitle>
            <CardAction>
              <Link2 className="size-5 text-muted-foreground" />
            </CardAction>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Need a QR code?</CardDescription>
            <CardTitle>QR Generator</CardTitle>
            <CardAction>
              <QrCode className="size-5 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <Link to="/qr" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              Generate QR code
              <ArrowRight />
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent links</CardTitle>
          <CardDescription>The last {RECENT_SIZE} links you created.</CardDescription>
          <CardAction>
            <Link to="/links" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
              View all
              <ArrowRight />
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">{error.message}</p>
          ) : recentLinks.length === 0 ? (
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-muted-foreground">You don't have any links yet.</p>
              <Link to="/links" className={buttonVariants({ size: 'sm' })}>Create your first link</Link>
            </div>
          ) : (
            <ul className="divide-y">
              {recentLinks.map((link) => {
                const shortUrl = getShortUrl(link.shortCode)
                return (
                  <li key={link.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <a href={shortUrl} target="_blank" rel="noreferrer" className="font-medium hover:underline">
                          /{link.shortCode}
                        </a>
                        {link.disabled && <StatusBadge status="disabled" label="Disabled by admin" />}
                      </div>
                      <p className="truncate text-sm text-muted-foreground" title={link.originalUrl}>
                        {displayUrl(link.originalUrl)}
                      </p>
                    </div>
                    <span className="hidden text-sm text-muted-foreground sm:block">{formatDate(link.createdAt)}</span>
                    <CopyButton text={shortUrl} />
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/*
* Dashboard for role admin : users per status and total links
* */
function AdminDashboard({ name }) {
  // Pending comes from the shared counter, so it matches the sidebar badge
  const { count: pendingCount } = usePendingCount()
  const { data: stats, isLoading } = useAdminStats()

  // null = still loading (skeleton), '-' = request failed
  const statValue = (key) => (isLoading ? null : stats?.[key] ?? '-')

  const cards = [
    {
      label: 'Waiting for approval',
      value: pendingCount,
      icon: UserPlus,
      to: '/admin/users?status=pending',
      highlight: pendingCount > 0,
    },
    {
      label: 'Active users',
      value: statValue('activeUsers'),
      icon: UserCheck,
      to: '/admin/users?status=active',
    },
    {
      label: 'Inactive users',
      value: statValue('inactiveUsers'),
      icon: UserX,
      to: '/admin/users?status=inactive',
    },
    {
      label: 'Total links',
      value: statValue('totalLinks'),
      icon: Link2,
      to: '/admin/links',
    },
  ]

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader title={`Hello, ${name}`} description="Overview of user accounts and links." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const content = (
            <Card className={card.highlight ? 'h-full ring-2 ring-primary' : 'h-full'}>
              <CardHeader>
                <CardDescription>{card.label}</CardDescription>
                <CardTitle className="text-3xl tabular-nums">
                  {card.value === null ? <Skeleton className="h-9 w-16" /> : card.value}
                </CardTitle>
                <CardAction>
                  <card.icon className="size-5 text-muted-foreground" />
                </CardAction>
              </CardHeader>
            </Card>
          )

          return card.to ? (
            <Link key={card.label} to={card.to} className="rounded-xl transition-shadow hover:shadow-md">
              {content}
            </Link>
          ) : (
            <div key={card.label}>{content}</div>
          )
        })}
      </div>

      {pendingCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>New registrations</CardTitle>
            <CardDescription>
              {pendingCount} {pendingCount === 1 ? 'user is' : 'users are'} waiting for your approval.
            </CardDescription>
            <CardAction>
              <Link to="/admin/users?status=pending" className={buttonVariants({ size: 'sm' })}>
                Review
                <ArrowRight />
              </Link>
            </CardAction>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}

export default function DashboardHome() {
  const { user } = useAuth()
  const name = user.username ?? `User #${user.id}`

  return user.role === 'admin' ? <AdminDashboard name={name} /> : <UserDashboard name={name} />
}
