import { getCookie } from "@/lib/get-cookie";
import { TMoveItemFormSchema } from "@/schemas/items/move-item-form-schema";
import { TRenameItemFormSchema } from "@/schemas/items/rename-item-form-schema";
import { TActivity } from "@/types/audit-log";
import { TCursorPaginate } from "@/types/cursor-paginate";

export async function getItemActivities({
  id,
  pageParam,
}: {
  id: number | null;
  pageParam: string | null;
}): Promise<TCursorPaginate<TActivity>> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/items/${id}/activities${pageParam ? `?cursor=${pageParam}` : ""}`,
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
}

export async function renameItem(
  id: number,
  renameData: TRenameItemFormSchema,
): Promise<{ message: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/items/${id}/rename`,
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

  return data;
}

export async function moveItem(
  id: number,
  moveData: TMoveItemFormSchema,
): Promise<{ message: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/items/${id}/move`,
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

  return data;
}
