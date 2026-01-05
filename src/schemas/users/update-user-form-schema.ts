import z from "zod";
import { registerFormSchema } from "../auth/register-form-schema";

export const updateUserFormSchema = registerFormSchema.omit({
  password: true,
  password_confirmation: true,
});

export type TUpdateUserFormSchema = z.infer<typeof updateUserFormSchema>;
