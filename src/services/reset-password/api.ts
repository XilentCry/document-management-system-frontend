import { getCookie } from "@/lib/get-cookie";
import { TForgotPasswordFormSchema } from "@/schemas/auth/forgot-password-form-schema";
import { TResetPasswordFormSchema } from "@/schemas/auth/reset-password-form-schema";

export async function forgotPassword(
  forgotPasswordData: TForgotPasswordFormSchema,
): Promise<{ message: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password`,
    {
      method: "POST",
      headers: {
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(forgotPasswordData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return { message: data.message };
}

export async function resetPassword(
  resetPasswordData: TResetPasswordFormSchema,
): Promise<{ message: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`,
    {
      method: "POST",
      headers: {
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(resetPasswordData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return { message: data.message };
}

