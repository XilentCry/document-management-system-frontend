import z from "zod";

export const shareDocumentFormSchema = z.object({
  share_with: z
    .array(z.string().uuid("Invalid user id."))
    .min(1, "Please select at least one user."),
});

export type TShareDocumentFormSchema = z.infer<typeof shareDocumentFormSchema>;
