import { create } from "zustand";

interface UploadDialogStore {
  isOpen: boolean;
  pendingFiles: File[];
  replaceItemId: string | null;
  isSharedReplace: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openWithFiles: (files: File[]) => void;
  openForReplacement: (itemId: string, isSharedReplace: boolean) => void;
  clearPendingFiles: () => void;
  reset: () => void;
}

export const useUploadDialogStore = create<UploadDialogStore>((set) => ({
  isOpen: false,
  pendingFiles: [],
  replaceItemId: null,
  isSharedReplace: false,
  setIsOpen: (isOpen) => set({
    isOpen,
    replaceItemId: null,
    pendingFiles: [],
    isSharedReplace: false,
  }),
  openWithFiles: (files) => set({ isOpen: true, pendingFiles: files, replaceItemId: null, isSharedReplace: false }),
  openForReplacement: (itemId, isSharedReplace) => set({ isOpen: true, replaceItemId: itemId, pendingFiles: [], isSharedReplace }),
  clearPendingFiles: () => set({ pendingFiles: [] }),
  reset: () => set({ isOpen: false, pendingFiles: [], replaceItemId: null, isSharedReplace: false }),
}));
