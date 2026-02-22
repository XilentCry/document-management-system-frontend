import { TOrganizationUnitTree } from "@/types/organization-unit-tree";

export async function getUserOrganizationUnits(): Promise<
  TOrganizationUnitTree[]
> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/organization-units`,
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

  return data.userOrganizationUnits;
}
