import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="text-6xl font-bold">404</p>
      <p className="text-muted-foreground">Page not found.</p>
      <Link to="/" className={buttonVariants({ variant: 'outline' })}>Back to home</Link>
    </div>
  )
}
