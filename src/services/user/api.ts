import apiClient from "@/lib/api-client";
import { TDocusealSubmission, TUserSubmission } from "@/types/docuseal-submission";
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

export const getMySignings = async ({
  status,
  after,
}: {
  status?: string;
  after?: number;
}): Promise<{ data: TUserSubmission[]; pagination: { next: number | null } }> => {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (after) params.append("after", String(after));

  const { data } = await apiClient.get(`/api/user/docuseal/signings?${params.toString()}`);

  return data;
};

export const getMySubmissions = async ({
  status,
  after,
}: {
  status?: string;
  after?: number;
}): Promise<{
  data: TDocusealSubmission[];
  pagination: { next: number | null };
}> => {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (after) params.append("after", String(after));

  const { data } = await apiClient.get(
    `/api/user/docuseal/submissions?${params.toString()}`,
  );

  return data;
};

export const getSubmissionDetails = async (
  id: number,
): Promise<TDocusealSubmission> => {
  const { data } = await apiClient.get(`/api/user/docuseal/submissions/${id}`);
  return data;
};
