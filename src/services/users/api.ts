import { getCookie } from "@/lib/get-cookie";
import { TUser } from "@/types/user";

export async function getAllUsers(): Promise<TUser[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.users;
}

export async function updateStatus(
  userId: number,
  statusId: number
): Promise<{ message: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/status`,
    {
      method: "PATCH",
      headers: {
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status_id: statusId }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return { message: data.message };
}
