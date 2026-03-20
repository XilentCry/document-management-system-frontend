import apiClient from "@/lib/api-client";
import { TAuditLog } from "@/types/audit-log";
import { TPaginate } from "@/types/paginate";

export async function getAllAuditLogs(
  page: number,
  searchTerm?: string
): Promise<TPaginate<TAuditLog>> {
  const params = new URLSearchParams([["page", page.toString()]]);
  if (searchTerm) params.append("q", searchTerm);

  const { data } = await apiClient.get(
    `/api/audit-logs?${params.toString()}`,
  );
  return data;
}
