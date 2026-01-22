import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "./selector";
import { persist } from "zustand/middleware";

export interface ViewModeStore {
  viewMode: string;
  setViewMode: (viewMode: string) => void;
}

const viewModeStore = create<ViewModeStore>()(
  persist(
    immer((set) => ({
      viewMode: "grid",
      setViewMode: (viewMode: string) => set({ viewMode: viewMode }),
    })),
    {
      name: "view-mode-storage",
    },
  ),
);

export const useViewModeStore = createSelectors(viewModeStore);
