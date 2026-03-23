import { z } from "zod";

export const newOrganizationUnitFormSchema = z.object({
  name: z.string().trim().nonempty("Name is required."),
  parent_organization_unit_id: z
    .number({
      message: "Parent organization unit is required.",
    })
    .int("Invalid parent organization unit id.")
    .positive("Invalid parent organization unit id."),
});

export type TNewOrganizationUnitFormSchema = z.infer<typeof newOrganizationUnitFormSchema>;
