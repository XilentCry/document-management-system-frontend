"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { FileUp, Folder, FolderPlus, Plus } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserOrganizationUnitsDialog } from "../shared/user-organization-units-dialog";
import NewFolderDialog from "../shared/new-folder-dialog";

export function UserSidebar() {
  const [openUserOrganizationUnitsDialog, setOpenUserOrganizationUnitsDialog] =
    useState(false);
  const [openNewFolderDialog, setOpenNewFolderDialog] = useState(false);

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
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger render={<Button className="w-full" />}>
                  <Plus />
                  New
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setOpenNewFolderDialog(true)}
                    >
                      <FolderPlus />
                      New Folder
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <FileUp />
                      File upload
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarGroupContent>
          </SidebarGroup>
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

      <NewFolderDialog
        openNewFolderDialog={openNewFolderDialog}
        setOpenNewFolderDialog={setOpenNewFolderDialog}
      />
    </>
  );
}
