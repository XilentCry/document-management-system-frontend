import { TStatuses } from "@/types/statuses";

export async function getAllStatuses(): Promise<TStatuses[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/statuses`,
    {
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.statuses;
}
