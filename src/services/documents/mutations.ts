import { useFolderStore } from "@/stores/folder-store";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { downloadDocument, shareDocument, uploadDocument, updateClassification } from "./api";
import { toast } from "sonner";
import { TShareDocumentFormSchema } from "@/schemas/documents/share-document-form-schema";
import { TChangeClassificationFormSchema } from "@/schemas/documents/change-classification-form-schema";

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
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

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

export const useUpdateClassification = () => {
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
