import { getCookie } from "@/lib/get-cookie";
import { TOrganizationUnit } from "@/types/organization-unit";
import { TUser } from "@/types/user";
import { TUpdateUserFormSchema } from "@/schemas/users/update-user-form-schema";
import { TPaginate } from "@/types/paginate";

type TGetUserResponse = TUser & {
  organizationUnits: Pick<TOrganizationUnit, "id" | "name">[];
};

type TUpdateUserResponse =
  | { errors: Record<string, string[]> }
  | { message: string };

export async function getAllUsers(page: number): Promise<TPaginate<TUser>> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users?page=${page}`,
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

export async function updateStatus(
  userId: number,
  statusId: number,
): Promise<{ message: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/status`,
    {
      method: "PATCH",
      headers: {
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status_id: statusId }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return { message: data.message };
}

export async function getUser(id: string): Promise<TGetUserResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
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

  return data.user;
}

export async function updateUser(
  userData: TUpdateUserFormSchema,
  userId: number,
): Promise<TUpdateUserResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`,
    {
      method: "PATCH",
      headers: {
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    if (data.errors && Object.keys(data.errors).length > 0) {
      return { errors: data.errors };
    }

    throw new Error(data.message);
  }

  return { message: data.message };
}
