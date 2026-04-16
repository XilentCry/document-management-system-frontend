import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Spinner } from "@/components/ui/spinner";
import { viewDocument } from "@/services/documents/api";

import { useGetDocumentDetails } from "@/services/documents/queries";
import { TSharedWithMe } from "@/types/shared-with-me";
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
import { DocumentViewerRail } from "../shared/document-viewer-rail";
import { PdfDisplay } from "../shared/pdf-display";
import { RenameItemDialog } from "../shared/rename-item-dialog";
import { ShareDocumentDialog } from "../shared/share-document-dialog";
import { useDownloadDocument } from "@/services/documents/mutations";
import { MoveItemDialog } from "../shared/move-item-dialog";

export function SharedDocumentViewer({
  openDocumentViewer,
  setOpenDocumentViewer,
  sharedDocument,
}: {
  openDocumentViewer: boolean;
  setOpenDocumentViewer: Dispatch<SetStateAction<boolean>>;
  sharedDocument: TSharedWithMe;
}) {
  const [openMoveItemDialog, setOpenMoveItemDialog] = useState(false);
  const [openRenameItemDialog, setOpenRenameItemDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [openViewerRail, setOpenViewerRail] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const documentDetailsQuery = useGetDocumentDetails(
    sharedDocument.item.id,
    openDocumentViewer
  );
  const documentName = documentDetailsQuery.data?.name ?? sharedDocument.item.name;

  useEffect(() => {
    if (!openDocumentViewer) return;

    let objectUrl: string;
    viewDocument(sharedDocument.item.id)
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
  }, [openDocumentViewer, sharedDocument.item.id]);

  const { mutate: downloadDocumentMutation } = useDownloadDocument();

  const handleDownload = (id: string, name: string) => {
    downloadDocumentMutation({
      id,
      fileName: name,
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
                <Image src="/pdf.svg" alt="PDF" width={16} height={16} priority />
                <span className="text-sm leading-snug font-medium">
                  {documentName}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  disabled={
                    !sharedDocument.share_permissions.some(
                      (sharePermission) =>
                        sharePermission.name === "document:download",
                    )}
                  onClick={() => handleDownload(sharedDocument.item.id, sharedDocument.item.name)}
                >
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
                      disabled={
                        !sharedDocument.share_permissions.some(
                          (sharePermission) =>
                            sharePermission.name === "document:rename",
                        )}
                      onClick={() => setOpenRenameItemDialog(true)}
                    >
                      <PencilLine />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={
                        !sharedDocument.share_permissions.some(
                          (sharePermission) =>
                            sharePermission.name === "document:move",
                        )}
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
              {sharedDocument.share_permissions.some(
                (sharePermission) =>
                  sharePermission.name === "document:share",
              )
                && <Button onClick={() => setOpenShareDialog(true)}>
                  <UserRoundPlus />
                  Share
                </Button>}
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
                documentId={sharedDocument.item.id}
                openRail={openViewerRail}
                setOpenRail={setOpenViewerRail}
              />
            )}
          </div>
        </div>
      )}

      <RenameItemDialog
        item={sharedDocument.item}
        openRenameItemDialog={openRenameItemDialog}
        setOpenRenameItemDialog={setOpenRenameItemDialog}
      />

      <MoveItemDialog
        item={sharedDocument.item}
        openMoveItemDialog={openMoveItemDialog}
        setOpenMoveItemDialog={setOpenMoveItemDialog}
      />

      <ShareDocumentDialog
        item={sharedDocument.item}
        openShareDialog={openShareDialog}
        setOpenShareDialog={setOpenShareDialog}
      />

      <ShareDocumentDialog
        item={sharedDocument.item}
        openShareDialog={openShareDialog}
        setOpenShareDialog={setOpenShareDialog}
      />
    </>
  );
}
