"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { PublicDocumentViewerRail } from "@/components/user/shared/public-document-viewer-rail";
import { publicDocument } from "@/services/documents/api";
import { useGetPublicDocumentDetails } from "@/services/documents/queries";
import { FileText, Info } from "lucide-react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const PdfDisplay = dynamic(
  () =>
    import("@/components/user/shared/pdf-display").then(
      (mod) => mod.PdfDisplay,
    ),
  { ssr: false },
);

export default function ViewDocumentPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: document,
    isLoading,
    isError,
    error,
  } = useGetPublicDocumentDetails(id);

  const [openViewerRail, setOpenViewerRail] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    let objectUrl: string;
    publicDocument(id)
      .then((url) => {
        objectUrl = url;
        setPdfUrl(url);
      })
      .catch(() => setPdfError(true));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setPdfUrl(null);
      setPdfError(false);
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="h-svh flex items-center justify-center">
        <Spinner className="text-primary size-9" />
      </div>
    );
  }

  if (isError && error) {
    return (
      <div className="h-svh flex items-center justify-center">
        <p className="text-destructive text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-background flex flex-col h-screen w-full isolate">
        <header className="border-b h-14 shrink-0 flex items-center justify-between px-4 sticky top-0 bg-background z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <FileText className="size-4" />
              <span className="text-sm leading-snug font-medium">
                {document?.name}
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

            {document?.classification === "public" && null}
          </div>
        </header>

        <div className="flex-1 min-h-0 flex">
          <ScrollArea className="flex-1 min-h-0 bg-muted/20">
            {pdfError ? (
              <div className="h-[calc(100vh-3.5rem)] flex items-center justify-center">
                <p className="text-destructive text-sm">
                  Failed to load document. Please try again.
                </p>
              </div>
            ) : pdfUrl ? (
              <div className="py-8">
                <PdfDisplay fileUrl={pdfUrl} />
              </div>
            ) : (
              <div className="h-[calc(100vh-3.5rem)] flex items-center justify-center">
                <Spinner className="text-primary size-9" />
              </div>
            )}
          </ScrollArea>

          {openViewerRail && document && (
            <PublicDocumentViewerRail
              document={document}
              setOpenRail={setOpenViewerRail}
            />
          )}
        </div>
      </div>
    </>
  );
}
