"use client";

import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FolderGrid } from "@/components/user/shared/folder-grid";
import { FolderList } from "@/components/user/shared/folder-list";
import { UserBreadCrumb } from "@/components/user/shared/user-breadcrumb";
import { useGetFolderContents } from "@/services/folders/queries";
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
    data: folderContents,
  } = useGetFolderContents(id);

  const setCurrentParentFolderId = useFolderStore(
    (state) => state.setCurrentParentFolderId
  );
  const viewMode = useViewModeStore((state) => state.viewMode);
  const setViewMode = useViewModeStore((state) => state.setViewMode);

  useEffect(() => {
    if (folderContents?.id) {
      setCurrentParentFolderId(folderContents.id);
    }
  }, [folderContents?.id, setCurrentParentFolderId]);

  return isLoading ? (
    <div className="flex-1 flex items-center justify-center">
      <Spinner className="text-primary size-9" />
    </div>
  ) : isError && error ? (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-destructive text-sm">{error.message}</p>
    </div>
  ) : (
    folderContents && (
      <div className="flex-1 flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <UserBreadCrumb breadcrumb={folderContents.breadcrumb} />
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
        {viewMode === "list" && folderContents.children?.length ? (
          <FolderList folders={folderContents.children} />
        ) : null}
        {viewMode === "grid" && folderContents.children?.length ? (
          <FolderGrid folders={folderContents.children} />
        ) : null}
      </div>
    )
  );
}
