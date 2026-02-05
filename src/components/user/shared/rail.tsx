"use client";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetDocumentDetails } from "@/services/documents/queries";
import { useGetFolderDetails } from "@/services/folders/queries";
import { useGetItemActivities } from "@/services/items/queries";
import { useRailStore } from "@/stores/rail-store";
import { FileText, Folder, X } from "lucide-react";
import { ItemActivityList } from "./item-activity-list";
import { ItemDetails } from "./item-details";
import { ItemDetailsSkeleton } from "./item-details-skeleton";
import { ItemActivitySkeleton } from "./item-activity-skeleton";

export function Rail() {
  const {
    openRail,
    setOpenRail,
    railTab,
    setRailTab,
    selectedDocumentId,
    selectedDocumentFileName,
    selectedFolderId,
    selectedFolderName,
  } = useRailStore();

  const isDocumentSelected = !!selectedDocumentId;
  const isFolderSelected = !!selectedFolderId;

  const documentQuery = useGetDocumentDetails(
    isDocumentSelected ? selectedDocumentId : null,
    railTab === "details",
  );
  const folderQuery = useGetFolderDetails(
    isFolderSelected ? selectedFolderId : null,
    railTab === "details",
  );

  const isLoading = isDocumentSelected
    ? documentQuery.isLoading
    : isFolderSelected
      ? folderQuery.isLoading
      : false;

  const isError = isDocumentSelected
    ? documentQuery.isError
    : isFolderSelected
      ? folderQuery.isError
      : false;

  const error = isDocumentSelected ? documentQuery.error : folderQuery.error;

  const document = isDocumentSelected ? documentQuery.data : null;
  const folder = isFolderSelected ? folderQuery.data : null;

  const activitySubjectId = isDocumentSelected
    ? selectedDocumentId
    : isFolderSelected
      ? selectedFolderId
      : null;

  const {
    isLoading: isItemActivityLoading,
    isError: isItemActivityError,
    error: itemActivityError,
    data: itemActivities = [],
  } = useGetItemActivities(activitySubjectId, railTab === "activity");

  return openRail ? (
    <div className="border-l w-80 sticky top-14 flex flex-col h-[calc(100svh-56px)]">
      <Item>
        <ItemMedia>
          {isDocumentSelected ? (
            <FileText className="size-4" />
          ) : (
            <Folder className="size-4" />
          )}
        </ItemMedia>
        <ItemContent className="min-w-0">
          <ItemTitle className="block w-auto truncate">
            {(document?.name || folder?.name) ??
              (selectedDocumentFileName || selectedFolderName)}
          </ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenRail(false)}
          >
            <X />
          </Button>
        </ItemActions>
      </Item>
      <div className="p-4 pt-0 flex-1 flex flex-col">
        <Tabs
          value={railTab}
          onValueChange={(value) => setRailTab(value as "details" | "activity")}
          className="gap-4 flex-1"
        >
          <TabsList variant="line" className="w-full">
            <TabsTrigger value="details" className="w-1/2">
              Details
            </TabsTrigger>
            <TabsTrigger value="activity" className="w-1/2">
              Activity
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="flex flex-col gap-4">
            {isLoading ? (
              <ItemDetailsSkeleton />
            ) : isError && error ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-destructive text-sm">{error.message}</p>
              </div>
            ) : isDocumentSelected && document ? (
              <ItemDetails item={document} />
            ) : isFolderSelected && folder ? (
              <ItemDetails item={folder} />
            ) : null}
          </TabsContent>
          <TabsContent value="activity" className="flex flex-col gap-4">
            {isItemActivityLoading ? (
              <ItemActivitySkeleton />
            ) : isItemActivityError && itemActivityError ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-destructive text-sm">
                  {itemActivityError.message}
                </p>
              </div>
            ) : (
              <ItemActivityList itemActivities={itemActivities} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  ) : null;
}
