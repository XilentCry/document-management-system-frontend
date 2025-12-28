import { getCookie } from "@/lib/get-cookie";
import { TLoginFormSchema } from "@/schemas/auth/login-form-schema";
import { TRegisterFormSchema } from "@/schemas/auth/register-form-schema";
import { TCurrentUser } from "@/types/current-user";
import Cookies from "js-cookie";

export type TLoginResponse = {
  user: TCurrentUser;
  organizationUnitId: number;
};

type TRegisterResponse =
  | { errors: Record<string, string[]> }
  | { message: string };

export async function getCsrfCookie() {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
}

export async function login(
  loginData: TLoginFormSchema
): Promise<TLoginResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(loginData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return {
    user: data.user,
    organizationUnitId: data.organizationUnitId,
  };
}

export async function register(
  registerData: TRegisterFormSchema
): Promise<TRegisterResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(registerData),
    }
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

export async function logout() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
    {
      method: "POST",
      headers: {
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to logout.");
  }

  Cookies.remove("current-organization-unit-id");
}
