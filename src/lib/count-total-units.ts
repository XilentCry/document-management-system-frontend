import { TOrganizationUnitTree } from "@/types/organization-unit-tree";

export function countTotalUnits(units?: TOrganizationUnitTree[]): number {
    if (!units) return 0;
    return units.reduce((total, unit) => {
        return total + 1 + countTotalUnits(unit.children || []);
    }, 0);
}