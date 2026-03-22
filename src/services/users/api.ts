import apiClient from "@/lib/api-client";
import { isAxiosError } from "axios";
import { TOrganizationUnitBase } from "@/types/organization-unit-base";
import { TUser } from "@/types/user";
import { TUpdateUserFormSchema } from "@/schemas/users/update-user-form-schema";
import { TPaginate } from "@/types/paginate";
import { TInviteAdminFormSchema } from "@/schemas/users/invite-admin-form-schema";
import { TAuditLog } from "@/types/audit-log";
type TErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

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

  const { data } = await apiClient.get(`/api/users?${params.toString()}`);
  return data;
}

export async function updateStatus(
  userId: number,
  statusId: number,
): Promise<{ message: string }> {
  const { data } = await apiClient.patch(`/api/users/${userId}/status`, {
    status_id: statusId,
  });
  return { message: data.message };
}

export async function getUser(id: string): Promise<TGetUserResponse> {
  const { data } = await apiClient.get(`/api/users/${id}`);
  return data.user;
}

export async function updateUser(
  userData: TUpdateUserFormSchema,
  userId: number,
): Promise<TUpdateUserResponse> {
  try {
    const { data } = await apiClient.patch(`/api/users/${userId}`, userData);
    return { message: data.message };
  } catch (error: unknown) {
    if (isAxiosError<TErrorResponse>(error)) {
      const responseData = error.response?.data;
      if (responseData?.errors && Object.keys(responseData.errors).length > 0) {
        return { errors: responseData.errors };
      }
      throw new Error(responseData?.message);
    }
    throw error;
  }
}

export async function inviteAdmin(
  inviteAdminData: TInviteAdminFormSchema,
): Promise<{ message: string }> {
  try {
    const { data } = await apiClient.post(
      "/api/users/admin-invitation",
      inviteAdminData,
    );
    return { message: data.message };
  } catch (error: unknown) {
    if (isAxiosError<TErrorResponse>(error)) {
      const responseData = error.response?.data;
      if (responseData?.errors && Object.keys(responseData.errors).length > 0) {
        throw { errors: responseData.errors };
      }
      throw new Error(responseData?.message);
    }
    throw error;
  }
}

export async function reinviteAdmin(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.post(
    `/api/users/${id}/admin-reinvitation`,
  );
  return { message: data.message };
}

export async function getRoles(): Promise<{ roles: { id: number; name: string }[] }> {
  const { data } = await apiClient.get("/api/users/roles");
  return data;
}

export async function getStatuses(): Promise<{ statuses: { id: number; name: string }[] }> {
  const { data } = await apiClient.get("/api/users/statuses");
  return data;
}

export async function getUserAuditLogs(
  userId: number | string,
  page: number,
): Promise<TPaginate<TAuditLog>> {
  const { data } = await apiClient.get(
    `/api/users/${userId}/audit-logs?page=${page}`,
  );
  return data;
}
