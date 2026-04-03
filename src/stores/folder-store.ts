import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "./selector";
import { persist } from "zustand/middleware";

export interface FolderStore {
  currentParentFolderId: string | null;
  setCurrentParentFolderId: (id: string | null) => void;
  reset: () => void;
}

const folderStore = create<FolderStore>()(
  persist(
    immer((set) => ({
      currentParentFolderId: null,
      setCurrentParentFolderId: (id: string | null) =>
        set({ currentParentFolderId: id }),
      reset: () => set({ currentParentFolderId: null }),
    })),
    {
      name: "folder-storage",
    }
  )
);

export const useFolderStore = createSelectors(folderStore);
