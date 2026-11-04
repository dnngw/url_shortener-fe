import { Link, useSearchParams } from 'react-router'
import { Ban, Link2Off, RotateCw, TriangleAlert } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/*
* Content for each reason sent by the backend (?reason=...&code=...)
* */
const REASONS = {
  'not-found': {
    icon: Link2Off,
    title: 'Link not found',
    message: (code) => (
      <>The short link <Code>{code}</Code> does not exist. Check the address and try again.</>
    ),
  },
  disabled: {
    icon: Ban,
    title: 'This link has been disabled',
    message: (code) => (
      <>The short link <Code>{code}</Code> is no longer available.</>
    ),
  },
  error: {
    icon: TriangleAlert,
    title: 'Something went wrong',
    message: (code) => (
      <>We could not open <Code>{code}</Code> right now. Please try again in a moment.</>
    ),
    retry: true,
  },
}

// Short code in the url can be anything, keep the page readable
const MAX_CODE_LENGTH = 50

function Code({ children }) {
  return <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">{children}</span>
}

/*
* Link Unavailable
*
* The backend redirects browsers here when a short link can not be opened
* */
export default function LinkUnavailable() {
  const [searchParams] = useSearchParams()
  const reason = REASONS[searchParams.get('reason')] ?? REASONS['not-found']

  const rawCode = searchParams.get('code') ?? ''
  const code = rawCode.length > MAX_CODE_LENGTH ? `${rawCode.slice(0, MAX_CODE_LENGTH)}…` : rawCode

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-24 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <reason.icon className="size-6 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{reason.title}</h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          {reason.message(code ? `/${code}` : 'you opened')}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {/* Plain <a>, the short link is served by the backend, not by the React router */}
        {reason.retry && rawCode && (
          <a href={`/${encodeURIComponent(rawCode)}`} className={buttonVariants({ variant: 'outline' })}>
            <RotateCw />
            Try again
          </a>
        )}
        <Link to="/" className={cn(buttonVariants())}>Go to homepage</Link>
      </div>
    </div>
  )
}
