import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "./selector";

export interface SearchStore {
  draftSearchTerm: string;
  setDraftSearchTerm: (draftSearchTerm: string) => void;
}

const searchStore = create<SearchStore>()(
  immer((set) => ({
    draftSearchTerm: "",
    setDraftSearchTerm: (draftSearchTerm) => set({ draftSearchTerm }),
  })),
);

export const useSearchStore = createSelectors(searchStore);
