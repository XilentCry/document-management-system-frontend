import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "./selector";

export interface FolderStore {
  currentParentFolderId: string | null;
  setCurrentParentFolderId: (id: string | null) => void;
  reset: () => void;
}

const folderStore = create<FolderStore>()(
  immer((set) => ({
    currentParentFolderId: null,
    setCurrentParentFolderId: (id: string | null) =>
      set({ currentParentFolderId: id }),
    reset: () => set({ currentParentFolderId: null }),
  })),
);

export const useFolderStore = createSelectors(folderStore);
