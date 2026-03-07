import { z } from "zod";
import { registerFormSchema } from "../auth/register-form-schema";
import { loginFormSchema } from "../auth/login-form-schema";

export const inviteAdminFormSchema = z.object({
  first_name: registerFormSchema.shape.first_name,
  middle_name:  registerFormSchema.shape.middle_name,
  last_name:  registerFormSchema.shape.last_name,
  email: loginFormSchema.shape.email,
});

export type TInviteAdminFormSchema = z.infer<typeof inviteAdminFormSchema>;

