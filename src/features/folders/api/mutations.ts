import { useFolderStore } from "@/features/drive/store/folder-store";
import { useOrganizationUnitStore } from "@/features/organization-units/store/organization-unit-store";
import { useCurrentUser } from "@/features/auth/api/me-queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createFolder } from "./client";

export const useCreateFolder = () => {
  const { data: currentUser } = useCurrentUser();
  const storeOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.currentOrganizationUnitId,
  );
  const currentOrganizationUnitId = storeOrganizationUnitId ?? currentUser?.currentOrganizationUnitId ?? null;
  const currentParentFolderId = useFolderStore(
    (state) => state.currentParentFolderId,
  );

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFolder,
    onSuccess: (data) => {
      toast.success(data.message);

      if (currentParentFolderId) {
        queryClient.invalidateQueries({
          queryKey: ["folders", "detail", currentParentFolderId, "items"],
        });
        queryClient.invalidateQueries({
          queryKey: ["folders", "detail", currentParentFolderId, "subfolders"],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["organization-units", "detail", currentOrganizationUnitId, "items"],
        });
        queryClient.invalidateQueries({
          queryKey: ["organization-units", "detail", currentOrganizationUnitId, "folders"],
        });
      }

      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
