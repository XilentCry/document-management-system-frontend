import { TOrganizationUnitBase } from "./organization-unit-base";

export type TOrganizationUnitFlat = {
  parent: {
    id: string;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
} & TOrganizationUnitBase;
