import { z } from "zod";
import { loginFormSchema } from "./login-form-schema";

export const registerFormSchema = loginFormSchema
  .extend({
    password: loginFormSchema.shape.password
      .min(8, "Password must be at least 8 characters.")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one symbol."),
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
