"use client";

import { Button } from "@/components/ui/button";
import { TItem } from "@/types/item";
import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { ItemDetails } from "./item-details";

export function PublicDocumentViewerRail({
  document,
  setOpenRail,
}: {
  document: Pick<
    TItem,
    "id" | "name" | "owner" | "classification" | "created_at" | "updated_at"
  > & {
    current_version: {
      id: number;
      item_id: number;
      file_size: number;
      version_number: number;
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
      <div className="min-h-0 p-4 flex-1 flex flex-col gap-4 text-sm">
        <ItemDetails item={document} />
      </div>
    </div>
  );
}
