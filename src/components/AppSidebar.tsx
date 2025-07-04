import { BarChart3, FileText, Users, Calendar, Euro, Home } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Campañas de Prensa", url: "/campanas", icon: Calendar },
  { title: "Contabilidad", url: "/contabilidad", icon: BarChart3 },
  { title: "Facturación", url: "/facturacion", icon: FileText },
  { title: "Clientes", url: "/clientes", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-gradient-primary text-primary-foreground font-medium shadow-elegant" 
      : "hover:bg-accent/50 text-foreground";

  return (
    <Sidebar
      className="bg-gradient-card border-r shadow-card"
      collapsible="icon"
    >
      <SidebarContent className="p-2">
        <div className="mb-6 p-4">
          {!isCollapsed && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                Wololo Sound
              </h2>
              <p className="text-sm text-muted-foreground">Gestión Contable</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "hidden" : ""}>
            Navegación Principal
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={`${getNavCls({ isActive: isActive(item.url) })} 
                        rounded-lg p-3 transition-all duration-200 hover:shadow-card`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="ml-3 font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Submenu for Contabilidad */}
        {currentPath.startsWith("/contabilidad") && !isCollapsed && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel>Cuentas</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to="/contabilidad/cuenta-sl"
                      className={`${getNavCls({ isActive: currentPath === "/contabilidad/cuenta-sl" })} 
                        rounded-lg p-2 text-sm transition-all duration-200`}
                    >
                      <Euro className="h-4 w-4 flex-shrink-0" />
                      <span className="ml-2">Cuenta SL</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to="/contabilidad/cuenta-paypal"
                      className={`${getNavCls({ isActive: currentPath === "/contabilidad/cuenta-paypal" })} 
                        rounded-lg p-2 text-sm transition-all duration-200`}
                    >
                      <Euro className="h-4 w-4 flex-shrink-0" />
                      <span className="ml-2">Cuenta Paypal</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}