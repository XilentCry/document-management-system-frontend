import { TBreadcrumb } from "@/types/breadcrumb";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TFilterType } from "@/types/filter-type";
import { TItem } from "@/types/item";
import { TOrganizationUnitFlat } from "@/types/organization-unit-flat";
import { TOrganizationUnitTree } from "@/types/organization-unit-tree";
import { TPaginate } from "@/types/paginate";

type TGetOrganizationUnitItemsResponse = {
  currentOrganizationUnitId: number;
  currentOrganizationUnitName: string;
  breadcrumb: TBreadcrumb;
} & TCursorPaginate<TItem>;

type TGetOrganizationUnitFoldersResponse = {
  currentOrganizationUnitId: number;
  breadcrumb: TBreadcrumb;
} & TCursorPaginate<Pick<TItem, "id" | "name" | "parent_item_id">>;

export const searchOrganizationUnitItems = async ({
  id,
  pageParam,
  searchTerm,
  filterType,
  filterClassification,
}: {
  id: number | null;
  pageParam: string | null;
  searchTerm: string | null;
  filterType: TFilterType | null;
  filterClassification: number | null;
}): Promise<TCursorPaginate<TItem>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organization-units/${id}/items/search?${pageParam ? `cursor=${pageParam}&` : ""}q=${searchTerm}${filterType ? `&type=${filterType}` : ""}${filterClassification ? `&classification=${filterClassification}` : ""}`,
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

export async function getAllOrganizationUnitsTree(): Promise<
  TOrganizationUnitTree[]
> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organization-units/tree`,
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

export async function getAllOrganizationUnitsFlat(
  page: number,
): Promise<TPaginate<TOrganizationUnitFlat>> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organization-units/flat?page=${page}`,
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

export const getOrganizationUnitFolders = async ({
  id,
  pageParam,
}: {
  id: number | null;
  pageParam: string | null;
}): Promise<TGetOrganizationUnitFoldersResponse> => {
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
