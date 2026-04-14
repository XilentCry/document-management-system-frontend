import z from "zod";

export const advancedSearchFormSchema = z
  .object({
    type: z.enum(["pdf", "folder"]).nullable(),
    owner: z.enum(["me", "not_me", "user"]).nullable(),
    owner_id: z.string().uuid("Invalid owner id.").nullable(),
    classification: z
      .string()
      .uuid("Invalid classification id.")
      .nullable(),
    itemName: z.string().trim().nonempty("Item name is required."),
    shared_to: z.string().uuid("Invalid user id.").nullable().optional(),
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
