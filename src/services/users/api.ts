import { getCookie } from "@/lib/get-cookie";
import { TOrganizationUnitBase } from "@/types/organization-unit-base";
import { TUser } from "@/types/user";
import { TUpdateUserFormSchema } from "@/schemas/users/update-user-form-schema";
import { TPaginate } from "@/types/paginate";
import { TInviteAdminFormSchema } from "@/schemas/users/invite-admin-form-schema";
import { TAuditLog } from "@/types/audit-log";

type TGetUserResponse = TUser & {
  organizationUnits: TOrganizationUnitBase[];
};

type TUpdateUserResponse =
  | { errors: Record<string, string[]> }
  | { message: string };

export async function getAllUsers(
  page: number,
  searchTerm?: string,
  roles?: string[],
  statuses?: string[]
): Promise<TPaginate<TUser>> {
  const params = new URLSearchParams([["page", page.toString()]]);

  if (searchTerm) {
    params.append("q", searchTerm);
  }

  roles?.forEach((role) => params.append("roles[]", role));
  statuses?.forEach((status) => params.append("statuses[]", status));

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users?${params.toString()}`,
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
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}/status`,
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
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}`,
    {
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch user. Please try again.");
  }

  return data.user;
}

export async function updateUser(
  userData: TUpdateUserFormSchema,
  userId: number,
): Promise<TUpdateUserResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`,
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

export async function inviteAdmin(
  inviteAdminData: TInviteAdminFormSchema,
): Promise<{ message: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/admin-invitation`,
    {
      method: "POST",
      headers: {
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(inviteAdminData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    if (data.errors && Object.keys(data.errors).length > 0) {
      throw { errors: data.errors };
    }

    throw new Error(data.message);
  }

  return { message: data.message };
}

export async function reinviteAdmin(id: number): Promise<{ message: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}/admin-reinvitation`,
    {
      method: "POST",
      headers: {
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        Accept: "application/json",
      },
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return { message: data.message };
}

export async function getRoles(): Promise<{ roles: { id: number; name: string }[] }> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/roles`, {
    headers: { Accept: "application/json" },
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch roles");
  return data;
}

export async function getStatuses(): Promise<{ statuses: { id: number; name: string }[] }> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/statuses`, {
    headers: { Accept: "application/json" },
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch statuses");
  return data;
}

export async function getUserAuditLogs(
  userId: number | string,
  page: number,
): Promise<TPaginate<TAuditLog>> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}/audit-logs?page=${page}`,
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
