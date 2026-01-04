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
import { Folder } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserOrganizationUnitsDialog } from "../user-organization-units-dialog";

export function UserSidebar() {
  const [openUserOrganizationUnitsDialog, setOpenUserOrganizationUnitsDialog] =
    useState(false);

  const pathname = usePathname();

  return (
    <>
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
                    isActive={
                      pathname.startsWith("/drive/department-drive") ||
                      pathname.startsWith("/drive/folders")
                    }
                    onClick={() => setOpenUserOrganizationUnitsDialog(true)}
                  >
                    <Folder />
                    <span>Department Drive</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <UserOrganizationUnitsDialog
        openUserOrganizationUnitsDialog={openUserOrganizationUnitsDialog}
        setOpenUserOrganizationUnitsDialog={setOpenUserOrganizationUnitsDialog}
      />
    </>
  );
}
