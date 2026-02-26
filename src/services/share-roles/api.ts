import { TShareRole } from "@/types/share-role";

export async function getAllShareRoles(): Promise<TShareRole[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/share-roles`,
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

  return data.shareRoles;
}
