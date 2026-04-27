import { TOrganizationUnitTree } from "@/features/organization-units/types/organization-unit-tree";

export function filterTree(
  units: TOrganizationUnitTree[],
  query: string
): TOrganizationUnitTree[] {
  if (!query) return units;
  const lower = query.toLowerCase();

  return units
    .map((unit) => {
      const children = unit.children
        ? filterTree(unit.children, query)
        : [];
      if (unit.name.toLowerCase().includes(lower) || children.length > 0) {
        return { ...unit, children };
      }
      return null;
    })
    .filter(Boolean) as TOrganizationUnitTree[];
}
