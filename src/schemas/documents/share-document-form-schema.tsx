import z from "zod";

export const shareDocumentFormSchema = z.object({
  share_with: z
    .array(
      z.object({
        user_id: z.number().int().positive("Invalid user id."),
        share_role_id: z.number().int().positive("Invalid share role id."),
      }),
    )
    .min(1, "Please select at least one user."),
});

export type TShareDocumentFormSchema = z.infer<typeof shareDocumentFormSchema>;
