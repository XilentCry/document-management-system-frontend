import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

import { groupItemsByRelativeDate } from "@/lib/date-grouping";
import { useDownloadDocument } from "@/services/documents/mutations";
import { useRailStore } from "@/stores/rail-store";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TItem } from "@/types/item";
import { TSharedWithMe } from "@/types/shared-with-me";
import {
  Activity,
  CircleAlert,

  Download,

  EllipsisVertical,
  Info,
  PencilLine,
  UserRoundPlus
} from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { RenameItemDialog } from "../shared/rename-item-dialog";
import { ShareDocumentDialog } from "../shared/share-document-dialog";
import { SharedDocumentViewer } from "./shared-document-viewer";

export function SharedDocumentTable({
  data,
  onDocumentDoubleClick,
  openDocumentViewer,
  setOpenDocumentViewer,
  selectedDocument,
}: {
  data: TCursorPaginate<TSharedWithMe>["data"];
  onDocumentDoubleClick: (document: TSharedWithMe) => Promise<void>;
  openDocumentViewer: boolean;
  setOpenDocumentViewer: Dispatch<SetStateAction<boolean>>;
  selectedDocument: TSharedWithMe | null;
}) {
  const [openRenameItemDialog, setOpenRenameItemDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TItem | null>(null);
  const [openShareDialog, setOpenShareDialog] = useState(false);

  const {
    setSelectedDocumentId,
    setSelectedDocumentFileName,
    setSelectedFolderId,
    setSelectedFolderName,
    setRailTab,
    openRail,
    setOpenRail,
  } = useRailStore();

  const { mutate: downloadDocumentMutation } = useDownloadDocument();

  const handleDownload = (id: string, name: string) => {
    downloadDocumentMutation({
      id,
      fileName: name,
    });
  };

  const groupedData = groupItemsByRelativeDate(data, (item) => item.raw_created_at);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Shared by</TableHead>
            {!openRail && <TableHead>Date shared</TableHead>}
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedData.flatMap((groupData) => [
            <TableRow key={groupData.group} className="hover:bg-transparent border-none">
              <TableCell
                colSpan={openRail ? 3 : 4}
                className="font-medium text-sm"
              >
                {groupData.group}
              </TableCell>
            </TableRow>,
            ...groupData.items.map((sharedDocument) => {
              const canView = sharedDocument.share_permissions.some(
                (p) => p.name === "document:view",
              );
              const canDownload = sharedDocument.share_permissions.some(
                (p) => p.name === "document:download",
              );
              const canRename = sharedDocument.share_permissions.some(
                (p) => p.name === "document:rename",
              );
              const canShare = sharedDocument.share_permissions.some(
                (p) => p.name === "document:share",
              );

              return (
                <TableRow
                  key={sharedDocument.item.id}
                  onClick={() => {
                    setSelectedDocumentId(sharedDocument.item.id);
                    setSelectedDocumentFileName(sharedDocument.item.name);
                    setSelectedFolderId(null);
                    setSelectedFolderName(null);
                  }}
                  onDoubleClick={() => {
                    if (!canView) {
                      toast.error(
                        "You do not have permission to view this document.",
                      );
                      return;
                    }

                    onDocumentDoubleClick(sharedDocument);
                  }}
                >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image src="/pdf.svg" alt="PDF" width={16} height={16} />
                    {sharedDocument.item.name}
                  </div>
                </TableCell>
                <TableCell>{`${sharedDocument.item.owner.first_name} ${sharedDocument.item.owner.middle_name ?? ""} ${sharedDocument.item.owner.last_name}`}</TableCell>
                {!openRail && <TableCell>{sharedDocument.created_at}</TableCell>}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="outline"
                          size="icon-sm"
                          className="border-none bg-transparent hover:bg-input/50"
                        />
                      }
                    >
                      <EllipsisVertical className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-72">
                      <DropdownMenuItem
                        disabled={!canDownload}
                        onClick={() =>
                          handleDownload(
                            sharedDocument.item.id,
                            sharedDocument.item.name,
                          )
                        }
                      >
                        <Download />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={!canRename}
                        onClick={() => {
                          setSelectedItem(sharedDocument.item);
                          setOpenRenameItemDialog(true);
                        }}
                      >
                        <PencilLine />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={!canShare}
                        onClick={() => {
                          setSelectedItem(sharedDocument.item);
                          setOpenShareDialog(true);
                        }}
                      >
                        <UserRoundPlus />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <CircleAlert />
                          File information
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent className="w-72">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedDocumentId(sharedDocument.item.id);
                                setSelectedDocumentFileName(
                                  sharedDocument.item.name,
                                );
                                setSelectedFolderId(null);
                                setSelectedFolderName(null);
                                setRailTab("details");
                                setOpenRail(true);
                              }}
                            >
                              <Info />
                              Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedDocumentId(sharedDocument.item.id);
                                setSelectedDocumentFileName(
                                  sharedDocument.item.name,
                                );
                                setSelectedFolderId(null);
                                setSelectedFolderName(null);
                                setRailTab("activity");
                                setOpenRail(true);
                              }}
                            >
                              <Activity />
                              Activity
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })
        ])}
        </TableBody>
      </Table>

      {selectedItem && (
        <RenameItemDialog
          item={selectedItem}
          openRenameItemDialog={openRenameItemDialog}
          setOpenRenameItemDialog={setOpenRenameItemDialog}
        />
      )}

      {selectedItem && (
        <ShareDocumentDialog
          item={selectedItem}
          openShareDialog={openShareDialog}
          setOpenShareDialog={setOpenShareDialog}
        />
      )}

      {selectedDocument && (
        <SharedDocumentViewer
          openDocumentViewer={openDocumentViewer}
          setOpenDocumentViewer={setOpenDocumentViewer}
          sharedDocument={selectedDocument}
        />
      )}
    </>
  );
}
