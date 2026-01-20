import { TBreadcrumb } from "@/types/breadcrumb";
import { TItem } from "@/types/item";
import { TOrganizationUnit } from "@/types/organization-unit";
import { Paginate } from "@/types/paginate";

type TGetOrganizationUnitItemsResponse = {
  currentOrganizationUnitId: number;
  breadcrumb: TBreadcrumb;
} & Paginate<TItem>;

type TGetOrganizationUnitFoldersResponse = {
  currentOrganizationUnitId: number;
  breadcrumb: TBreadcrumb;
} & Paginate<Pick<TItem, "id" | "name" | "parent_item_id">>;

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
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.organizationUnits;
}

export const getOrganizationUnitItems = async (
  id: string,
): Promise<TGetOrganizationUnitItemsResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/organization-units/${id}/items`,
    {
      headers: {
        "Content-Type": "application/json",
        Application: "application/json",
      },
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const getOrganizationUnitFolders = async (
  id: number | null,
): Promise<TGetOrganizationUnitFoldersResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/organization-units/${id}/folders`,
    {
      headers: {
        "Content-Type": "application/json",
        Application: "application/json",
      },
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};
