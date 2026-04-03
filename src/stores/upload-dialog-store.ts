import { create } from "zustand";

interface UploadDialogStore {
  isOpen: boolean;
  pendingFiles: File[];
  setIsOpen: (isOpen: boolean) => void;
  openWithFiles: (files: File[]) => void;
  clearPendingFiles: () => void;
  reset: () => void;
}

export const useUploadDialogStore = create<UploadDialogStore>((set) => ({
  isOpen: false,
  pendingFiles: [],
  setIsOpen: (isOpen) => set({ isOpen }),
  openWithFiles: (files) => set({ isOpen: true, pendingFiles: files }),
  clearPendingFiles: () => set({ pendingFiles: [] }),
  reset: () => set({ isOpen: false, pendingFiles: [] }),
}));
