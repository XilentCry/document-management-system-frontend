import { getCookie } from "@/lib/get-cookie";
import { TFolderFormSchema } from "@/schemas/folders/create-folder-form-schema";
import { TBreadcrumb } from "@/types/breadcrumb";
import { TFolder } from "@/types/folder";

type TGetFolderContentsResponse = TFolder & {
  breadcrumb: TBreadcrumb[];
};

export async function createFolder(
  folderData: TFolderFormSchema
): Promise<{ message: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/folders`,
    {
      method: "POST",
      headers: {
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(folderData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export const getFolderContents = async (
  id: string
): Promise<TGetFolderContentsResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/folders/${id}/contents?include=breadcrumb`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.folderContents;
};
