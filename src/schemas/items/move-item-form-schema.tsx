import z from "zod";

export const moveItemFormSchema = z.object({
  parent_folder_id: z
    .number()
    .int()
    .positive("Invalid parent folder id.")
    .nullable(),
});

export type TMoveItemFormSchema = z.infer<typeof moveItemFormSchema>;
