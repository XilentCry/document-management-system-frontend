import Link from "next/link";
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

export default function AdminSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader className="h-14 flex flex-row items-center">
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
                  render={
                    <Link href="/admin/user-management">
                      <UsersRound />
                      <span>User Management</span>
                    </Link>
                  }
                ></SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
