import { useFolderStore } from "@/stores/folder-store";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { downloadDocument, shareDocument, uploadDocument, updateClassification } from "./api";
import { toast } from "sonner";
import { TShareDocumentFormSchema } from "@/schemas/documents/share-document-form-schema";
import { TChangeClassificationFormSchema } from "@/schemas/documents/change-classification-form-schema";

export const useShareDocument = () => {
  return useMutation({
    mutationFn: ({
      id,
      shareData,
    }: {
      id: string;
      shareData: TShareDocumentFormSchema;
    }) => shareDocument(id, shareData),
    onSuccess: (data) => {
      toast.success(data.message);
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
    onSuccess: () => {
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
  });
};

export const useDownloadDocument = () => {
  return useMutation({
    mutationFn: ({ id, fileName }: { id: string; fileName: string }) =>
      downloadDocument(id, fileName),
    onSuccess: () => {
      toast.success("Document downloaded successfully.");
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
