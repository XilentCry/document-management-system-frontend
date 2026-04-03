"use client";

import { InfiniteScrollContainer } from "@/components/shared/infinite-scroll-container";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { EmptyState } from "@/components/shared/empty-state";
import { ItemGrid } from "@/components/user/shared/item-grid";
import { ItemList } from "@/components/user/shared/item-list";
import { UserBreadCrumb } from "@/components/user/shared/user-breadcrumb";
import { useGetFolderItems } from "@/services/folders/queries";
import { useFolderStore } from "@/stores/folder-store";
import { useViewModeStore } from "@/stores/view-mode-store";
import { DriveDropzone } from "@/components/user/shared/drive-dropzone";
import { Files, LayoutGrid, List } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function FoldersPage() {
  const { id } = useParams<{ id: string }>();

  const {
    isLoading,
    isError,
    error,
    isFetchNextPageError,
    isSuccess,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetFolderItems(id);

  const folderItems = data?.pages.flatMap((page) => page.data) ?? [];
  const currentParentFolderId = data?.pages[0].currentParentFolderId;
  const breadcrumb = data?.pages[0].breadcrumb;

  const setCurrentParentFolderId = useFolderStore(
    (state) => state.setCurrentParentFolderId,
  );
  const viewMode = useViewModeStore((state) => state.viewMode);
  const setViewMode = useViewModeStore((state) => state.setViewMode);

  useEffect(() => {
    if (currentParentFolderId) {
      setCurrentParentFolderId(currentParentFolderId);
    }
  }, [currentParentFolderId, setCurrentParentFolderId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner className="text-primary size-9" />
      </div>
    );
  }

  if (isError && error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-destructive text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 pt-0">
      <div className="flex items-center justify-between sticky top-14 bg-background z-10 py-4">
          {breadcrumb && <UserBreadCrumb breadcrumb={breadcrumb} />}
          <ToggleGroup
            variant="outline"
            value={[viewMode]}
            onValueChange={(value) => {
              if (!value[0]) return;

              setViewMode(value[0] as "grid" | "list");
            }}
          >
            <ToggleGroupItem value="list">
              <List />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid">
              <LayoutGrid />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <DriveDropzone>
          {isSuccess && folderItems.length === 0 ? (
          <EmptyState
            icon={Files}
            title="No items yet"
            description="Files and folders you add will appear here."
          />
        ) : viewMode === "list" ? (
          <InfiniteScrollContainer
            onBottomReached={() =>
              hasNextPage && !isFetchingNextPage && fetchNextPage()
            }
          >
            <ItemList data={folderItems} />
            {isFetchingNextPage && (
              <div className="py-4 flex items-center justify-center">
                <Spinner className="text-primary size-9" />
              </div>
            )}
          </InfiniteScrollContainer>
        ) : (
          <InfiniteScrollContainer
            onBottomReached={() =>
              hasNextPage && !isFetchingNextPage && fetchNextPage()
            }
          >
            <ItemGrid data={folderItems} />
            {isFetchingNextPage && (
              <div className="py-4 flex items-center justify-center">
                <Spinner className="text-primary size-9" />
              </div>
            )}
          </InfiniteScrollContainer>
        )}
        {isFetchNextPageError && error && (
          <div className="py-4 flex-1 flex flex-col items-center justify-center gap-4">
            <p className="text-destructive text-sm">{error.message}</p>
            <Button
              onClick={() =>
                hasNextPage && !isFetchingNextPage && fetchNextPage()
              }
            >
              Retry
            </Button>
          </div>
        )}
      </DriveDropzone>
    </div>
  );
}
