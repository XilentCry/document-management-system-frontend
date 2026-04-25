import apiClient from "@/lib/api-client";
import { TMoveItemFormSchema } from "@/schemas/items/move-item-form-schema";
import { TRenameItemFormSchema } from "@/schemas/items/rename-item-form-schema";
import { TAuditLog } from "@/types/audit-log";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TShareableUser } from "@/types/shareable-user";

export async function getShareableUsers(
  id: string,
  searchTerm?: string,
): Promise<TShareableUser[]> {
  const queryParam = searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : "";
  const { data } = await apiClient.get(
    `/api/documents/${id}/shareable-users${queryParam}`,
  );
  return data.users;
}

export async function getItemActivities({
  id,
  pageParam,
}: {
  id: string | null;
  pageParam: string | null;
}): Promise<TCursorPaginate<TAuditLog>> {
  const { data } = await apiClient.get(
    `/api/items/${id}/activities${pageParam ? `?cursor=${pageParam}` : ""}`,
  );
  return data;
}

export async function renameItem(
  id: string,
  renameData: TRenameItemFormSchema,
): Promise<{ message: string }> {
  const { data } = await apiClient.patch(`/api/items/${id}/rename`, renameData);
  return data;
}

export async function moveItem(
  id: string,
  moveData: TMoveItemFormSchema,
): Promise<{ message: string }> {
  const { data } = await apiClient.patch(`/api/items/${id}/move`, moveData);
  return data;
}

export async function lockItem(id: string): Promise<{ message: string }> {
  const { data } = await apiClient.patch(`/api/items/${id}/lock`);
  return data;
}

export async function unlockItem(id: string): Promise<{ message: string }> {
  const { data } = await apiClient.patch(`/api/items/${id}/unlock`);
  return data;
}

export async function restoreItem(id: string): Promise<{ message: string }> {
  const { data } = await apiClient.patch(`/api/documents/${id}/restore`);
  return data;
}

export async function forceDeleteItem(id: string): Promise<{ message: string }> {
  const { data } = await apiClient.delete(`/api/documents/${id}/force-delete`);
  return data;
}
