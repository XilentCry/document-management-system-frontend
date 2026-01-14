import { getCookie } from "@/lib/get-cookie";
import { TLoginFormSchema } from "@/schemas/auth/login-form-schema";
import { TRegisterFormSchema } from "@/schemas/auth/register-form-schema";
import { TCurrentUser } from "@/types/current-user";

export type TLoginResponse = {
  user: TCurrentUser;
  organizationUnitId?: number;
};

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
    const error = new Error(data.message) as Error & {
      code?: string;
    };
    error.code = data.code;
    throw error;
  }

  return data;
}

export async function register(
  registerData: TRegisterFormSchema
): Promise<{ message: string }> {
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
      throw { errors: data.errors };
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
        Accept: "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to logout.");
  }
}

export async function resendVerificationEmail(): Promise<{ message: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/email/verification-notification`,
    {
      method: "POST",
      headers: {
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message) as Error & {
      code?: string;
    };
    error.code = data.code;
    throw error;
  }

  return data;
}
