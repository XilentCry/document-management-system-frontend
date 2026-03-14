import z from "zod";

export const uploadFileFormSchema = z.object({
  documents: z
    .array(
      z.object({
        organization_unit_id: z
          .number()
          .int()
          .positive("Invalid organization unit id.")
          .min(1, "Organization unit id is required."),
        classification_id: z
          .number()
          .int()
          .positive("Invalid classification id.")
          .min(1, "Classification id is required."),
        folder_id: z.number().int().positive("Invalid folder id.").nullable(),
        replace_item_id: z.number().int().positive().optional(),
        file: z
          .instanceof(File, { message: "Please select a file." })
          .refine((file) => file.size > 0, "File cannot be empty.")
          .refine(
            (file) => file.size <= 10 * 1024 * 1024,
            "File size must be less than 10MB.",
          )
          .refine(
            (file) =>
              file.type === "application/pdf" ||
              file.name.toLowerCase().endsWith(".pdf"),
            "Only PDF files are allowed.",
          ),
      }),
    )
    .min(1, "At least one file is required."),
});

export type TUploadFileFormSchema = z.infer<typeof uploadFileFormSchema>;

export type TSingleFile = TUploadFileFormSchema["documents"][number];
