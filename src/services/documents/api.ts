import { getCookie } from "@/lib/get-cookie";
import { TSingleFile } from "@/schemas/documents/upload-file-form-schema";

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
    `${process.env.NEXT_PUBLIC_API_URL}/api/documents`,
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
