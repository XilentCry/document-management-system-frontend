import { z } from "zod";
import { loginFormSchema } from "../auth/login-form-schema";

export const newSubmissionFormSchema = z.object({
  document_id: z.string().min(1, "Document ID is required"),
  template_id: z.string().min(1, "Template ID is required"),
  expire_at: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const d = new Date();
        d.setDate(d.getDate() + 1);
        d.setHours(0, 0, 0, 0);
        return new Date(val) >= d;
      },
      "Expiry date must be at least tomorrow"
    ),
  order: z.enum(["preserved", "random"]).default("preserved"),
  send_email: z.boolean().default(false),
  submitters: z.array(z.object({
    role: z.string().min(1, "Signer role is required"),
    email: loginFormSchema.shape.email,
    order: z.coerce.number().int().min(0, "Order must be 0 or greater").optional()
  })).min(1, "At least one signer is required"),
});

export type TNewSubmissionFormSchema = z.input<typeof newSubmissionFormSchema>;
