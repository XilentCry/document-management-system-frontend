import z from "zod";

export const allowDownloadsFormSchema = z.object({
  allow_download_with: z
    .array(z.string().uuid("Invalid user id."))
    .min(1, "Please select at least one user."),
});

export type TAllowDownloadsFormSchema = z.infer<typeof allowDownloadsFormSchema>;
