import z from "zod";

export const newFolderFormSchema = z.object({
  name: z.string().trim().nonempty("Name is required."),
  folder_id: z.number().int().positive("Invalid folder id.").nullable(),
  organization_unit_id: z
    .number()
    .int()
    .positive("Invalid organization unit id.")
    .min(1, "Organization unit id is required."),
});

export type TNewFolderFormSchema = z.infer<typeof newFolderFormSchema>;
