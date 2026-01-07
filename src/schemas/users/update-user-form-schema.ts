import z from "zod";
import { registerFormSchema } from "../auth/register-form-schema";

export const updateUserFormSchema = z.object({
  first_name: registerFormSchema.shape.first_name,
  middle_name: registerFormSchema.shape.middle_name,
  last_name: registerFormSchema.shape.last_name,
  organization_unit_ids: registerFormSchema.shape.organization_unit_ids,
  email: registerFormSchema.shape.email,
});

export type TUpdateUserFormSchema = z.infer<typeof updateUserFormSchema>;
