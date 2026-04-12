import { useFolderStore } from "@/stores/folder-store";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useCurrentUser } from "@/services/user/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createFolder } from "./api";

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
          queryKey: ["folder", currentParentFolderId, "items"],
        });
        queryClient.invalidateQueries({
          queryKey: ["folder", currentParentFolderId, "subfolders"],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["organization-unit", currentOrganizationUnitId, "items"],
        });
        queryClient.invalidateQueries({
          queryKey: ["organization-unit", currentOrganizationUnitId, "folders"],
        });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
