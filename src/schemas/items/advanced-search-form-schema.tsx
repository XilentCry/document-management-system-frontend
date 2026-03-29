import z from "zod";

export const advancedSearchFormSchema = z
  .object({
    type: z.enum(["file", "folder"]).nullable(),
    owner: z.enum(["me", "not_me", "user"]).nullable(),
    owner_id: z.number().int().positive("Invalid owner id.").nullable(),
    classification: z
      .number()
      .int()
      .positive("Invalid classification id.")
      .nullable(),
    itemName: z.string().trim().nonempty("Item name is required."),
  })
  .superRefine((data, ctx) => {
    if (data.owner === "user" && !data.owner_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a specific person.",
        path: ["owner_id"],
      });
    }
  });

export type TAdvancedSearchFormSchema = z.infer<
  typeof advancedSearchFormSchema
>;
