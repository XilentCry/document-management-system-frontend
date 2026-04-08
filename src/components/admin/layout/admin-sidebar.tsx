"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Activity, Building2, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="none" className="sticky top-0 border-r">
      <SidebarHeader className="h-14 flex flex-row items-center border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2">
              <Image src="/norsu.png" alt="NORSU" width={32} height={32} />
              <div>
                <div className="flex flex-col">
                  <span className="font-medium">DMS</span>
                  <span className="text-xs">Negros Oriental State University</span>
                </div>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname.startsWith("/admin/user-management")}
                  render={<Link href="/admin/user-management" />}
                >
                  <UsersRound />
                  User Management
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname.startsWith("/admin/organization-units")}
                  render={<Link href="/admin/organization-units" />}
                >
                  <Building2 />
                  Organization Units
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname.startsWith("/admin/audit-logs")}
                  render={<Link href="/admin/audit-logs" />}
                >
                  <Activity />
                  Audit Logs
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
