import z from "zod";

export const folderFormSchema = z.object({
  name: z.string().trim().nonempty("Name is required."),
  parent_folder_id: z
    .number()
    .int()
    .positive("Invalid parent folder id.")
    .nullable(),
  organization_unit_id: z
    .number()
    .int()
    .positive("Invalid organization unit id.")
    .min(1, "Organization unit id is required."),
});

export type TFolderFormSchema = z.infer<typeof folderFormSchema>;
