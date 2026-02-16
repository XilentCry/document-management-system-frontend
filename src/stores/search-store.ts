import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "./selector";
import { TFilterType } from "@/types/filter-type";

export interface SearchStore {
  draftSearchTerm: string;
  searchTerm: string | null;
  filterType: TFilterType | null;
  filterClassification: number | null;
  setDraftSearchTerm: (draftSearchTerm: string) => void;
  commitSearch: (
    searchTerm: string,
    filterType?: TFilterType | null,
    filterClassification?: number | null,
  ) => void;
  resetSearch: () => void;
}

const searchStore = create<SearchStore>()(
  immer((set) => ({
    draftSearchTerm: "",
    searchTerm: null,
    filterType: null,
    filterClassification: null,

    setDraftSearchTerm: (draftSearchTerm) => set({ draftSearchTerm }),

    commitSearch: (
      searchTerm,
      filterType = null,
      filterClassification = null,
    ) =>
      set({
        searchTerm,
        filterType,
        filterClassification,
      }),

    resetSearch: () =>
      set({
        draftSearchTerm: "",
        searchTerm: null,
        filterType: null,
        filterClassification: null,
      }),
  })),
);

export const useSearchStore = createSelectors(searchStore);
