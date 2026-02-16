import z from "zod";

export const advancedSearchFormSchema = z.object({
  type: z.enum(["file", "folder"]).nullable(),
  classification: z.number().nullable(),
  itemName: z.string().trim().nonempty("Item name is required."),
});

export type TAdvancedSearchFormSchema = z.infer<
  typeof advancedSearchFormSchema
>;
