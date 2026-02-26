import { TCursorPaginate } from "@/types/cursor-paginate";
import { TOrganizationUnitTree } from "@/types/organization-unit-tree";
import { TSharedWithMe } from "@/types/shared-with-me";

export const getAllSharedWithMe = async ({
  pageParam,
}: {
  pageParam: string | null;
}): Promise<TCursorPaginate<TSharedWithMe>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/shared-with-me${pageParam ? `?cursor=${pageParam}` : ""}`,
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

export async function getUserOrganizationUnits(): Promise<
  TOrganizationUnitTree[]
> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/organization-units`,
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

  return data.userOrganizationUnits;
}
