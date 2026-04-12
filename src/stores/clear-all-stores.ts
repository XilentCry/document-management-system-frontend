import { useFolderStore } from "./folder-store";
import { useOrganizationUnitStore } from "./organization-unit-store";
import { useRailStore } from "./rail-store";
import { useSearchStore } from "./search-store";
import { useUploadDialogStore } from "./upload-dialog-store";
import { useUploadStore } from "./upload-store";

export function clearAllStores() {
  useOrganizationUnitStore.getState().reset();
  useRailStore.getState().reset();
  useFolderStore.getState().reset();
  useSearchStore.getState().reset();
  useUploadDialogStore.getState().reset();
  useUploadStore.getState().reset();
}
