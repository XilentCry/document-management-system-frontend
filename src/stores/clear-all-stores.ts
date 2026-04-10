import { useFolderStore } from "./folder-store";
import { useOrganizationUnitStore } from "./organization-unit-store";
import { useRailStore } from "./rail-store";
import { useSearchStore } from "./search-store";
import { useUploadDialogStore } from "./upload-dialog-store";
import { useUploadStore } from "./upload-store";
import { useUserStore } from "./user-store";

export function clearAllStores() {
  useUserStore.getState().reset();
  useOrganizationUnitStore.getState().reset();
  useRailStore.getState().reset();
  useFolderStore.getState().reset();
  useSearchStore.getState().reset();
  useUploadDialogStore.getState().reset();
  useUploadStore.getState().reset();
}
