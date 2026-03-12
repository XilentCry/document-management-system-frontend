import z from "zod";

export const advancedSearchFormSchema = z.object({
  type: z.enum(["file", "folder"]).nullable(),
  owner: z.enum(["me", "not_me", "user"]).nullable(),
  owner_id: z.number().int().positive("Invalid owner id.").nullable(),
  classification: z
    .number()
    .int()
    .positive("Invalid classification id.")
    .nullable(),
  itemName: z.string().trim().nonempty("Item name is required."),
});

export type TAdvancedSearchFormSchema = z.infer<
  typeof advancedSearchFormSchema
>;
