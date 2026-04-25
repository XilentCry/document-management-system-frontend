import { useFolderStore } from "@/stores/folder-store";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useCurrentUser } from "@/services/user/queries";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkGrantDownloadAccess, downloadDocument, downloadDocumentVersion, grantDownloadAccess, revokeDownloadAccess, shareDocument, uploadDocument, updateClassification, removeDocumentShare, trashDocument, updateShareRole } from "./api";
import { toast } from "sonner";
import { TShareDocumentFormSchema } from "@/schemas/documents/share-document-form-schema";
import { TChangeClassificationFormSchema } from "@/schemas/documents/change-classification-form-schema";
import { TTrashDocumentFormSchema } from "@/schemas/documents/trash-document-form-schema";
import { TDocumentShare } from "@/types/document-share";
import { TDownloadEligibleUser } from "@/types/download-eligible-user";
import { TCursorPaginate } from "@/types/cursor-paginate";

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

      queryClient.invalidateQueries({
        queryKey: ["document", variables.id, "download-eligible"],
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

      const previousShares = queryClient.getQueryData<
        InfiniteData<TCursorPaginate<TDocumentShare>>
      >(["document", variables.documentId, "shares"]);

      if (previousShares) {
        queryClient.setQueryData<InfiniteData<TCursorPaginate<TDocumentShare>>>(
          ["document", variables.documentId, "shares"],
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                data: page.data.filter(
                  (share) => share.id !== variables.shareId,
                ),
              })),
            };
          },
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
      queryClient.invalidateQueries({
        queryKey: ["document", variables.documentId, "download-eligible"],
      });
    },
  });
};

export const useUpdateShareRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      shareId,
      shareRoleId,
    }: {
      shareId: string;
      documentId: string;
      shareRoleId: string;
    }) => updateShareRole(shareId, shareRoleId),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["document", variables.documentId, "shares"],
      });

      const previousShares = queryClient.getQueryData<
        InfiniteData<TCursorPaginate<TDocumentShare>>
      >(["document", variables.documentId, "shares"]);

      return { previousShares };
    },
    onSuccess: (data, variables) => {
      toast.success(data.message);

      queryClient.setQueryData<InfiniteData<TCursorPaginate<TDocumentShare>>>(
        ["document", variables.documentId, "shares"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((share) =>
                share.id === data.share.id ? data.share : share,
              ),
            })),
          };
        },
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["item", variables.documentId, "activities"],
      });
    },
  });
};

export const useSetDownloadGrant = (documentId: string) => {
  const queryClient = useQueryClient();
  const grantedKey = ["document", documentId, "download-eligible", "granted", ""];

  return useMutation({
    mutationFn: ({ userId, allow }: { userId: string; allow: boolean }) =>
      allow
        ? grantDownloadAccess(documentId, userId)
        : revokeDownloadAccess(documentId, userId),
    onMutate: async (variables) => {
      if (variables.allow) return;

      await queryClient.cancelQueries({ queryKey: grantedKey });

      const previous = queryClient.getQueryData<
        InfiniteData<TCursorPaginate<TDownloadEligibleUser>>
      >(grantedKey);

      queryClient.setQueryData<
        InfiniteData<TCursorPaginate<TDownloadEligibleUser>>
      >(grantedKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((u) => u.id !== variables.userId),
          })),
        };
      });

      return { previous };
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error, _variables, context) => {
      toast.error(error.message);
      if (context?.previous) {
        queryClient.setQueryData(grantedKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["document", documentId, "download-eligible"],
      });
      queryClient.invalidateQueries({
        queryKey: ["document", documentId, "shares"],
      });
      queryClient.invalidateQueries({
        queryKey: ["item", documentId, "activities"],
      });
    },
  });
};

export const useBulkGrantDownload = (documentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userIds: string[]) => bulkGrantDownloadAccess(documentId, userIds),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["document", documentId, "download-eligible"],
      });
      queryClient.invalidateQueries({
        queryKey: ["document", documentId, "shares"],
      });
      queryClient.invalidateQueries({
        queryKey: ["item", documentId, "activities"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
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
