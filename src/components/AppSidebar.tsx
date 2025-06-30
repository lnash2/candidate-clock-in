
import React from 'react';
import { Building2, Users, MessageSquare, DollarSign, Calendar, BarChart3, UserCheck, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AppSidebar = ({ activeSection, onSectionChange }: AppSidebarProps) => {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'candidates', label: 'Candidates', icon: UserCheck },
    { id: 'communications', label: 'Communications', icon: MessageSquare },
    { id: 'rates', label: 'Rates', icon: DollarSign },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-3">
        <div className="flex items-center space-x-2">
          <Building2 className="w-6 h-6 text-primary" />
          {!isCollapsed && <span className="font-bold text-lg">CRM</span>}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-2">
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-6 w-6 p-0 hover:bg-gray-100 transition-colors"
              title={isCollapsed ? "Expand navigation" : "Collapse navigation"}
            >
              <Menu className="h-3 w-3" />
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.id)}
                    isActive={activeSection === item.id}
                    className="w-full justify-start"
                    tooltip={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className="w-4 h-4" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
