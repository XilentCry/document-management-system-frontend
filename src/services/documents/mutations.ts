import { useFolderStore } from "@/stores/folder-store";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useCurrentUser } from "@/services/user/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { downloadDocument, downloadDocumentVersion, shareDocument, uploadDocument, updateClassification, updateDocumentShareRole, removeDocumentShare, trashDocument } from "./api";
import { toast } from "sonner";
import { TShareDocumentFormSchema } from "@/schemas/documents/share-document-form-schema";
import { TChangeClassificationFormSchema } from "@/schemas/documents/change-classification-form-schema";
import { TTrashDocumentFormSchema } from "@/schemas/documents/trash-document-form-schema";
import { TDocumentShare } from "@/types/document-share";
import { TShareRole } from "@/types/share-role";

export type TUploadDocumentResponse = {
  item: {
    id: string;
    parent_item_id: string | null;
    organization_unit_id: string;
  };
};

export const useShareDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      shareData,
    }: {
      id: string;
      shareData: TShareDocumentFormSchema;
    }) => shareDocument(id, shareData),
    onSuccess: (data, variables) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ["item", variables.id, "activities"],
      });

      queryClient.invalidateQueries({
        queryKey: ["document", variables.id, "shares"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUploadDocument = () => {
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
    mutationFn: uploadDocument,
    onSuccess: (data: TUploadDocumentResponse, variables) => {
      if (variables.replace_item_id) {
        const parent_item_id = data.item.parent_item_id;
        const organization_unit_id = data.item.organization_unit_id;

        if (parent_item_id) {
          queryClient.invalidateQueries({
            queryKey: ["folder", parent_item_id, "items"],
          });
        } else if (organization_unit_id) {
          queryClient.invalidateQueries({
            queryKey: ["organization-unit", organization_unit_id, "items"],
          });
        }
      } else {
        if (currentParentFolderId) {
          queryClient.invalidateQueries({
            queryKey: ["folder", currentParentFolderId, "items"],
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: ["organization-unit", currentOrganizationUnitId, "items"],
          });
        }
      }

      queryClient.invalidateQueries({
        queryKey: ["item", data.item.id, "activities"],
      });
      queryClient.invalidateQueries({
        queryKey: ["document", data.item.id, "versions"],
      });
    },
  });
};

export const useDownloadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, fileName }: { id: string; fileName: string }) =>
      downloadDocument(id, fileName),
    onSuccess: (_, variables) => {
      toast.success("Document downloaded successfully.");

      queryClient.invalidateQueries({
        queryKey: ["item", variables.id, "activities"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDownloadDocumentVersion = () => {
  return useMutation({
    mutationFn: ({ versionId, fileName }: { versionId: string; fileName: string }) =>
      downloadDocumentVersion(versionId, fileName),
    onSuccess: () => {
      toast.success("Document version downloaded successfully.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateClassification = () => {
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
      classificationData,
    }: {
      id: string;
      classificationData: TChangeClassificationFormSchema;
    }) => updateClassification(id, classificationData),
    onSuccess: (data, variables) => {
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

      queryClient.invalidateQueries({
        queryKey: ["item", variables.id, "activities"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateDocumentShareRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      shareId,
      shareRoleId,
    }: {
      shareId: string;
      shareRoleId: string;
      documentId: string;
    }) => updateDocumentShareRole(shareId, shareRoleId),
    onMutate: async (newShareRole) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["document", newShareRole.documentId, "shares"],
      });

      // Snapshot the previous value
      const previousShares = queryClient.getQueryData<TDocumentShare[]>([
        "document",
        newShareRole.documentId,
        "shares",
      ]);

      // Optimistically update to the new value
      if (previousShares) {
        const shareRoles = queryClient.getQueryData<TShareRole[]>(["share-roles"]);
        const newRole = shareRoles?.find((r) => r.id === newShareRole.shareRoleId);

        queryClient.setQueryData<TDocumentShare[]>(
          ["document", newShareRole.documentId, "shares"],
          (old) =>
            old?.map((share) => {
              if (share.id === newShareRole.shareId) {
                return {
                  ...share,
                  share_role: newRole || share.share_role,
                };
              }
              return share;
            }),
        );
      }

      // Return a context object with the snapshotted value
      return { previousShares };
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error, variables, context) => {
      toast.error(error.message);

      // Rollback to the previous value
      if (context?.previousShares) {
        queryClient.setQueryData(
          ["document", variables.documentId, "shares"],
          context.previousShares,
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success to ensure we have the correct data
      queryClient.invalidateQueries({
        queryKey: ["document", variables.documentId, "shares"],
      });

      queryClient.invalidateQueries({
        queryKey: ["item", variables.documentId, "activities"],
      });
    },
  });
};

export const useRemoveDocumentShare = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      shareId,
    }: {
      shareId: string;
      documentId: string;
    }) => removeDocumentShare(shareId),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["document", variables.documentId, "shares"],
      });

      const previousShares = queryClient.getQueryData<TDocumentShare[]>([
        "document",
        variables.documentId,
        "shares",
      ]);

      if (previousShares) {
        queryClient.setQueryData<TDocumentShare[]>(
          ["document", variables.documentId, "shares"],
          (old) => old?.filter((share) => share.id !== variables.shareId),
        );
      }

      return { previousShares };
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error, variables, context) => {
      toast.error(error.message);
      if (context?.previousShares) {
        queryClient.setQueryData(
          ["document", variables.documentId, "shares"],
          context.previousShares,
        );
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["document", variables.documentId, "shares"],
      });
      queryClient.invalidateQueries({
        queryKey: ["item", variables.documentId, "activities"],
      });
    },
  });
};

export const useTrashDocument = () => {
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
    mutationFn: ({
      id,
      trashData,
    }: {
      id: string;
      trashData: TTrashDocumentFormSchema;
    }) => trashDocument(id, trashData),
    onSuccess: (data) => {
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
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
