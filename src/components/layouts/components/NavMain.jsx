import { NavLink, useLocation } from "react-router"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

/*
* items : { title, url, to, icon, badge }
* url is used to mark the active menu, to (optional) is where the link goes
* */
export function NavMain({ items }) {
  const { pathname } = useLocation()
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton
              tooltip={item.badge ? `${item.title} (${item.badge})` : item.title}
              isActive={pathname === item.url}
              render={<NavLink to={item.to ?? item.url} />}
              // On mobile the sidebar is a sheet, close it after navigating
              onClick={() => isMobile && setOpenMobile(false)}
            >
              <item.icon />
              <span>{item.title}</span>
            </SidebarMenuButton>
            {/* Hidden when the count is 0 */}
            {item.badge > 0 && (
              <SidebarMenuBadge className="bg-primary text-primary-foreground peer-data-active/menu-button:text-primary-foreground">
                {item.badge > 99 ? '99+' : item.badge}
              </SidebarMenuBadge>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
