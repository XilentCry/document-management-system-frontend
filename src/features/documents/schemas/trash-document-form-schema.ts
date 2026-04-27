import { z } from "zod";

export const trashDocumentFormSchema = z.object({
  remarks: z
    .string()
    .min(5, "Remarks must be at least 5 characters.")
    .max(100, "Remarks must not exceed 100 characters."),
});

export type TTrashDocumentFormSchema = z.infer<typeof trashDocumentFormSchema>;
