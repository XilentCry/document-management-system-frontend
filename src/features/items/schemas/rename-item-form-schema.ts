import z from "zod";

export const renameItemFormSchema = z.object({
  name: z.string().trim().nonempty("Name is required."),
});

export type TRenameItemFormSchema = z.infer<typeof renameItemFormSchema>;
