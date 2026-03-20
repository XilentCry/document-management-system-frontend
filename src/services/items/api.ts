import apiClient from "@/lib/api-client";
import { TMoveItemFormSchema } from "@/schemas/items/move-item-form-schema";
import { TRenameItemFormSchema } from "@/schemas/items/rename-item-form-schema";
import { TAuditLog } from "@/types/audit-log";
import { TBasicUser } from "@/types/basic-user";
import { TCursorPaginate } from "@/types/cursor-paginate";

export async function getShareableUsers(id: number): Promise<TBasicUser[]> {
  const { data } = await apiClient.get(
    `/api/documents/${id}/shareable-users`,
  );
  return data.users;
}

export async function getItemActivities({
  id,
  pageParam,
}: {
  id: number | null;
  pageParam: string | null;
}): Promise<TCursorPaginate<TAuditLog>> {
  const { data } = await apiClient.get(
    `/api/items/${id}/activities${pageParam ? `?cursor=${pageParam}` : ""}`,
  );
  return data;
}

export async function renameItem(
  id: number,
  renameData: TRenameItemFormSchema,
): Promise<{ message: string }> {
  const { data } = await apiClient.patch(`/api/items/${id}/rename`, renameData);
  return data;
}

export async function moveItem(
  id: number,
  moveData: TMoveItemFormSchema,
): Promise<{ message: string }> {
  const { data } = await apiClient.patch(`/api/items/${id}/move`, moveData);
  return data;
}
