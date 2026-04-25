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
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/services/user/queries";
import { useUploadDialogStore } from "@/stores/upload-dialog-store";
import { Building, FileSignature, FileUp, FolderPlus, Plus, Send, Trash2, UsersRound } from "lucide-react";
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

  const { data: currentUser, isLoading } = useCurrentUser();
  const lastLogin = currentUser?.lastLogin;
  const lastFailedLogin = currentUser?.lastFailedLogin;

  return (
    <>
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
                    isActive={pathname.startsWith("/drive/signings")}
                    onClick={() => router.push("/drive/signings")}
                  >
                    <FileSignature />
                    My Signings
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pathname.startsWith("/drive/submissions")}
                    onClick={() => router.push("/drive/submissions")}
                  >
                    <Send />
                    My Submissions
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
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pathname.startsWith("/drive/trash")}
                    onClick={() => router.push("/drive/trash")}
                  >
                    <Trash2 />
                    Trash
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
                {isLoading ? (
                  <Skeleton className="h-4 w-1/2 mt-1" />
                ) : lastLogin ? (
                  <span>{lastLogin}</span>
                ) : null}
              </div>
              <div>
                <p className="font-medium">Last failed login</p>
                {isLoading ? (
                  <Skeleton className="h-4 w-1/2 mt-1" />
                ) : lastFailedLogin ? (
                  <span>
                    {lastFailedLogin}
                  </span>
                ) : null}
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
