import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "./selector";
import { persist } from "zustand/middleware";

export interface RailStore {
  openRail: boolean;
  railTab: string;
  selectedDocumentId: number | null;
  selectedDocumentFileName: string | null;
  selectedFolderId: number | null;
  selectedFolderName: string | null;
  setOpenRail: (openRail: boolean) => void;
  setRailTab: (tab: "details" | "activity") => void;
  setSelectedDocumentId: (documentId: number | null) => void;
  setSelectedDocumentFileName: (fileName: string | null) => void;
  setSelectedFolderId: (folderId: number | null) => void;
  setSelectedFolderName: (folderName: string | null) => void;
}

const railStore = create<RailStore>()(
  persist(
    immer((set) => ({
      openRail: false,
      railTab: "details",
      selectedDocumentId: null,
      selectedDocumentFileName: null,
      selectedFolderId: null,
      selectedFolderName: null,
      setOpenRail: (openRail: boolean) => set({ openRail }),
      setRailTab: (tab: "details" | "activity") => set({ railTab: tab }),
      setSelectedDocumentId: (documentId: number | null) =>
        set({ selectedDocumentId: documentId }),
      setSelectedDocumentFileName: (fileName: string | null) =>
        set({ selectedDocumentFileName: fileName }),
      setSelectedFolderId: (folderId: number | null) =>
        set({ selectedFolderId: folderId }),
      setSelectedFolderName: (folderName: string | null) =>
        set({ selectedFolderName: folderName }),
    })),
    {
      name: "rail-storage",
    },
  ),
);

export const useRailStore = createSelectors(railStore);
