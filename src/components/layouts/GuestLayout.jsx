import { Outlet } from 'react-router'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

function GuestLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default GuestLayout
