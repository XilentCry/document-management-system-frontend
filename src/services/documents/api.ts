import { getCookie } from "@/lib/get-cookie";
import { TSingleFile } from "@/schemas/documents/upload-file-form-schema";
import { TItem } from "@/types/item";

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
    const error = await response.json();

    throw new Error(error.message);
  }

  const blob = await response.blob();

  return URL.createObjectURL(blob);
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
