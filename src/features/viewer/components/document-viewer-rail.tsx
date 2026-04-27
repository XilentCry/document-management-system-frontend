"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetDocumentDetails } from "@/features/documents/api/queries";
import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { ItemDetails } from "@/features/items/components/item-details";
import { ItemDetailsSkeleton } from "@/features/items/components/item-details-skeleton";
import { TTrashedItem } from "@/features/trash/types/trash-item";
import { TrashItemDetails } from "@/features/trash/components/trash-item-details";

export function DocumentViewerRail({
  documentId,
  openRail,
  setOpenRail,
  isTrash,
  item,
}: {
  documentId: string;
  openRail: boolean;
  setOpenRail: Dispatch<SetStateAction<boolean>>;
  isTrash?: boolean;
  item?: TTrashedItem;
}) {
  const documentQuery = useGetDocumentDetails(
    documentId,
    true,
    openRail && !isTrash,
  );

  return (
    <div className="bg-background border-l w-80 flex flex-col h-full">
      <div className="h-14 flex items-center justify-between px-4 border-b">
        <h2 className="text-sm font-medium leading-snug">Details</h2>
        <Button variant="ghost" size="icon" onClick={() => setOpenRail(false)}>
          <X />
        </Button>
      </div>
      <div className="min-h-0 p-4 flex-1 flex flex-col text-sm">
        {isTrash && item ? (
          <ScrollArea className="flex-1 min-h-0">
            <div className="flex flex-col gap-4">
              <TrashItemDetails item={item} />
            </div>
          </ScrollArea>
        ) : documentQuery.isLoading ? (
          <ScrollArea className="flex-1 min-h-0">
            <ItemDetailsSkeleton />
          </ScrollArea>
        ) : documentQuery.isError && documentQuery.error ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-destructive text-sm">
              {documentQuery.error.message}
            </p>
          </div>
        ) : documentQuery.data ? (
          <ScrollArea className="flex-1 min-h-0">
            <div className="flex flex-col gap-4">
              <ItemDetails item={documentQuery.data} />
            </div>
          </ScrollArea>
        ) : null}
      </div>
    </div>
  );
}
