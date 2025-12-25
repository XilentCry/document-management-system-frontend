export type TOrganizationUnit = {
  id: number;
  name: string;
  parent_organization_unit_id: number | null;
  children?: TOrganizationUnit[];
};
