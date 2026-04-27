import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { viewDocument } from "@/features/documents/api/client";
import { useGetDocumentDetails } from "@/features/documents/api/queries";
import { TItem } from "@/features/items/types/item";
import { Info, X } from "lucide-react";
import { TTrashedItem } from "@/features/trash/types/trash-item";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DocumentViewerRail } from "@/features/viewer/components/document-viewer-rail";
import { PdfDisplay } from "@/features/viewer/components/pdf-display";
import { ItemActionDropdown } from "@/features/items/components/item-action-dropdown";

export function DocumentViewer({
  openDocumentViewer,
  setOpenDocumentViewer,
  document,
  isTrash,
}: {
  openDocumentViewer: boolean;
  setOpenDocumentViewer: Dispatch<SetStateAction<boolean>>;
  document: TItem | TTrashedItem;
  isTrash?: boolean;
}) {
  const [openViewerRail, setOpenViewerRail] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const documentDetailsQuery = useGetDocumentDetails(
    document.id,
    openDocumentViewer && !isTrash,
  );
  const documentName = documentDetailsQuery.data?.name ?? document.name;

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
                <Image
                  src="/pdf.svg"
                  alt="PDF"
                  width={16}
                  height={16}
                  priority
                />
                <span className="text-sm leading-snug font-medium">
                  {documentName}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isTrash ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpenViewerRail(!openViewerRail)}
                >
                  <Info />
                </Button>
              ) : (
                <ItemActionDropdown
                  item={document as TItem}
                  variant="viewer"
                  onDetails={() => setOpenViewerRail(true)}
                />
              )}
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
              <DocumentViewerRail
                documentId={document.id}
                openRail={openViewerRail}
                setOpenRail={setOpenViewerRail}
                isTrash={isTrash}
                item={isTrash ? (document as TTrashedItem) : undefined}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
