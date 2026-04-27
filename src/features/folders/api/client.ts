import apiClient from "@/lib/api-client";
import { TNewFolderFormSchema } from "@/features/folders/schemas/new-folder-form-schema";
import { TBreadcrumb } from "@/types/breadcrumb";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TItem } from "@/features/items/types/item";

type TGetFolderItemsResponse = {
  currentParentFolderId: string;
  breadcrumb: TBreadcrumb[];
} & TCursorPaginate<TItem>;

type TGetFolderSuboldersResponse = {
  currentOrganizationUnitId: string;
  breadcrumb: TBreadcrumb;
} & TCursorPaginate<Pick<TItem, "id" | "name" | "parent_item_id">>;

export async function createFolder(
  folderData: TNewFolderFormSchema,
): Promise<{ message: string }> {
  const { data } = await apiClient.post("/api/folders", folderData);
  return data;
}

export const getFolderItems = async ({
  id,
  pageParam,
}: {
  id: string;
  pageParam: string | null;
}): Promise<TGetFolderItemsResponse> => {
  const { data } = await apiClient.get(
    `/api/folders/${id}/items${pageParam ? `?cursor=${pageParam}` : ""}`,
  );
  return data;
};

export const getFolderSubfolders = async ({
  id,
  pageParam,
}: {
  id: string | null;
  pageParam: string | null;
}): Promise<TGetFolderSuboldersResponse> => {
  const { data } = await apiClient.get(
    `/api/folders/${id}/subfolders${pageParam ? `?cursor=${pageParam}` : ""}`,
  );
  return data;
};

export const getFolderDetails = async (
  id: string | null,
): Promise<
  Pick<TItem, "id" | "name" | "type" | "owner" | "created_at" | "updated_at" | "updated_by" | "opened_at" | "opened_by">
> => {
  const { data } = await apiClient.get(`/api/folders/${id}/details`);
  return data.folderDetails;
};
