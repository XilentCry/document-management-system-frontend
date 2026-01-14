import { TFolder } from "@/types/folder";
import { TOrganizationUnit } from "@/types/organization-unit";

type TGetOrganizationUnitContentsResponse = {
  folders: TFolder[];
} & Omit<TOrganizationUnit, "children">;

export async function getAllOrganizationUnits(): Promise<
  Pick<
    TOrganizationUnit,
    "id" | "name" | "parent_organization_unit_id" | "children"
  >[]
> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/organization-units`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.organizationUnits;
}

export const getOrganizationUnitContents = async (
  id: string | undefined
): Promise<TGetOrganizationUnitContentsResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/organization-units/${id}/contents`,
    {
      headers: {
        "Content-Type": "application/json",
        Application: "application/json",
      },
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.organizationUnitContents;
};
