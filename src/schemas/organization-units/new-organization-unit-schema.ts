import { z } from "zod";

export const newOrganizationUnitFormSchema = z.object({
  name: z.string().trim().nonempty("Name is required."),
  parent_organization_unit_id: z
    .string({
      message: "Parent organization unit is required.",
    })
    .uuid("Invalid parent organization unit id."),
});

export type TNewOrganizationUnitFormSchema = z.infer<typeof newOrganizationUnitFormSchema>;
