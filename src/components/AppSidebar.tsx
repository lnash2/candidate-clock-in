
import { Home, Building2, Users, UserCheck, Calendar, MessageSquare, Calculator, Settings, Database } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Overview",
    icon: Home,
    id: "overview",
  },
  {
    title: "Companies",
    icon: Building2,
    id: "companies",
  },
  {
    title: "Contacts",
    icon: Users,
    id: "contacts",
  },
  {
    title: "Candidates", 
    icon: UserCheck,
    id: "candidates",
  },
  {
    title: "Bookings",
    icon: Calendar,
    id: "bookings",
  },
  {
    title: "Communications",
    icon: MessageSquare,
    id: "communications",
  },
  {
    title: "Rate Management",
    icon: Calculator,
    id: "rates",
  },
]

const systemItems = [
  {
    title: "Database Setup",
    icon: Database,
    id: "setup",
  },
  {
    title: "Settings",
    icon: Settings,
    id: "settings",
  },
]

interface AppSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function AppSidebar({ activeView, onViewChange }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recruitment CRM</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild
                    isActive={activeView === item.id}
                    onClick={() => onViewChange(item.id)}
                  >
                    <button className="w-full">
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild
                    isActive={activeView === item.id}
                    onClick={() => onViewChange(item.id)}
                  >
                    <button className="w-full">
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
