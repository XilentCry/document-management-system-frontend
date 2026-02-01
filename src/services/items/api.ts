import { getCookie } from "@/lib/get-cookie";
import { TMoveItemFormSchema } from "@/schemas/items/move-item-form-schema";
import { TRenameItemFormSchema } from "@/schemas/items/rename-item-form-schema";
import { TActivity } from "@/types/activity";

export async function getItemActivities(
  id: number | null,
): Promise<TActivity[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/items/${id}/activities`,
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

  return data.itemActivities;
}

export async function renameItem(
  id: number,
  renameData: TRenameItemFormSchema,
): Promise<{ message: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/items/${id}/rename`,
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/items/${id}/move`,
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
