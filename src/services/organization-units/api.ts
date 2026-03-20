import apiClient from "@/lib/api-client";
import { TBasicUser } from "@/types/basic-user";
import { TBreadcrumb } from "@/types/breadcrumb";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TFilterOwner } from "@/types/filter-owner";
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

export const getSpecificUsers = async (
  id: number | null,
): Promise<TBasicUser[]> => {
  const { data } = await apiClient.get(
    `/api/organization-units/${id}/specific-users`,
  );
  return data.specificUsers;
};

export const searchOrganizationUnitItems = async ({
  id,
  pageParam,
  searchTerm,
  filterType,
  filterClassification,
  filterOwner,
  filterOwnerId,
}: {
  id: number | null;
  pageParam: string | null;
  searchTerm: string | null;
  filterType: TFilterType;
  filterClassification: number | null;
  filterOwner: TFilterOwner;
  filterOwnerId: number | null;
}): Promise<TCursorPaginate<TItem>> => {
  const params = new URLSearchParams();
  if (pageParam) params.append("cursor", pageParam);
  if (searchTerm) params.append("q", searchTerm);
  if (filterType) params.append("type", filterType);
  if (filterClassification) params.append("classification", filterClassification.toString());
  if (filterOwner) params.append("owner", filterOwner);
  if (filterOwnerId) params.append("owner_id", filterOwnerId.toString());

  const { data } = await apiClient.get(
    `/api/organization-units/${id}/items/search?${params.toString()}`,
  );
  return data;
};

export const searchTopOrganizationUnitItems = async ({
  id,
  searchTerm,
  filterType,
  filterClassification,
  filterOwner,
  filterOwnerId,
}: {
  id: number | null;
  searchTerm: string | null;
  filterType: TFilterType | null;
  filterClassification: number | null;
  filterOwner: TFilterOwner | null;
  filterOwnerId: number | null;
}): Promise<TItem[]> => {
  const params = new URLSearchParams();
  if (searchTerm) params.append("q", searchTerm);
  if (filterType) params.append("type", filterType);
  if (filterClassification) params.append("classification", filterClassification.toString());
  if (filterOwner) params.append("owner", filterOwner);
  if (filterOwnerId) params.append("owner_id", filterOwnerId.toString());

  const { data } = await apiClient.get(
    `/api/organization-units/${id}/items/search/top?${params.toString()}`,
  );
  return data.data;
};

export async function getAllOrganizationUnitsTree(): Promise<
  TOrganizationUnitTree[]
> {
  const { data } = await apiClient.get("/api/organization-units/tree");
  return data.organizationUnits;
}

export async function getAllOrganizationUnitsFlat(
  page: number,
  searchTerm?: string
): Promise<TPaginate<TOrganizationUnitFlat>> {
  const params = new URLSearchParams([["page", page.toString()]]);
  if (searchTerm) params.append("q", searchTerm);

  const { data } = await apiClient.get(
    `/api/organization-units/flat?${params.toString()}`,
  );
  return data;
}

export const getOrganizationUnitItems = async ({
  id,
  pageParam,
}: {
  id: string;
  pageParam: string | null;
}): Promise<TGetOrganizationUnitItemsResponse> => {
  const { data } = await apiClient.get(
    `/api/organization-units/${id}/items${pageParam ? `?cursor=${pageParam}` : ""}`,
  );
  return data;
};

export const getOrganizationUnitFolders = async ({
  id,
  pageParam,
}: {
  id: number | null;
  pageParam: string | null;
}): Promise<TGetOrganizationUnitFoldersResponse> => {
  const { data } = await apiClient.get(
    `/api/organization-units/${id}/folders${pageParam ? `?cursor=${pageParam}` : ""}`,
  );
  return data;
};
