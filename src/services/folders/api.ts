import { getCookie } from "@/lib/get-cookie";
import { TNewFolderFormSchema } from "@/schemas/folders/new-folder-form-schema";
import { TBreadcrumb } from "@/types/breadcrumb";
import { TItem } from "@/types/item";
import { Paginate } from "@/types/paginate";

type TGetFolderItemsResponse = {
  currentParentFolderId: number;
  breadcrumb: TBreadcrumb[];
} & Paginate<TItem>;

type TGetFolderSuboldersResponse = {
  currentOrganizationUnitId: number;
  breadcrumb: TBreadcrumb;
} & Paginate<Pick<TItem, "id" | "name" | "parent_item_id">>;

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

export async function renameFolder(id: number, renameData: { name: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/folders/${id}/rename`,
    {
      method: "PATCH",
      headers: {
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(renameData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return { message: data.message };
}

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

export async function moveFolder(
  id: number,
  moveData: { folder_id: number | null },
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/folders/${id}/move`,
    {
      method: "PATCH",
      headers: {
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(moveData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return { message: data.message };
}
