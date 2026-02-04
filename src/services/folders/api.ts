import { getCookie } from "@/lib/get-cookie";
import { TNewFolderFormSchema } from "@/schemas/folders/new-folder-form-schema";
import { TBreadcrumb } from "@/types/breadcrumb";
import { TItem } from "@/types/item";
import { TPaginate } from "@/types/paginate";

type TGetFolderItemsResponse = {
  currentParentFolderId: number;
  breadcrumb: TBreadcrumb[];
} & TPaginate<TItem>;

type TGetFolderSuboldersResponse = {
  currentOrganizationUnitId: number;
  breadcrumb: TBreadcrumb;
} & TPaginate<Pick<TItem, "id" | "name" | "parent_item_id">>;

export async function createFolder(
  folderData: TNewFolderFormSchema,
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
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export const getFolderItems = async (
  id: string,
): Promise<TGetFolderItemsResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/folders/${id}/items`,
    {
      headers: {
        "Content-Type": "application/json",
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

export const getFolderSubfolders = async (
  id: number | null,
): Promise<TGetFolderSuboldersResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/folders/${id}/subfolders`,
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

  return data;
};

export const getFolderDetails = async (
  id: number | null,
): Promise<
  Pick<TItem, "id" | "name" | "owner" | "created_at" | "updated_at">
> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/folders/${id}/details`,
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

  return data.folderDetails;
};
