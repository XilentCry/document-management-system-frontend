import { TRenameItemFormSchema } from "@/schemas/items/rename-item-form-schema";
import { useFolderStore } from "@/stores/folder-store";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useCurrentUser } from "@/services/user/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveItem, renameItem } from "./api";
import { toast } from "sonner";
import { TMoveItemFormSchema } from "@/schemas/items/move-item-form-schema";

export const useRenameItem = (
  type: "folder" | "document",
  isInSharedWithMe: boolean,
) => {
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
    mutationFn: ({
      id,
      renameData,
    }: {
      id: string;
      renameData: TRenameItemFormSchema;
    }) => renameItem(id, renameData),
    onSuccess: (data, variables) => {
      toast.success(data.message);

      if (isInSharedWithMe) {
        queryClient.invalidateQueries({ queryKey: ["shared-with-me"] });
      } else {
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
      }

      queryClient.invalidateQueries({
        queryKey: [type, variables.id, "details"],
      });

      queryClient.invalidateQueries({
        queryKey: ["item", variables.id, "activities"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useMoveItem = () => {
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
    mutationFn: ({
      id,
      moveData,
    }: {
      id: string;
      moveData: TMoveItemFormSchema;
    }) => moveItem(id, moveData),
    onSuccess: (data, variables) => {
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

      if (variables.moveData.parent_folder_id) {
        queryClient.invalidateQueries({
          queryKey: ["folder", variables.moveData.parent_folder_id, "items"],
        });
        queryClient.invalidateQueries({
          queryKey: ["folder", variables.moveData.parent_folder_id, "subfolders"],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["organization-unit", currentOrganizationUnitId, "items"],
        });
        queryClient.invalidateQueries({
          queryKey: ["organization-unit", currentOrganizationUnitId, "folders"],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["item", variables.id, "activities"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
