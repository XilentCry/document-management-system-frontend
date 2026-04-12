import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "./selector";

export interface OrganizationUnitStore {
  currentOrganizationUnitId: string | null;
  currentOrganizationUnitName: string | null;
  setCurrentOrganizationUnitId: (id: string | null) => void;
  setCurrentOrganizationUnitName: (name: string | null) => void;
  reset: () => void;
}

const organizationUnitStore = create<OrganizationUnitStore>()(
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
);

export const useOrganizationUnitStore = createSelectors(organizationUnitStore);
