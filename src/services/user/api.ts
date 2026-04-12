import apiClient from "@/lib/api-client";
import { TCurrentUser } from "@/types/current-user";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TOrganizationUnitTree } from "@/types/organization-unit-tree";
import { TSharedWithMe } from "@/types/shared-with-me";

export async function fetchCurrentUser(): Promise<TCurrentUser> {
  const { data } = await apiClient.get("/api/user/current");
  return data.user;
}

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
