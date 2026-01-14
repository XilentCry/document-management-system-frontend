import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "./selector";
import { persist } from "zustand/middleware";

export interface OrganizationUnitStore {
  currentOrganizationUnitId: number | null;
  setCurrentOrganizationUnitId: (id: number | null) => void;
}

const organizationUnitStore = create<OrganizationUnitStore>()(
  persist(
    immer((set) => ({
      currentOrganizationUnitId: null,
      setCurrentOrganizationUnitId: (id: number | null) =>
        set({ currentOrganizationUnitId: id }),
    })),
    {
      name: "organization-unit-storage",
    }
  )
);

export const useOrganizationUnitStore = createSelectors(organizationUnitStore);
