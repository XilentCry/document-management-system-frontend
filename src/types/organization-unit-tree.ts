import { TOrganizationUnitBase } from "./organization-unit-base";

export type TOrganizationUnitTree = {
  parent_organization_unit_id: string | null;
  children?: TOrganizationUnitTree[];
} & TOrganizationUnitBase;
