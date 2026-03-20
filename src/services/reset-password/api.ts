import apiClient from "@/lib/api-client";
import { TForgotPasswordFormSchema } from "@/schemas/auth/forgot-password-form-schema";
import { TResetPasswordFormSchema } from "@/schemas/auth/reset-password-form-schema";

export async function forgotPassword(
  forgotPasswordData: TForgotPasswordFormSchema,
): Promise<{ message: string }> {
  const { data } = await apiClient.post(
    "/auth/forgot-password",
    forgotPasswordData,
  );
  return { message: data.message };
}

export async function resetPassword(
  resetPasswordData: TResetPasswordFormSchema,
): Promise<{ message: string }> {
  const { data } = await apiClient.post(
    "/auth/reset-password",
    resetPasswordData,
  );
  return { message: data.message };
}
