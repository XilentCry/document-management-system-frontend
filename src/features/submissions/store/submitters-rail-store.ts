import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "@/stores/selector";

export interface SubmittersRailStore {
  openRail: boolean;
  selectedSubmissionId: number | null;
  selectedSubmissionName: string | null;
  setOpenRail: (openRail: boolean) => void;
  setSelectedSubmissionId: (id: number | null) => void;
  setSelectedSubmissionName: (name: string | null) => void;
  reset: () => void;
}

const initialState = {
  openRail: false,
  selectedSubmissionId: null,
  selectedSubmissionName: null,
};

const submittersRailStore = create<SubmittersRailStore>()(
  immer((set) => ({
    ...initialState,
    setOpenRail: (openRail) => set({ openRail }),
    setSelectedSubmissionId: (id) => set({ selectedSubmissionId: id }),
    setSelectedSubmissionName: (name) => set({ selectedSubmissionName: name }),
    reset: () => set(initialState),
  })),
);

export const useSubmittersRailStore = createSelectors(submittersRailStore);
