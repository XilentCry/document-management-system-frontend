import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Spinner } from "@/components/ui/spinner";
import { viewDocument } from "@/services/documents/api";
import { useDownloadDocument } from "@/services/documents/mutations";
import { useGetDocumentDetails } from "@/services/documents/queries";
import { useUserStore } from "@/stores/user-store";
import { TItem } from "@/types/item";
import {
  Download,
  EllipsisVertical,
  FolderInput,
  Info,
  PencilLine,
  UserRoundPlus,
  X
} from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DocumentViewerRail } from "./document-viewer-rail";
import { MoveItemDialog } from "./move-item-dialog";
import { PdfDisplay } from "./pdf-display";
import { RenameItemDialog } from "./rename-item-dialog";
import { ShareDocumentDialog } from "./share-document-dialog";

export function DocumentViewer({
  openDocumentViewer,
  setOpenDocumentViewer,
  document,
}: {
  openDocumentViewer: boolean;
  setOpenDocumentViewer: Dispatch<SetStateAction<boolean>>;
  document: TItem;
}) {
  const [openRenameItemDialog, setOpenRenameItemDialog] = useState(false);
  const [openMoveItemDialog, setOpenMoveItemDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [openViewerRail, setOpenViewerRail] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const userId = useUserStore((state) => state.user.userId);

  const documentDetailsQuery = useGetDocumentDetails(document.id, openDocumentViewer);
  const documentName = documentDetailsQuery.data?.name ?? document.name;

  const { mutate: downloadDocumentMutation } = useDownloadDocument();

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

  const handleDownload = () => {
    downloadDocumentMutation({
      id: document.id,
      fileName: documentName,
    });
  };

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
                <img src="/pdf.svg" alt="PDF icon" className="size-4" />
                <span className="text-sm leading-snug font-medium">
                  {documentName}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleDownload}>
                  <Download />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="ghost" size="icon" />}
                  >
                    <EllipsisVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72">
                    <DropdownMenuItem
                      onClick={() => setOpenRenameItemDialog(true)}
                    >
                      <PencilLine />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setOpenMoveItemDialog(true)}
                    >
                      <FolderInput />
                      Move
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenViewerRail(true)}>
                      <Info />
                      Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {document.owner.id === userId && (
                <>
                  {document.classification === "protected" ? (
                    <Button onClick={() => setOpenShareDialog(true)}>
                      <UserRoundPlus />
                      Share
                    </Button>
                  ) : document.classification === "public" ? null : null}
                </>
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
              />
            )}
          </div>
        </div>
      )}

      <RenameItemDialog
        item={document}
        openRenameItemDialog={openRenameItemDialog}
        setOpenRenameItemDialog={setOpenRenameItemDialog}
      />

      <MoveItemDialog
        item={document}
        openMoveItemDialog={openMoveItemDialog}
        setOpenMoveItemDialog={setOpenMoveItemDialog}
      />

      <ShareDocumentDialog
        item={document}
        openShareDialog={openShareDialog}
        setOpenShareDialog={setOpenShareDialog}
      />
    </>
  );
}
