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
import { UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="none" className="sticky top-0">
      <SidebarHeader className="h-14 flex flex-row items-center border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="NORSU" width={32} height={32} />
              <span className="font-semibold">NORSU DMS</span>
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
                >
                  <Link href="/admin/user-management">
                    <UsersRound />
                    User Management
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
