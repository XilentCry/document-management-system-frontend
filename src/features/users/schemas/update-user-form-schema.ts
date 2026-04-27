import z from "zod";
import { registerFormSchema } from "@/features/auth/schemas/register-form-schema";

export const updateUserFormSchema = (userRole: string) =>
  z
    .object({
      first_name: registerFormSchema.shape.first_name,
      middle_name: registerFormSchema.shape.middle_name,
      last_name: registerFormSchema.shape.last_name,
      email: registerFormSchema.shape.email,
      organization_unit_ids:
        registerFormSchema.shape.organization_unit_ids.optional(),
    })
    .superRefine((data, ctx) => {
      if (
        userRole === "user" &&
        (!data.organization_unit_ids || data.organization_unit_ids.length === 0)
      ) {
        ctx.addIssue({
          path: ["organization_unit_ids"],
          code: "custom",
          message: "Select at least one office or unit.",
        });
      }
    });

export type TUpdateUserFormSchema = z.infer<
  ReturnType<typeof updateUserFormSchema>
>;
