"use client";

import { Button } from "@/components/ui/button";
import { useGetDocumentDetails } from "@/services/documents/queries";
import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { ItemDetails } from "./item-details";
import { ItemDetailsSkeleton } from "./item-details-skeleton";

export function DocumentViewerRail({
  documentId,
  setOpenRail,
}: {
  documentId: number;
  setOpenRail: Dispatch<SetStateAction<boolean>>;
}) {
  const documentQuery = useGetDocumentDetails(documentId, true);

  return (
    <div className="bg-background border-l w-80 flex flex-col h-full">
      <div className="h-14 flex items-center justify-between px-4 border-b">
        <h2 className="text-sm font-medium leading-snug">Details</h2>
        <Button variant="ghost" size="icon" onClick={() => setOpenRail(false)}>
          <X />
        </Button>
      </div>
      <div className="min-h-0 p-4 flex-1 flex flex-col gap-4 text-sm">
        {documentQuery.isLoading ? (
          <ItemDetailsSkeleton />
        ) : documentQuery.isError && documentQuery.error ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-destructive text-sm">
              {documentQuery.error.message}
            </p>
          </div>
        ) : documentQuery.data ? (
          <ItemDetails item={documentQuery.data} />
        ) : null}
      </div>
    </div>
  );
}
