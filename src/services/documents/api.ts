import apiClient from "@/lib/api-client";
import { TShareDocumentFormSchema } from "@/schemas/documents/share-document-form-schema";
import { TSingleFile } from "@/schemas/documents/upload-file-form-schema";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TDocumentVersion } from "@/types/document-version";
import { TItem } from "@/types/item";

export const getDocumentVersions = async ({
  id,
  pageParam,
}: {
  id: number;
  pageParam: string | null;
}): Promise<TCursorPaginate<TDocumentVersion>> => {
  const { data } = await apiClient.get(
    `/api/documents/${id}/versions${pageParam ? `?cursor=${pageParam}` : ""}`,
  );
  return data;
};

export const shareDocument = async (
  id: number,
  shareData: TShareDocumentFormSchema,
) => {
  const { data } = await apiClient.post(
    `/api/documents/${id}/share`,
    shareData,
  );
  return data;
};

export const downloadDocument = async (id: number, fileName: string) => {
  const { data } = await apiClient.get(`/api/documents/${id}/download`, {
    responseType: "blob",
  });

  const url = URL.createObjectURL(data);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const viewDocument = async (id: number): Promise<string> => {
  const { data } = await apiClient.get(`/api/documents/${id}/view`, {
    responseType: "blob",
    headers: { Accept: "application/pdf" },
  });

  return URL.createObjectURL(data);
};

export const viewPublicDocument = async (id: string): Promise<string> => {
  const { data } = await apiClient.get(`/api/documents/${id}/public`, {
    responseType: "blob",
    withCredentials: false,
  });

  return URL.createObjectURL(data);
};

export const checkConflicts = async (conflictData: {
  organization_unit_id: number;
  file_names: string[];
}): Promise<{
  conflicts: { id: number; name: string; can_replace: boolean }[];
}> => {
  const { data } = await apiClient.post(
    "/api/documents/check-conflicts",
    conflictData,
  );
  return data;
};

export async function uploadDocument(documentData: TSingleFile) {
  const formData = new FormData();
  formData.append(
    "organization_unit_id",
    documentData.organization_unit_id.toString(),
  );
  formData.append(
    "classification_id",
    documentData.classification_id.toString(),
  );

  if (documentData.folder_id) {
    formData.append("folder_id", documentData.folder_id.toString());
  }

  if (documentData.replace_item_id) {
    formData.append("replace_item_id", documentData.replace_item_id.toString());
  }

  formData.append("file", documentData.file);

  await apiClient.post("/api/documents", formData);
}

export const getDocumentDetails = async (
  id: number | null,
): Promise<
  Pick<
    TItem,
    "id" | "name" | "type" | "owner" | "created_at" | "updated_at"
  > & {
    classification: string;
    current_version: Omit<TDocumentVersion, "item" | "created_at" | "created_by"> & {
      item_id: number;
    };
  }
> => {
  const { data } = await apiClient.get(`/api/documents/${id}/details`);
  return data.documentDetails;
};

export const getPublicDocumentDetails = async (
  id: string,
): Promise<
  Pick<
    TItem,
    "id" | "name" | "type" | "owner" | "created_at" | "updated_at"
  > & {
    classification: string;
    current_version: Omit<TDocumentVersion, "item" | "created_at" | "created_by"> & {
      item_id: number;
    };
  }
> => {
  const { data } = await apiClient.get(
    `/api/documents/${id}/details/public`,
    { withCredentials: false },
  );
  return data.documentDetails;
};
