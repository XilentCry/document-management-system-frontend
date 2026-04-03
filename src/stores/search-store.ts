import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "./selector";

export interface SearchStore {
  draftSearchTerm: string;
  setDraftSearchTerm: (draftSearchTerm: string) => void;
  reset: () => void;
}

const searchStore = create<SearchStore>()(
  immer((set) => ({
    draftSearchTerm: "",
    setDraftSearchTerm: (draftSearchTerm) => set({ draftSearchTerm }),
    reset: () => set({ draftSearchTerm: "" }),
  })),
);

export const useSearchStore = createSelectors(searchStore);
