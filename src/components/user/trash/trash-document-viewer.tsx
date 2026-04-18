import { Button } from "@/components/ui/button";
import Image from "next/image";

import { viewDocument } from "@/services/documents/api";
import { TTrashedItem } from "@/types/trash-item";
import {
  Info,
  X
} from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PdfDisplay } from "../shared/pdf-display";
import { TrashItemDetails } from "./trash-item-details";
import { Spinner } from "@/components/ui/spinner";

function TrashDocumentViewerRail({
  item,
  setOpenRail,
}: {
  item: TTrashedItem;
  setOpenRail: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="bg-background border-l w-80 flex flex-col h-full">
      <div className="h-14 flex items-center justify-between px-4 border-b">
        <h2 className="text-sm font-medium leading-snug">Details</h2>
        <Button variant="ghost" size="icon" onClick={() => setOpenRail(false)}>
          <X />
        </Button>
      </div>
      <div className="min-h-0 p-4 flex-1 flex flex-col gap-4 text-sm">
        <TrashItemDetails item={item} />
      </div>
    </div>
  );
}

export function TrashDocumentViewer({
  openDocumentViewer,
  setOpenDocumentViewer,
  document,
}: {
  openDocumentViewer: boolean;
  setOpenDocumentViewer: Dispatch<SetStateAction<boolean>>;
  document: TTrashedItem;
}) {
  const [openViewerRail, setOpenViewerRail] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    if (!openDocumentViewer) return;

    let objectUrl: string;
    viewDocument(document.id)
      .then((url) => {
        objectUrl = url;
        setPdfUrl(url);
      })
      .catch((error) => setPdfError(error.message));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setPdfUrl(null);
      setPdfError(null);
    };
  }, [openDocumentViewer, document.id]);

  return (
    <>
      {openDocumentViewer && (
        <div className="bg-background data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 duration-100 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 isolate z-50 flex flex-col">
          <header className="bg-background border-b h-14 flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenDocumentViewer(false)}
              >
                <X />
              </Button>
              <div className="flex items-center gap-4">
                <Image src="/pdf.svg" alt="PDF" width={16} height={16} priority />
                <span className="text-sm leading-snug font-medium">
                  {document.name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenViewerRail(!openViewerRail)}
              >
                <Info />
              </Button>
            </div>
          </header>
          <div className="flex-1 min-h-0 flex">
            <div className="flex-1">
              {pdfError ? (
                <div className="h-[calc(100vh-3.5rem)] flex items-center justify-center">
                  <p className="text-destructive text-sm">{pdfError}</p>
                </div>
              ) : pdfUrl ? (
                <PdfDisplay fileUrl={pdfUrl} />
              ) : (
                <div className="h-[calc(100vh-3.5rem)] flex items-center justify-center">
                  <Spinner className="text-primary size-9" />
                </div>
              )}
            </div>
            {openViewerRail && (
              <TrashDocumentViewerRail
                item={document}
                setOpenRail={setOpenViewerRail}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
