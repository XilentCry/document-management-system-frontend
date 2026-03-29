import z from "zod";

export const shareDocumentFormSchema = z.object({
  share_with: z
    .array(z.number().int().positive("Invalid user id."))
    .min(1, "Please select at least one user."),
  share_role_id: z.number().int().positive("Invalid share role id."),
});

export type TShareDocumentFormSchema = z.infer<typeof shareDocumentFormSchema>;
