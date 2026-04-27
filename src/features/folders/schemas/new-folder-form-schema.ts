import z from "zod";

export const newFolderFormSchema = z.object({
  name: z.string().trim().nonempty("Name is required."),
  folder_id: z.string().uuid("Invalid folder id.").nullable(),
  organization_unit_id: z
    .string({ message: "Organization unit id is required." })
    .uuid("Invalid organization unit id."),
});

export type TNewFolderFormSchema = z.infer<typeof newFolderFormSchema>;
