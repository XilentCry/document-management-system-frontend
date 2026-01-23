import { useFolderStore } from "@/stores/folder-store";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createFolder } from "./api";

export const useCreateFolder = () => {
  const currentOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.currentOrganizationUnitId,
  );
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
          queryKey: [`folder-${currentParentFolderId}-items`],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: [`organization-unit-${currentOrganizationUnitId}-items`],
        });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
