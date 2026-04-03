"use client";

import { logout } from "@/services/auth/api";
import { useFolderStore } from "@/stores/folder-store";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useRailStore } from "@/stores/rail-store";
import { useSearchStore } from "@/stores/search-store";
import { useUploadDialogStore } from "@/stores/upload-dialog-store";
import { useUploadStore } from "@/stores/upload-store";
import { useUserStore } from "@/stores/user-store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const resetUser = useUserStore((s) => s.reset);
  const resetRail = useRailStore((s) => s.reset);
  const resetFolder = useFolderStore((s) => s.reset);
  const resetOrgUnit = useOrganizationUnitStore((s) => s.reset);
  const resetSearch = useSearchStore((s) => s.reset);
  const resetUploadDialog = useUploadDialogStore((s) => s.reset);
  const resetUpload = useUploadStore((s) => s.reset);

  const handleLogout = async () => {
    try {
      const data = await logout();

      toast.success(data.message);
      queryClient.clear();

      resetUser();
      resetRail();
      resetFolder();
      resetOrgUnit();
      resetSearch();
      resetUploadDialog();
      resetUpload();

      router.replace("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <DropdownMenuItem variant="destructive" onClick={handleLogout}>Log out</DropdownMenuItem>
  );
}
