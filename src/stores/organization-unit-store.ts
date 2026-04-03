import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "./selector";
import { persist } from "zustand/middleware";

export interface OrganizationUnitStore {
  currentOrganizationUnitId: string | null;
  currentOrganizationUnitName: string | null;
  setCurrentOrganizationUnitId: (id: string | null) => void;
  setCurrentOrganizationUnitName: (name: string | null) => void;
  reset: () => void;
}

const organizationUnitStore = create<OrganizationUnitStore>()(
  persist(
    immer((set) => ({
      currentOrganizationUnitId: null,
      currentOrganizationUnitName: null,
      setCurrentOrganizationUnitId: (id: string | null) =>
        set({ currentOrganizationUnitId: id }),
      setCurrentOrganizationUnitName: (name: string | null) =>
        set({ currentOrganizationUnitName: name }),
      reset: () =>
        set({
          currentOrganizationUnitId: null,
          currentOrganizationUnitName: null,
        }),
    })),
    {
      name: "organization-unit-storage",
    },
  ),
);

export const useOrganizationUnitStore = createSelectors(organizationUnitStore);
