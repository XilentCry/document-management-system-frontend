import apiClient from "@/lib/api-client";
import { TShareRole } from "@/features/sharing/types/share-role";

export async function getAllShareRoles(): Promise<TShareRole[]> {
  const { data } = await apiClient.get("/api/share-roles");
  return data.share_roles;
}
