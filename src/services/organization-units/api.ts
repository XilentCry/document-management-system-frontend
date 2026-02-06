import { TBreadcrumb } from "@/types/breadcrumb";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TItem } from "@/types/item";
import { TOrganizationUnit } from "@/types/organization-unit";

type TGetOrganizationUnitItemsResponse = {
  currentOrganizationUnitId: number;
  breadcrumb: TBreadcrumb;
} & TCursorPaginate<TItem>;

type TGetOrganizationUnitFoldersResponse = {
  currentOrganizationUnitId: number;
  breadcrumb: TBreadcrumb;
} & TCursorPaginate<Pick<TItem, "id" | "name" | "parent_item_id">>;

export async function getAllOrganizationUnits(): Promise<
  Pick<
    TOrganizationUnit,
    "id" | "name" | "parent_organization_unit_id" | "children"
  >[]
> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organization-units`,
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

export const getOrganizationUnitItems = async ({
  id,
  pageParam,
}: {
  id: string;
  pageParam: string | null;
}): Promise<TGetOrganizationUnitItemsResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organization-units/${id}/items${pageParam ? `?cursor=${pageParam}` : ""}`,
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

  return data;
};

export const getOrganizationUnitFolders = async (
  id: number | null,
  pageParam: string | null = null,
): Promise<TGetOrganizationUnitFoldersResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organization-units/${id}/folders${pageParam ? `?cursor=${pageParam}` : ""}`,
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
