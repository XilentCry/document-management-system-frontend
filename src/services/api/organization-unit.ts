import { TOrganizationUnit } from "@/types/organization-unit";

type TGetAllOrganizationUnitsResponse = {
  organizationUnits: TOrganizationUnit[];
};

export async function getAllOrganizationUnits(): Promise<TGetAllOrganizationUnitsResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/organization-units`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return { organizationUnits: data.organizationUnits };
}
