import { z } from "zod";
import { newOrganizationUnitFormSchema } from "./new-organization-unit-schema";

export const editOrganizationUnitFormSchema = newOrganizationUnitFormSchema;

export type TEditOrganizationUnitFormSchema = z.infer<typeof editOrganizationUnitFormSchema>;
