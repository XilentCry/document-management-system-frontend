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
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUploadDialogStore } from "@/stores/upload-dialog-store";
import { useUserStore } from "@/stores/user-store";
import { Building, FileUp, FolderPlus, Plus, UsersRound } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FileUploadDialog } from "../shared/file-upload-dialog";
import NewFolderDialog from "../shared/new-folder-dialog";
import { UserOrganizationUnitsDialog } from "../shared/user-organization-units-dialog";

export function UserSidebar() {
  const [openUserOrganizationUnitsDialog, setOpenUserOrganizationUnitsDialog] =
    useState(false);
  const [openNewFolderDialog, setOpenNewFolderDialog] = useState(false);
  const setIsOpen = useUploadDialogStore((state) => state.setIsOpen);

  const pathname = usePathname();
  const router = useRouter();

  const lastLogin = useUserStore((state) => state.lastLogin);
  const lastFailedLogin = useUserStore((state) => state.lastFailedLogin);

  return (
    <>
      <Sidebar collapsible="none" className="sticky top-0 border-r">
        <SidebarHeader className="h-14 flex flex-row items-center border-b">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center gap-2">
                <Image src="/norsu.png" alt="NORSU" width={32} height={32} />
                <span className="text-2xl font-bold">DMS</span>
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
                    <DropdownMenuItem
                      onClick={() => setIsOpen(true)}
                    >
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
                      pathname.startsWith("/drive/organizational-drive") ||
                      pathname.startsWith("/drive/folders")
                    }
                    onClick={() => setOpenUserOrganizationUnitsDialog(true)}
                  >
                    <Building />
                    Organizational Drive
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pathname.startsWith("/drive/shared-with-me")}
                    onClick={() => router.push("/drive/shared-with-me")}
                  >
                    <UsersRound />
                    Shared with me
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem className="flex flex-col gap-2 text-sm">
              <div>
                <p className="font-medium">Last login</p>
                {lastLogin && (
                  <span>{lastLogin}</span>
                )}
              </div>
              <div>
                <p className="font-medium">Last failed login</p>
                {lastFailedLogin && (
                  <span>
                    {lastFailedLogin}
                  </span>
                )}
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <UserOrganizationUnitsDialog
        openUserOrganizationUnitsDialog={openUserOrganizationUnitsDialog}
        setOpenUserOrganizationUnitsDialog={
          setOpenUserOrganizationUnitsDialog
        }
      />

      <NewFolderDialog
        openNewFolderDialog={openNewFolderDialog}
        setOpenNewFolderDialog={setOpenNewFolderDialog}
      />

      <FileUploadDialog />
    </>
  );
}
