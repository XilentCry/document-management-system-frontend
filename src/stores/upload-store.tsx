import { create } from "zustand";

export interface UploadingFile {
  id: string;
  file: File;
  classification: string;
  status: "uploading" | "complete" | "cancelled" | "failed";
  error?: string;
}

interface UploadStore {
  uploadingFiles: UploadingFile[];
  addUpload: (file: UploadingFile) => void;
  updateUpload: (id: string, updates: Partial<UploadingFile>) => void;
  removeUpload: (id: string) => void;
  cancelAll: () => void;
  clearCompleted: () => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
  uploadingFiles: [],

  addUpload: (file) =>
    set((state) => ({
      uploadingFiles: [...state.uploadingFiles, file],
    })),

  updateUpload: (id, updates) =>
    set((state) => ({
      uploadingFiles: state.uploadingFiles.map((file) =>
        file.id === id ? { ...file, ...updates } : file,
      ),
    })),

  removeUpload: (id) =>
    set((state) => ({
      uploadingFiles: state.uploadingFiles.filter((file) => file.id !== id),
    })),

  cancelAll: () =>
    set((state) => ({
      uploadingFiles: state.uploadingFiles.map((file) => {
        if (file.status === "uploading") {
          return { ...file, status: "cancelled" as const };
        }
        return file;
      }),
    })),

  clearCompleted: () =>
    set(() => ({
      uploadingFiles: [],
    })),
}));
