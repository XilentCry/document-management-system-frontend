import { useFolderStore } from "@/features/drive/store/folder-store";
import { useOrganizationUnitStore } from "@/features/organization-units/store/organization-unit-store";
import { useRailStore } from "@/features/drive/store/rail-store";
import { useSearchStore } from "@/features/search/store/search-store";
import { useSubmittersRailStore } from "@/features/submissions/store/submitters-rail-store";
import { useUploadDialogStore } from "@/features/uploads/store/upload-dialog-store";
import { useUploadStore } from "@/features/uploads/store/upload-store";

export function clearAllStores() {
  useOrganizationUnitStore.getState().reset();
  useRailStore.getState().reset();
  useSubmittersRailStore.getState().reset();
  useFolderStore.getState().reset();
  useSearchStore.getState().reset();
  useUploadDialogStore.getState().reset();
  useUploadStore.getState().reset();
}
