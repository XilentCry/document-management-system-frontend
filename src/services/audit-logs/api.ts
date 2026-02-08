import { TAuditLog } from "@/types/audit-log";
import { TPaginate } from "@/types/paginate";

export async function getAllAuditLogs(
  page: number,
): Promise<TPaginate<TAuditLog>> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/audit-logs?page=${page}`,
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
}
