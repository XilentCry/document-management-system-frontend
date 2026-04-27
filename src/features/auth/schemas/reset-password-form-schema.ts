import { z } from "zod";
import { loginFormSchema } from "./login-form-schema";
import { registerFormSchema } from "./register-form-schema";

export const resetPasswordFormSchema = z
  .object({
    token: z.string().min(1, "Reset token is required."),
    email: loginFormSchema.shape.email,
    password: registerFormSchema.shape.password,
    password_confirmation: registerFormSchema.shape.password_confirmation,
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });

export type TResetPasswordFormSchema = z.infer<typeof resetPasswordFormSchema>;
