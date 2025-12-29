import { TOrganizationUnit } from "@/types/organization-unit";

export async function getAllOrganizationUnits(): Promise<TOrganizationUnit[]> {
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
