import { getCookie } from "@/lib/get-cookie";
import { TNewFolderFormSchema } from "@/schemas/folders/new-folder-form-schema";
import { TBreadcrumb } from "@/types/breadcrumb";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TItem } from "@/types/item";

type TGetFolderItemsResponse = {
  currentParentFolderId: number;
  breadcrumb: TBreadcrumb[];
} & TCursorPaginate<TItem>;

type TGetFolderSuboldersResponse = {
  currentOrganizationUnitId: number;
  breadcrumb: TBreadcrumb;
} & TCursorPaginate<Pick<TItem, "id" | "name" | "parent_item_id">>;

export async function createFolder(
  folderData: TNewFolderFormSchema,
): Promise<{ message: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/folders`,
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

export const getFolderItems = async ({
  id,
  pageParam,
}: {
  id: string;
  pageParam: string | null;
}): Promise<TGetFolderItemsResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/folders/${id}/items${pageParam ? `?cursor=${pageParam}` : ""}`,
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

export const getFolderSubfolders = async (
  id: number | null,
  pageParam: string | null = null,
): Promise<TGetFolderSuboldersResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/folders/${id}/subfolders${pageParam ? `?cursor=${pageParam}` : ""}`,
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
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/folders/${id}/details`,
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
