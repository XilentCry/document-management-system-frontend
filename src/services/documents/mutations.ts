import { useFolderStore } from "@/stores/folder-store";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadDocument } from "./api";

export const useUploadDocument = () => {
  const currentOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.currentOrganizationUnitId,
  );
  const currentParentFolderId = useFolderStore(
    (state) => state.currentParentFolderId,
  );

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
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
  });
};
