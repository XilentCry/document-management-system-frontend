import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "./selector";
import { persist } from "zustand/middleware";

export interface FolderStore {
  currentParentFolderId: number | null;
  setCurrentParentFolderId: (id: number | null) => void;
}

const folderStore = create<FolderStore>()(
  persist(
    immer((set) => ({
      currentParentFolderId: null,
      setCurrentParentFolderId: (id: number | null) =>
        set({ currentParentFolderId: id }),
    })),
    {
      name: "folder-storage",
    }
  )
);

export const useFolderStore = createSelectors(folderStore);
