import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "./selector";

export interface RailStore {
  openRail: boolean;
  railTab: string;
  selectedDocumentId: string | null;
  selectedDocumentFileName: string | null;
  selectedFolderId: string | null;
  selectedFolderName: string | null;
  setOpenRail: (openRail: boolean) => void;
  setRailTab: (tab: "details" | "activity") => void;
  setSelectedDocumentId: (documentId: string | null) => void;
  setSelectedDocumentFileName: (fileName: string | null) => void;
  setSelectedFolderId: (folderId: string | null) => void;
  setSelectedFolderName: (folderName: string | null) => void;
  reset: () => void;
}

const initialState = {
  openRail: false,
  railTab: "details",
  selectedDocumentId: null,
  selectedDocumentFileName: null,
  selectedFolderId: null,
  selectedFolderName: null,
};

const railStore = create<RailStore>()(
  immer((set) => ({
    ...initialState,
    setOpenRail: (openRail: boolean) => set({ openRail }),
    setRailTab: (tab: "details" | "activity") => set({ railTab: tab }),
    setSelectedDocumentId: (documentId: string | null) =>
      set({ selectedDocumentId: documentId }),
    setSelectedDocumentFileName: (fileName: string | null) =>
      set({ selectedDocumentFileName: fileName }),
    setSelectedFolderId: (folderId: string | null) =>
      set({ selectedFolderId: folderId }),
    setSelectedFolderName: (folderName: string | null) =>
      set({ selectedFolderName: folderName }),
    reset: () => set(initialState),
  })),
);

export const useRailStore = createSelectors(railStore);
