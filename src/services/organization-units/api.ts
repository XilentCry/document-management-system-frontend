import apiClient from "@/lib/api-client";
import { TEditOrganizationUnitFormSchema } from "@/schemas/organization-units/edit-organization-unit-schema";
import { TNewOrganizationUnitFormSchema } from "@/schemas/organization-units/new-organization-unit-schema";
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
  currentOrganizationUnitId: string;
  currentOrganizationUnitName: string;
  breadcrumb: TBreadcrumb;
} & TCursorPaginate<TItem>;

type TGetOrganizationUnitFoldersResponse = {
  currentOrganizationUnitId: string;
  breadcrumb: TBreadcrumb;
} & TCursorPaginate<Pick<TItem, "id" | "name" | "parent_item_id">>;

export const searchSpecificUsers = async (
  id: string | null,
  searchTerm: string,
): Promise<TBasicUser[]> => {
  const params = new URLSearchParams();
  params.append("q", searchTerm);

  const { data } = await apiClient.get(
    `/api/organization-units/${id}/specific-users/search?${params.toString()}`,
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
  filterSharedTo,
}: {
  id: string | null;
  pageParam: string | null;
  searchTerm: string | null;
  filterType: TFilterType;
  filterClassification: string | null;
  filterOwner: TFilterOwner;
  filterOwnerId: string | null;
  filterSharedTo: string | null;
}): Promise<TCursorPaginate<TItem>> => {
  const params = new URLSearchParams();
  if (pageParam) params.append("cursor", pageParam);
  if (searchTerm) params.append("q", searchTerm);
  if (filterType) params.append("type", filterType);
  if (filterClassification) params.append("classification", filterClassification);
  if (filterOwner) params.append("owner", filterOwner);
  if (filterOwnerId) params.append("owner_id", filterOwnerId);
  if (filterSharedTo) params.append("shared_to", filterSharedTo);

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
  filterSharedTo,
}: {
  id: string | null;
  searchTerm: string | null;
  filterType: TFilterType | null;
  filterClassification: string | null;
  filterOwner: TFilterOwner | null;
  filterOwnerId: string | null;
  filterSharedTo: string | null;
}): Promise<TItem[]> => {
  const params = new URLSearchParams();
  if (searchTerm) params.append("q", searchTerm);
  if (filterType) params.append("type", filterType);
  if (filterClassification) params.append("classification", filterClassification);
  if (filterOwner) params.append("owner", filterOwner);
  if (filterOwnerId) params.append("owner_id", filterOwnerId);
  if (filterSharedTo) params.append("shared_to", filterSharedTo);

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
  id: string | null;
  pageParam: string | null;
}): Promise<TGetOrganizationUnitFoldersResponse> => {
  const { data } = await apiClient.get(
    `/api/organization-units/${id}/folders${pageParam ? `?cursor=${pageParam}` : ""}`,
  );
  return data;
};

export async function createOrganizationUnit(
  organizationUnitData: TNewOrganizationUnitFormSchema,
): Promise<{ message: string }> {
  const { data } = await apiClient.post("/api/organization-units", organizationUnitData);
  return data;
}

export async function editOrganizationUnit({
  id,
  data: organizationUnitData,
}: {
  id: string;
  data: TEditOrganizationUnitFormSchema;
}): Promise<{ message: string }> {
  const { data } = await apiClient.patch(
    `/api/organization-units/${id}`,
    organizationUnitData,
  );
  return data;
}

