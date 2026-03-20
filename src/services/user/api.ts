import apiClient from "@/lib/api-client";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TOrganizationUnitTree } from "@/types/organization-unit-tree";
import { TSharedWithMe } from "@/types/shared-with-me";

export const getAllSharedWithMe = async ({
  pageParam,
}: {
  pageParam: string | null;
}): Promise<TCursorPaginate<TSharedWithMe>> => {
  const { data } = await apiClient.get(
    `/api/user/shared-with-me${pageParam ? `?cursor=${pageParam}` : ""}`,
  );
  return data;
};

export async function getUserOrganizationUnits(): Promise<
  TOrganizationUnitTree[]
> {
  const { data } = await apiClient.get("/api/user/organization-units");
  return data.userOrganizationUnits;
}
