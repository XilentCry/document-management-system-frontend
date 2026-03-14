import { getCookie } from "@/lib/get-cookie";
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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/documents/${id}/versions${pageParam ? `?cursor=${pageParam}` : ""}`,
    {
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const shareDocument = async (
  id: number,
  shareData: TShareDocumentFormSchema,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/documents/${id}/share`,
    {
      method: "POST",
      headers: {
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(shareData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const downloadDocument = async (id: number, fileName: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/documents/${id}/download`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to download document. Please try again.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const viewDocument = async (id: number): Promise<string> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/documents/${id}/view`,
    {
      headers: {
        Accept: "application/pdf",
      },
      credentials: "include",
    },
  );

  if (!response.ok) {
    const contentType = response.headers.get("Content-Type") ?? "";

    if (contentType.includes("application/json")) {
      const data = await response.json();
      throw new Error(data.message);
    }
  }

  const blob = await response.blob();

  return URL.createObjectURL(blob);
};

export const publicDocument = async (id: string): Promise<string> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/documents/${id}/public`,
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const checkConflicts = async (data: {
  organization_unit_id: number;
  file_names: string[];
}): Promise<{
  conflicts: { id: number; name: string; can_replace: boolean }[];
}> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/documents/check-conflicts`,
    {
      method: "POST",
      headers: {
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to check conflicts.");
  }

  return response.json();
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

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/documents`,
    {
      method: "POST",
      headers: {
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        Accept: "application/json",
      },
      credentials: "include",
      body: formData,
    },
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }
}

export const getDocumentDetails = async (
  id: number | null,
): Promise<
  Pick<
    TItem,
    "id" | "name" | "owner" | "classification" | "created_at" | "updated_at"
  > & {
    current_version: {
      id: number;
      item_id: number;
      file_size: number;
      version_number: number;
    };
  }
> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/documents/${id}/details`,
    {
      headers: {
        "Content-Type": "application/json",
        Application: "application/json",
      },
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.documentDetails;
};

export const getPublicDocumentDetails = async (
  id: string,
): Promise<
  Pick<
    TItem,
    "id" | "name" | "owner" | "classification" | "created_at" | "updated_at"
  > & {
    current_version: {
      id: number;
      item_id: number;
      file_size: number;
      version_number: number;
    };
  }
> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/documents/${id}/details/public`,
    {
      headers: {
        "Content-Type": "application/json",
        Application: "application/json",
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.documentDetails;
};
