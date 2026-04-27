import { z } from "zod";

export const changeClassificationFormSchema = z.object({
  classification_id: z.string().uuid("Please select a valid classification."),
});

export type TChangeClassificationFormSchema = z.infer<
  typeof changeClassificationFormSchema
>;
