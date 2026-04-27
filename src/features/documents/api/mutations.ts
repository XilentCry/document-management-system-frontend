import { useFolderStore } from "@/features/drive/store/folder-store";
import { useOrganizationUnitStore } from "@/features/organization-units/store/organization-unit-store";
import { useCurrentUser } from "@/features/auth/api/me-queries";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkGrantDownloadAccess, downloadDocument, downloadDocumentVersion, grantDownloadAccess, revokeDownloadAccess, shareDocument, uploadDocument, updateClassification, removeDocumentShare, trashDocument, updateShareRole } from "./client";
import { toast } from "sonner";
import { TShareDocumentFormSchema } from "@/features/documents/schemas/share-document-form-schema";
import { TChangeClassificationFormSchema } from "@/features/documents/schemas/change-classification-form-schema";
import { TTrashDocumentFormSchema } from "@/features/documents/schemas/trash-document-form-schema";
import { TDocumentShare } from "@/features/documents/types/document-share";
import { TDownloadEligibleUser } from "@/features/documents/types/download-eligible-user";
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
        queryKey: ["items", "detail", variables.id, "activities"],
      });

      queryClient.invalidateQueries({
        queryKey: ["documents", "detail", variables.id, "shares"],
      });

      queryClient.invalidateQueries({
        queryKey: ["documents", "detail", variables.id, "download-eligible"],
      });

      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
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
            queryKey: ["folders", "detail", parent_item_id, "items"],
          });
        } else if (organization_unit_id) {
          queryClient.invalidateQueries({
            queryKey: ["organization-units", "detail", organization_unit_id, "items"],
          });
        }
      } else {
        if (currentParentFolderId) {
          queryClient.invalidateQueries({
            queryKey: ["folders", "detail", currentParentFolderId, "items"],
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: ["organization-units", "detail", currentOrganizationUnitId, "items"],
          });
        }
      }

      queryClient.invalidateQueries({
        queryKey: ["items", "detail", data.item.id, "activities"],
      });
      queryClient.invalidateQueries({
        queryKey: ["documents", "detail", data.item.id, "versions"],
      });

      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
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
        queryKey: ["items", "detail", variables.id, "activities"],
      });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDownloadDocumentVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      versionId,
      fileName,
    }: {
      versionId: string;
      fileName: string;
      documentId: string;
    }) => downloadDocumentVersion(versionId, fileName),
    onSuccess: (_, variables) => {
      toast.success("Document version downloaded successfully.");

      queryClient.invalidateQueries({
        queryKey: ["items", "detail", variables.documentId, "activities"],
      });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
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
          queryKey: ["folders", "detail", currentParentFolderId, "items"],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["organization-units", "detail", currentOrganizationUnitId, "items"],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["items", "detail", variables.id, "activities"],
      });
      queryClient.invalidateQueries({
        queryKey: ["documents", "detail", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
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
        queryKey: ["documents", "detail", variables.documentId, "shares"],
      });

      const previousShares = queryClient.getQueryData<
        InfiniteData<TCursorPaginate<TDocumentShare>>
      >(["documents", "detail", variables.documentId, "shares"]);

      if (previousShares) {
        queryClient.setQueryData<InfiniteData<TCursorPaginate<TDocumentShare>>>(
          ["documents", "detail", variables.documentId, "shares"],
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
          ["documents", "detail", variables.documentId, "shares"],
          context.previousShares,
        );
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["documents", "detail", variables.documentId, "shares"],
      });
      queryClient.invalidateQueries({
        queryKey: ["items", "detail", variables.documentId, "activities"],
      });
      queryClient.invalidateQueries({
        queryKey: ["documents", "detail", variables.documentId, "download-eligible"],
      });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
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
        queryKey: ["documents", "detail", variables.documentId, "shares"],
      });

      const previousShares = queryClient.getQueryData<
        InfiniteData<TCursorPaginate<TDocumentShare>>
      >(["documents", "detail", variables.documentId, "shares"]);

      return { previousShares };
    },
    onSuccess: (data, variables) => {
      toast.success(data.message);

      queryClient.setQueryData<InfiniteData<TCursorPaginate<TDocumentShare>>>(
        ["documents", "detail", variables.documentId, "shares"],
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
        queryKey: ["items", "detail", variables.documentId, "activities"],
      });
      queryClient.invalidateQueries({
        queryKey: ["documents", "detail", variables.documentId, "shares"],
      });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
    },
  });
};

export const useSetDownloadGrant = (documentId: string) => {
  const queryClient = useQueryClient();
  const grantedKey = ["documents", "detail", documentId, "download-eligible", { filter: "granted", search: "" }];

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
        queryKey: ["documents", "detail", documentId, "download-eligible"],
      });
      queryClient.invalidateQueries({
        queryKey: ["documents", "detail", documentId, "shares"],
      });
      queryClient.invalidateQueries({
        queryKey: ["items", "detail", documentId, "activities"],
      });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
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
        queryKey: ["documents", "detail", documentId, "download-eligible"],
      });
      queryClient.invalidateQueries({
        queryKey: ["documents", "detail", documentId, "shares"],
      });
      queryClient.invalidateQueries({
        queryKey: ["items", "detail", documentId, "activities"],
      });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
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
    onSuccess: (data, variables) => {
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

      queryClient.invalidateQueries({ queryKey: ["documents", "trash"] });
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
