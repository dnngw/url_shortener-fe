import { Link } from 'react-router'
import { LayoutDashboard } from 'lucide-react'
import Logo from '@/components/Logo'
import { buttonVariants } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

function Header() {
  const { isLoggedIn, isLoading } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center px-4">
        <Logo />

        <div className="ml-auto flex items-center gap-2">
          {/* Wait until session is known, avoid button flicker */}
          {isLoading ? null : isLoggedIn ? (
            <Link to="/dashboard" className={buttonVariants()}>
              <LayoutDashboard />
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className={buttonVariants({ variant: 'ghost' })}>Login</Link>
              <Link to="/register" className={buttonVariants()}>Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
