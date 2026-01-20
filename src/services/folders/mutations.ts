import { TRenameFolderFormSchema } from "@/schemas/folders/rename-folder-form-schema";
import { useFolderStore } from "@/stores/folder-store";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createFolder, moveFolder, renameFolder } from "./api";
import { TMoveItemFormSchema } from "@/schemas/items/move-item-form-schema";

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

export const useRenameFolder = () => {
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
      renameData: TRenameFolderFormSchema;
    }) => renameFolder(id, renameData),
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

export const useMoveFolder = () => {
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
    }) => moveFolder(id, moveData),
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
