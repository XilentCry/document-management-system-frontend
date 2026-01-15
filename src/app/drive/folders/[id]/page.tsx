"use client";

import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ItemGrid } from "@/components/user/shared/item-grid";
import { ItemList } from "@/components/user/shared/item-list";
import { UserBreadCrumb } from "@/components/user/shared/user-breadcrumb";
import { useGetFolderItems } from "@/services/folders/queries";
import { useFolderStore } from "@/stores/folder-store";
import { useViewModeStore } from "@/stores/view-mode-store";
import { LayoutGrid, TextAlignJustify } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function FoldersPage() {
  const { id } = useParams<{ id: string }>();

  const {
    isLoading,
    isError,
    error,
    data: folderItems,
  } = useGetFolderItems(id);

  const setCurrentParentFolderId = useFolderStore(
    (state) => state.setCurrentParentFolderId
  );
  const viewMode = useViewModeStore((state) => state.viewMode);
  const setViewMode = useViewModeStore((state) => state.setViewMode);

  useEffect(() => {
    if (folderItems?.currentParentFolderId) {
      setCurrentParentFolderId(folderItems.currentParentFolderId);
    }
  }, [folderItems?.currentParentFolderId, setCurrentParentFolderId]);

  return isLoading ? (
    <div className="flex-1 flex items-center justify-center">
      <Spinner className="text-primary size-9" />
    </div>
  ) : isError && error ? (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-destructive text-sm">{error.message}</p>
    </div>
  ) : (
    folderItems && (
      <div className="flex-1 flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between sticky top-18 bg-background z-10 pb-4">
          <UserBreadCrumb breadcrumb={folderItems.breadcrumb} />
          <ToggleGroup
            variant="outline"
            value={[viewMode]}
            onValueChange={(value) => setViewMode(value[0] as "grid" | "list")}
          >
            <ToggleGroupItem value="list">
              <TextAlignJustify />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid">
              <LayoutGrid />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        {viewMode === "list" && folderItems.data.length ? (
          <ItemList
            data={folderItems.data}
            links={folderItems.links}
            meta={folderItems.meta}
          />
        ) : null}
        {viewMode === "grid" && folderItems.data.length ? (
          <ItemGrid
            data={folderItems.data}
            links={folderItems.links}
            meta={folderItems.meta}
          />
        ) : null}
      </div>
    )
  );
}
