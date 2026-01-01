import { TOrganizationUnit } from "@/types/organization-unit";

export async function getUserOrganizationUnits(): Promise<
  Pick<
    TOrganizationUnit,
    "id" | "name" | "parent_organization_unit_id" | "children"
  >[]
> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/user/organization-units`,
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

  return data.userOrganizationUnits;
}
