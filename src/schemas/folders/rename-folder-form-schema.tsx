import z from "zod";

export const renameFolderFormSchema = z.object({
  name: z.string().trim().nonempty("Folder name is required."),
});

export type TRenameFolderFormSchema = z.infer<typeof renameFolderFormSchema>;
