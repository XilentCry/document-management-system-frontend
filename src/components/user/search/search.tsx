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
import { SearchGrid } from "./search-grid";
import { useSearchOrganizationUnitItems } from "@/services/organization-units/queries";
import { useCurrentUser } from "@/services/user/queries";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useSearchStore } from "@/stores/search-store";
import { useViewModeStore } from "@/stores/view-mode-store";
import { TFilterType } from "@/types/filter-type";
import { LayoutGrid, List, Search as SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { SearchResultList } from "./search-result-list";
import { TFilterOwner } from "@/types/filter-owner";
import { TItem } from "@/types/item";
import { useState } from "react";
import { DocumentViewer } from "../shared/document-viewer";
import { SharedDocumentViewer } from "../shared-with-me/shared-document-viewer";
import { TSharedWithMe } from "@/types/shared-with-me";

export function Search() {
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("q");
  const filterTypeParam = searchParams.get("type");
  const filterType: TFilterType =
    filterTypeParam === "pdf" || filterTypeParam === "folder"
      ? filterTypeParam
      : null;
  const filterClassificationStr = searchParams.get("classification");
  const filterClassification = filterClassificationStr || null;
  const filterOwnerParam = searchParams.get("owner");
const filterOwner: TFilterOwner =
  filterOwnerParam === "me" || filterOwnerParam === "not_me" || filterOwnerParam === "user"
    ? filterOwnerParam
    : null;
const filterOwnerIdStr = searchParams.get("owner_id");
const filterOwnerId = filterOwnerIdStr || null;
const filterSharedToStr = searchParams.get("shared_to");
const filterSharedTo = filterSharedToStr || null;

  const { data: currentUser } = useCurrentUser();
  const storeOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.currentOrganizationUnitId,
  );
  const currentOrganizationUnitId = storeOrganizationUnitId ?? currentUser?.currentOrganizationUnitId ?? null;
  const viewMode = useViewModeStore((state) => state.viewMode);
  const setViewMode = useViewModeStore((state) => state.setViewMode);
  const setDraftSearchTerm = useSearchStore(
    (state) => state.setDraftSearchTerm,
  );

  const [openDocumentViewer, setOpenDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TItem | null>(null);

  const handleDocumentDoubleClick = async (document: TItem) => {
    setSelectedDocument(document);
    setOpenDocumentViewer(true);
  };

  useEffect(() => {
    if (searchTerm) {
      setDraftSearchTerm(searchTerm);
    }
  }, [searchTerm, setDraftSearchTerm]);

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
  } = useSearchOrganizationUnitItems(
    currentOrganizationUnitId,
    searchTerm,
    filterType,
    filterClassification,
    filterOwner,
    filterOwnerId,
    filterSharedTo,
  );

  const organizationUnitItems = data?.pages.flatMap((page) => page.data) ?? [];

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
    <div className="flex-1 flex flex-col p-4 pt-0 min-w-0">
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
          description="Try another search, or use search options to find a file by type, classification, and more."
        />
      ) : viewMode === "list" ? (
        <InfiniteScrollContainer
          onBottomReached={() =>
            hasNextPage && !isFetchingNextPage && fetchNextPage()
          }
        >
          <SearchResultList
            data={organizationUnitItems}
            onDocumentDoubleClick={handleDocumentDoubleClick}
            openDocumentViewer={openDocumentViewer}
            setOpenDocumentViewer={setOpenDocumentViewer}
            selectedDocument={selectedDocument}
          />
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
          <SearchGrid
            data={organizationUnitItems}
            onDocumentDoubleClick={handleDocumentDoubleClick}
          />
          {isFetchingNextPage && (
            <div className="py-4 flex items-center justify-center">
              <Spinner className="text-primary size-9" />
            </div>
          )}
        </InfiniteScrollContainer>
      )}
      {isFetchNextPageError && error && (
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
      {openDocumentViewer && selectedDocument && (
        selectedDocument.share_permissions ? (
          <SharedDocumentViewer
            openDocumentViewer={openDocumentViewer}
            setOpenDocumentViewer={setOpenDocumentViewer}
            sharedDocument={{
              id: selectedDocument.id,
              item: selectedDocument,
              share_permissions: selectedDocument.share_permissions,
              shared_by: selectedDocument.owner,
              created_at: selectedDocument.created_at ?? "",
              raw_created_at: selectedDocument.updated_at,
            } as TSharedWithMe}
          />
        ) : (
          <DocumentViewer
            openDocumentViewer={openDocumentViewer}
            setOpenDocumentViewer={setOpenDocumentViewer}
            document={selectedDocument}
          />
        )
      )}
    </div>
  );
}
