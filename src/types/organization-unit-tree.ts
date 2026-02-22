import { TOrganizationUnitBase } from "./organization-unit-base";

export type TOrganizationUnitTree = {
  parent_organization_unit_id: number | null;
  children?: TOrganizationUnitTree[];
} & TOrganizationUnitBase;
