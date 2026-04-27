"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TItem } from "@/features/items/types/item";
import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { ItemDetails } from "@/features/items/components/item-details";
import { TDocumentVersion } from "@/features/documents/types/document-version";

export function PublicDocumentViewerRail({
  document,
  setOpenRail,
}: {
  document: Pick<
    TItem,
    "id" | "name" | "type" | "owner" | "created_at" | "updated_at" | "updated_by"
  > & {
    classification: string;
    current_version: Omit<TDocumentVersion, "item" | "created_at" | "created_by"> & {
      item_id: string;
    };
  };
  setOpenRail: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="border-l w-80 flex flex-col h-[calc(100vh-3.5rem)] sticky top-14">
      <div className="h-14 flex items-center justify-between px-4 border-b">
        <h2 className="text-sm font-medium leading-snug">Details</h2>
        <Button variant="ghost" size="icon" onClick={() => setOpenRail(false)}>
          <X />
        </Button>
      </div>
      <div className="min-h-0 p-4 flex-1 flex flex-col text-sm">
        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-col gap-4">
            <ItemDetails item={document} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
