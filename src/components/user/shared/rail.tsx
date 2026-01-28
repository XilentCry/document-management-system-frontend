"use client";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetDocumentDetails } from "@/services/documents/queries";
import { useGetFolderDetails } from "@/services/folders/queries";
import { useRailStore } from "@/stores/rail-store";
import { FileText, Folder, X } from "lucide-react";
import { ItemDetails } from "./item-details";

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
  );
  const folderQuery = useGetFolderDetails(
    isFolderSelected ? selectedFolderId : null,
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

  return openRail ? (
    <div className="border-l w-80 sticky top-14">
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
      <div className="p-4 pt-0">
        <Tabs
          value={railTab}
          onValueChange={(value) => setRailTab(value as "details" | "activity")}
          className="gap-4"
        >
          <TabsList variant="line" className="w-full">
            <TabsTrigger value="details" className="w-1/2">
              Details
            </TabsTrigger>
            <TabsTrigger value="activity" className="w-1/2">
              Activity
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="text-sm flex flex-col gap-4">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Spinner className="text-primary size-9" />
              </div>
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
          <TabsContent value="activity">Activity</TabsContent>
        </Tabs>
      </div>
    </div>
  ) : null;
}
