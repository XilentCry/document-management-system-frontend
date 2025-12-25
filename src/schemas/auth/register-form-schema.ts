import { z } from "zod";
import { loginFormSchema } from "./login-form-schema";

export const registerFormSchema = loginFormSchema
  .extend({
    password: loginFormSchema.shape.password.min(
      8,
      "Password must be at least 8 characters."
    ),
    first_name: z
      .string()
      .trim()
      .nonempty("First name is required.")
      .max(50, "First name must be at most 50 characters."),
    middle_name: z
      .string()
      .trim()
      .max(50, "Middle name must be at most 50 characters.")
      .optional(),
    last_name: z
      .string()
      .trim()
      .nonempty("Last name is required.")
      .max(50, "Last name must be at most 50 characters."),
    organization_unit_ids: z
      .array(z.number().int().positive("Invalid organization unit id."))
      .min(1, "Select at least one office or unit."),
    password_confirmation: z
      .string()
      .trim()
      .nonempty("Password confirmation is required."),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });

export type TRegisterFormSchema = z.infer<typeof registerFormSchema>;
