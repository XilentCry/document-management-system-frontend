import z from "zod";

export const shareDocumentFormSchema = z.object({
  share_with: z
    .array(z.string().uuid("Invalid user id."))
    .min(1, "Please select at least one user."),
  share_role_id: z.string().uuid("Please select a share role."),
  allow_download: z.boolean(),
});

export type TShareDocumentFormSchema = z.infer<typeof shareDocumentFormSchema>;
