import { Outlet } from 'react-router'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from '@/components/layouts/components/AppSidebar'
import PendingCountProvider from '@/providers/PendingCountProvider'

function DashboardLayout() {
  return (
    <TooltipProvider>
      {/* Pending registrations, used by the sidebar badge and admin pages */}
      <PendingCountProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            {/* Plain header, profile lives at the bottom of the sidebar */}
            <header className="flex h-14 shrink-0 items-center border-b px-4">
              <SidebarTrigger className="-ml-1" />
            </header>
            <div className="flex-1 p-4 md:p-6">
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </PendingCountProvider>
    </TooltipProvider>
  )
}

export default DashboardLayout
