import { Link } from "react-router"
import { LayoutDashboard, Link2, QrCode, Users } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "./NavMain"
import { NavUser } from "./NavUser"
import { useAuth } from "@/hooks/useAuth"
import logo from "@/assets/logo-url-shortener-128.png"
import { usePendingCount } from "@/hooks/usePendingCount"

/*
* Sidebar menu
*
* roles : which role can see the menu
* badge : key of a counter shown next to the menu (ex: pending registrations)
* */
const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, roles: ["user", "admin"] },
  { title: "My Links", url: "/links", icon: Link2, roles: ["user"] },
  { title: "QR Generator", url: "/qr", icon: QrCode, roles: ["user"] },
  { title: "Users", url: "/admin/users", icon: Users, roles: ["admin"], badge: "pending" },
  { title: "Links", url: "/admin/links", icon: Link2, roles: ["admin"] },
]

export function AppSidebar(props) {
  const { user } = useAuth()
  const { count: pendingCount } = usePendingCount()

  const badges = { pending: pendingCount }
  const visibleMenu = menuItems
    .filter((item) => item.roles.includes(user.role))
    .map((item) => ({
      ...item,
      badge: badges[item.badge],
      // Open Users filtered by pending when someone is waiting for approval
      to: item.badge === 'pending' && pendingCount > 0 ? `${item.url}?status=pending` : item.url,
    }))

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/" />}>
              {/* App logo, keeps its own colors (no tile behind it) */}
              <img src={logo} alt="" className="size-8 shrink-0" />
              <span className="truncate font-semibold">Url Shortener</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={visibleMenu} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
