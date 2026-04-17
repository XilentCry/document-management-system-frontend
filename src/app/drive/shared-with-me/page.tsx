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
import { SharedDocumentGrid } from "@/components/user/shared-with-me/shared-document-grid";
import { SharedDocumentList } from "@/components/user/shared-with-me/shared-document-list";
import { useGetAllSharedWithMe } from "@/services/user/queries";
import { useViewModeStore } from "@/stores/view-mode-store";
import { Files, LayoutGrid, List } from "lucide-react";

export default function SharedWithMePage() {
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
  } = useGetAllSharedWithMe();

  const sharedDocuments = data?.pages.flatMap((page) => page.data) ?? [];

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
    <div className="flex-1 flex flex-col p-4 pt-0">
      <div className="flex items-center justify-between sticky top-14 bg-background z-10 py-4">
        <Breadcrumb>
          <BreadcrumbList className="text-xl">
            <BreadcrumbItem>
              <BreadcrumbPage>Shared with me</BreadcrumbPage>
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
      {isSuccess && sharedDocuments.length === 0 ? (
        <EmptyState
          icon={Files}
          title="No shared files yet"
          description="Shared files will appear here."
        />
      ) : viewMode === "list" ? (
        <InfiniteScrollContainer
          onBottomReached={() =>
            hasNextPage && !isFetchingNextPage && fetchNextPage()
          }
        >
          <SharedDocumentList data={sharedDocuments} />
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
          <SharedDocumentGrid data={sharedDocuments} />
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
