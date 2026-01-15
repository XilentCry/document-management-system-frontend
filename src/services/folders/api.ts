import { getCookie } from "@/lib/get-cookie";
import { TNewFolderFormSchema } from "@/schemas/folders/new-folder-form-schema";
import { TBreadcrumb } from "@/types/breadcrumb";
import { TItem } from "@/types/item";
import { Paginate } from "@/types/paginate";

type TGetFolderItemsResponse = {
  currentParentFolderId: number;
  breadcrumb: TBreadcrumb[];
} & Paginate<TItem>;

export async function createFolder(
  folderData: TNewFolderFormSchema
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

export const getFolderItems = async (
  id: string
): Promise<TGetFolderItemsResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/folders/${id}/items`,
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

  return data;
};
