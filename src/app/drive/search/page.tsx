"use client";

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
import { EmptyState } from "@/components/shared/empty-state";
import { ItemGrid } from "@/components/user/shared/item-grid";
import { ItemList } from "@/components/user/shared/item-list";
import { useSearchOrganizationUnitItems } from "@/services/organization-units/queries";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useSearchStore } from "@/stores/search-store";
import { useViewModeStore } from "@/stores/view-mode-store";
import { LayoutGrid, List, Search as SearchIcon } from "lucide-react";

export default function Search() {
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const filterType = useSearchStore((state) => state.filterType);
  const filterClassification = useSearchStore(
    (state) => state.filterClassification,
  );
  const currentOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.currentOrganizationUnitId,
  );
  const viewMode = useViewModeStore((state) => state.viewMode);
  const setViewMode = useViewModeStore((state) => state.setViewMode);

  const {
    isLoading,
    isError,
    error,
    isSuccess,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchOrganizationUnitItems(
    currentOrganizationUnitId,
    searchTerm,
    filterType,
    filterClassification,
  );

  const organizationUnitItems = data?.pages.flatMap((page) => page.data) ?? [];

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
              <BreadcrumbPage>Search results</BreadcrumbPage>
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
      {isSuccess && organizationUnitItems.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title="None of your files or folders matched this search"
          description="Try another search, or use search options to find a file by type, owner, and more."
        />
      ) : viewMode === "list" ? (
        <InfiniteScrollContainer
          onBottomReached={() =>
            hasNextPage && !isFetchingNextPage && fetchNextPage()
          }
        >
          <ItemList data={organizationUnitItems} />
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
          <ItemGrid data={organizationUnitItems} />
          {isFetchingNextPage && (
            <div className="py-4 flex items-center justify-center">
              <Spinner className="text-primary size-9" />
            </div>
          )}
        </InfiniteScrollContainer>
      )}
      {isError && error && (
        <div className="py-4 flex flex-col items-center justify-center gap-4">
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
    </div>
  );
}
