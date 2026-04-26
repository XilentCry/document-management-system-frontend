import { TRenameItemFormSchema } from "@/schemas/items/rename-item-form-schema";
import { useFolderStore } from "@/stores/folder-store";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useCurrentUser } from "@/services/user/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  forceDeleteItem,
  lockItem,
  moveItem,
  renameItem,
  restoreItem,
  unlockItem,
} from "./api";
import { toast } from "sonner";
import { TMoveItemFormSchema } from "@/schemas/items/move-item-form-schema";
import { TTrashedItem } from "@/types/trash-item";

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

export const useRestoreItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreItem,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["documents", "trash"] });
      queryClient.invalidateQueries({ queryKey: ["organization-unit"] });
      queryClient.invalidateQueries({ queryKey: ["folder"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

const useLockMutationBase = (
  action: (id: string) => Promise<{ message: string }>,
) => {
  const { data: currentUser } = useCurrentUser();
  const storeOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.currentOrganizationUnitId,
  );
  const currentOrganizationUnitId =
    storeOrganizationUnitId ?? currentUser?.currentOrganizationUnitId ?? null;
  const currentParentFolderId = useFolderStore(
    (state) => state.currentParentFolderId,
  );

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => action(id),
    onSuccess: (data, id) => {
      toast.success(data.message);

      if (currentParentFolderId) {
        queryClient.invalidateQueries({
          queryKey: ["folder", currentParentFolderId, "items"],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["organization-unit", currentOrganizationUnitId, "items"],
        });
      }

      queryClient.invalidateQueries({ queryKey: ["shared-with-me"] });
      queryClient.invalidateQueries({ queryKey: ["document", id, "details"] });
      queryClient.invalidateQueries({ queryKey: ["item", id, "activities"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useLockItem = () => useLockMutationBase(lockItem);
export const useUnlockItem = () => useLockMutationBase(unlockItem);

export const useForceDeleteItem = (
  setIsDeleteDialogOpen?: (isOpen: boolean) => void,
  setItemToDelete?: (item: TTrashedItem | null) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: forceDeleteItem,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["documents", "trash"] });
      setIsDeleteDialogOpen?.(false);
      setItemToDelete?.(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
