import apiClient from "@/lib/api-client";
import { isAxiosError } from "axios";
import { TLoginFormSchema } from "@/schemas/auth/login-form-schema";
import { TRegisterFormSchema } from "@/schemas/auth/register-form-schema";
import { TCurrentUser } from "@/types/current-user";

type TErrorResponse = {
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
};

export type TLoginResponse = {
  message: string;
  user: TCurrentUser;
  currentOrganizationUnitId?: number;
  currentOrganizationUnitName?: string;
  lastLogin: string;
  lastFailedLogin: string;
};

export async function getCsrfCookie() {
  await apiClient.get("/sanctum/csrf-cookie");
}

export async function login(
  loginData: TLoginFormSchema,
): Promise<TLoginResponse> {
  try {
    const { data } = await apiClient.post("/auth/login", loginData);
    return data;
  } catch (error: unknown) {
    if (isAxiosError<TErrorResponse>(error)) {
      const err = new Error(error.response?.data?.message) as Error & {
        code?: string;
      };
      err.code = error.response?.data?.code;
      throw err;
    }
    throw error;
  }
}

export async function register(
  registerData: TRegisterFormSchema,
): Promise<{ message: string }> {
  try {
    const { data } = await apiClient.post("/auth/register", registerData);
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

export async function logout(): Promise<{ message: string }> {
  const { data } = await apiClient.post("/auth/logout");
  return data;
}

export async function resendVerificationEmail(): Promise<{ message: string }> {
  try {
    const { data } = await apiClient.post(
      "/auth/email/verification-notification",
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError<TErrorResponse>(error)) {
      const err = new Error(
        error.response?.data?.message,
      ) as Error & { code?: string };
      err.code = error.response?.data?.code;
      throw err;
    }
    throw error;
  }
}
