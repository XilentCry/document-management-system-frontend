import { TRenameItemFormSchema } from "@/schemas/items/rename-item-form-schema";
import { useFolderStore } from "@/stores/folder-store";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveItem, renameItem } from "./api";
import { toast } from "sonner";
import { TMoveItemFormSchema } from "@/schemas/items/move-item-form-schema";

export const useRenameItem = () => {
  const currentOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.currentOrganizationUnitId,
  );
  const currentParentFolderId = useFolderStore(
    (state) => state.currentParentFolderId,
  );

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      renameData,
    }: {
      id: number;
      renameData: TRenameItemFormSchema;
    }) => renameItem(id, renameData),
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

export const useMoveItem = () => {
  const currentOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.currentOrganizationUnitId,
  );
  const currentParentFolderId = useFolderStore(
    (state) => state.currentParentFolderId,
  );

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      moveData,
    }: {
      id: number;
      moveData: TMoveItemFormSchema;
    }) => moveItem(id, moveData),
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
