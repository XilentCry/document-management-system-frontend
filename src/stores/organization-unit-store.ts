import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "./selector";
import { persist } from "zustand/middleware";

export interface OrganizationUnitStore {
  currentOrganizationUnitId: number | null;
  currentOrganizationUnitName: string | null;
  setCurrentOrganizationUnitId: (id: number | null) => void;
  setCurrentOrganizationUnitName: (name: string | null) => void;
}

const organizationUnitStore = create<OrganizationUnitStore>()(
  persist(
    immer((set) => ({
      currentOrganizationUnitId: null,
      currentOrganizationUnitName: null,
      setCurrentOrganizationUnitId: (id: number | null) =>
        set({ currentOrganizationUnitId: id }),
      setCurrentOrganizationUnitName: (name: string | null) =>
        set({ currentOrganizationUnitName: name }),
    })),
    {
      name: "organization-unit-storage",
    },
  ),
);

export const useOrganizationUnitStore = createSelectors(organizationUnitStore);
