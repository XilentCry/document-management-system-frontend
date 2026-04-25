"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { InfiniteScrollContainer } from "@/components/shared/infinite-scroll-container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TrashDocumentGrid } from "@/components/user/trash/trash-document-grid";
import { TrashDocumentList } from "@/components/user/trash/trash-document-list";
import { useGetTrashedDocuments } from "@/services/documents/queries";
import { useViewModeStore } from "@/stores/view-mode-store";
import { LayoutGrid, List, Trash2 } from "lucide-react";

export default function TrashPage() {
  const viewMode = useViewModeStore((state) => state.viewMode);
  const setViewMode = useViewModeStore((state) => state.setViewMode);

  const {
    isLoading,
    isError,
    isFetchNextPageError,
    error,
    isSuccess,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetTrashedDocuments();

  const trashedItems = data?.pages.flatMap((page) => page.data) ?? [];

  if (isError && error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-destructive text-sm">{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner className="text-primary size-9" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 pt-0 min-w-0">
      <div className="flex items-center justify-between sticky top-14 bg-background z-10 py-4">
        <Breadcrumb>
          <BreadcrumbList className="text-xl">
            <BreadcrumbItem>
              <BreadcrumbPage>Trash</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
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

      {isSuccess && trashedItems.length === 0 ? (
        <EmptyState
          icon={Trash2}
          title="Trash is empty"
          description="Documents you move to trash will appear here."
        />
      ) : viewMode === "list" ? (
        <InfiniteScrollContainer
          onBottomReached={() =>
            hasNextPage && !isFetchingNextPage && fetchNextPage()
          }
        >
          <TrashDocumentList data={trashedItems} />
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
          <TrashDocumentGrid data={trashedItems} />
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
            variant="outline"
            onClick={() =>
              hasNextPage && !isFetchingNextPage && fetchNextPage()
            }
          >
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}