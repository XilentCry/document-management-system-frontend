import { TRenameItemFormSchema } from "@/features/items/schemas/rename-item-form-schema";
import { useFolderStore } from "@/features/drive/store/folder-store";
import { useOrganizationUnitStore } from "@/features/organization-units/store/organization-unit-store";
import { useCurrentUser } from "@/features/auth/api/me-queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  forceDeleteItem,
  lockItem,
  moveItem,
  renameItem,
  restoreItem,
  unlockItem,
} from "./client";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { TMoveItemFormSchema } from "@/features/items/schemas/move-item-form-schema";
import { TTrashedItem } from "@/features/trash/types/trash-item";

export type TRestoreNameConflict = {
  id: string;
  name: string;
  is_folder: boolean;
};

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
      }

      queryClient.invalidateQueries({
        queryKey: [type === "document" ? "documents" : "folders", "detail", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["items", "detail", variables.id, "activities"],
      });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
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

      if (variables.moveData.parent_folder_id) {
        queryClient.invalidateQueries({
          queryKey: ["folders", "detail", variables.moveData.parent_folder_id, "items"],
        });
        queryClient.invalidateQueries({
          queryKey: ["folders", "detail", variables.moveData.parent_folder_id, "subfolders"],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["organization-units", "detail", currentOrganizationUnitId, "items"],
        });
        queryClient.invalidateQueries({
          queryKey: ["organization-units", "detail", currentOrganizationUnitId, "folders"],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["items", "detail", variables.id, "activities"],
      });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useRestoreItem = (options?: {
  onNameConflict?: (conflict: TRestoreNameConflict) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreItem,
    onSuccess: (data, id) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["documents", "trash"] });
      queryClient.invalidateQueries({ queryKey: ["organization-units"] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({
        queryKey: ["items", "detail", id, "activities"],
      });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
    },
    onError: (error) => {
      if (
        isAxiosError(error) &&
        error.response?.status === 409 &&
        error.response.data?.conflict
      ) {
        options?.onNameConflict?.(error.response.data.conflict);
        return;
      }
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
          queryKey: ["folders", "detail", currentParentFolderId, "items"],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["organization-units", "detail", currentOrganizationUnitId, "items"],
        });
      }

      queryClient.invalidateQueries({ queryKey: ["shared-with-me"] });
      queryClient.invalidateQueries({ queryKey: ["documents", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["items", "detail", id, "activities"] });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
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
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
      setIsDeleteDialogOpen?.(false);
      setItemToDelete?.(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
