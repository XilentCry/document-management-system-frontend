import { Button } from "@/components/ui/button";
import Image from "next/image";
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

import { useRailStore } from "@/stores/rail-store";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TItem } from "@/types/item";
import { TSharedWithMe } from "@/types/shared-with-me";
import {
  Activity,
  CircleAlert,

  EllipsisVertical,
  Info,
  PencilLine,
  UserRoundPlus
} from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { MoveItemDialog } from "../shared/move-item-dialog";
import { RenameItemDialog } from "../shared/rename-item-dialog";
import { ShareDocumentDialog } from "../shared/share-document-dialog";
import { groupItemsByRelativeDate } from "@/lib/date-grouping";
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
  const [openMoveItemDialog, setOpenMoveItemDialog] = useState(false);
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
            ...groupData.items.map((sharedDocument) => (
              <TableRow
                key={sharedDocument.item.id}
                onClick={() => {
                  setSelectedDocumentId(sharedDocument.item.id);
                  setSelectedDocumentFileName(sharedDocument.item.name);
                  setSelectedFolderId(null);
                  setSelectedFolderName(null);
                }}
                onDoubleClick={() => {
                  if (
                    !sharedDocument.share_permissions.some(
                      (share_permissions) =>
                        share_permissions.name === "document:view",
                    )
                  ) {
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

                      {sharedDocument.share_permissions.some(
                        (sharePermission) =>
                          sharePermission.name === "document:rename",
                      ) && (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(sharedDocument.item);
                              setOpenRenameItemDialog(true);
                            }}
                          >
                            <PencilLine />
                            Rename
                          </DropdownMenuItem>
                        )}
                      {sharedDocument.share_permissions.some(
                        (sharePermission) => sharePermission.name === "document:share",
                      ) && (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(sharedDocument.item);
                              setOpenShareDialog(true);
                            }}
                          >
                            <UserRoundPlus />
                            Share
                          </DropdownMenuItem>
                        )}
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
            ))
          ])}
        </TableBody>
      </Table>

      {openRenameItemDialog && selectedItem && (
        <RenameItemDialog
          item={selectedItem}
          openRenameItemDialog={openRenameItemDialog}
          setOpenRenameItemDialog={setOpenRenameItemDialog}
        />
      )}

      {openMoveItemDialog && selectedItem && (
        <MoveItemDialog
          item={selectedItem}
          openMoveItemDialog={openMoveItemDialog}
          setOpenMoveItemDialog={setOpenMoveItemDialog}
        />
      )}

      {openShareDialog && selectedItem && (
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
