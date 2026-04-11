import { create } from "zustand";

interface UploadDialogStore {
  isOpen: boolean;
  pendingFiles: File[];
  replaceItemId: string | null;
  setIsOpen: (isOpen: boolean) => void;
  openWithFiles: (files: File[]) => void;
  openForReplacement: (itemId: string) => void;
  clearPendingFiles: () => void;
  reset: () => void;
}

export const useUploadDialogStore = create<UploadDialogStore>((set) => ({
  isOpen: false,
  pendingFiles: [],
  replaceItemId: null,
  setIsOpen: (isOpen) => set({
    isOpen,
    replaceItemId: null,
    pendingFiles: [],
  }),
  openWithFiles: (files) => set({ isOpen: true, pendingFiles: files, replaceItemId: null }),
  openForReplacement: (itemId) => set({ isOpen: true, replaceItemId: itemId, pendingFiles: [] }),
  clearPendingFiles: () => set({ pendingFiles: [] }),
  reset: () => set({ isOpen: false, pendingFiles: [], replaceItemId: null }),
}));
