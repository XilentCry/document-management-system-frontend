import { z } from "zod";
import { loginFormSchema } from "./login-form-schema";

export const forgotPasswordFormSchema = z.object({
  email: loginFormSchema.shape.email,
});

export type TForgotPasswordFormSchema = z.infer<
  typeof forgotPasswordFormSchema
>;
