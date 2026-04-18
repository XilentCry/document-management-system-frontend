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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCopyLink } from "@/hooks/use-copy-link";
import { formatFileSize } from "@/lib/format-file-size";
import { useDownloadDocument } from "@/services/documents/mutations";
import { useCurrentUser } from "@/services/user/queries";
import { useRailStore } from "@/stores/rail-store";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TItem } from "@/types/item";
import {
  Activity,
  Building,
  CircleAlert,
  Download,
  EllipsisVertical,
  Folder,
  FolderInput,
  History,
  Info,
  Link2,
  PencilLine,
  Shield,
  UserRoundPlus,
  UsersRound
} from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { ChangeClassificationDialog } from "../shared/change-classification-dialog";
import { VersionHistoryDialog } from "../shared/manage-versions-dialog";
import { MoveItemDialog } from "../shared/move-item-dialog";
import { RenameItemDialog } from "../shared/rename-item-dialog";
import { ShareDocumentDialog } from "../shared/share-document-dialog";

export function SearchResultTable({
  data,
  onFolderDoubleClick,
  onDocumentDoubleClick,
}: {
  data: TCursorPaginate<TItem>["data"];
  onFolderDoubleClick: (folderId: string) => void;
  onDocumentDoubleClick: (document: TItem) => Promise<void>;
  openDocumentViewer: boolean;
  setOpenDocumentViewer: Dispatch<SetStateAction<boolean>>;
  selectedDocument: TItem | null;
}) {
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id;
  const [openRenameItemDialog, setOpenRenameItemDialog] = useState(false);
  const [openMoveItemDialog, setOpenMoveItemDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TItem | null>(null);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [openVersionHistoryDialog, setOpenVersionHistoryDialog] = useState(false);
  const [openChangeClassificationDialog, setOpenChangeClassificationDialog] = useState(false);
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
  const { copyLink } = useCopyLink();

  const handleDownload = (id: string, fileName: string) => {
    downloadDocumentMutation({ id, fileName });
  };

  return (
    <>
      <ScrollArea>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              {!openRail && <TableHead>Owner</TableHead>}
              <TableHead>Date modified</TableHead>
              {!openRail && <TableHead>Classification</TableHead>}
              {!openRail && <TableHead>File size</TableHead>}
              {!openRail && <TableHead>Location</TableHead>}
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const isOwner = item.owner.id === userId;
              const sharePermissions = item.share_permissions ?? [];
              const canView = isOwner || sharePermissions.some((p) => p.name === "document:view");
              const canDownload = isOwner || sharePermissions.some((p) => p.name === "document:download");
              const canRename = isOwner || sharePermissions.some((p) => p.name === "document:rename");
              const canShare = isOwner || sharePermissions.some((p) => p.name === "document:share");

              return (
                <TableRow
                  key={item.id}
                  onClick={() => {
                    if (item.is_folder) {
                      setSelectedFolderId(item.id);
                      setSelectedFolderName(item.name);
                      setSelectedDocumentId(null);
                      setSelectedDocumentFileName(null);
                    } else {
                      setSelectedDocumentId(item.id);
                      setSelectedDocumentFileName(item.name);
                      setSelectedFolderId(null);
                      setSelectedFolderName(null);
                    }
                  }}
                  onDoubleClick={() => {
                    if (item.is_folder) {
                      onFolderDoubleClick(item.id);
                    } else {
                      if (!canView) {
                        toast.error(
                          "You do not have permission to view this document.",
                        );
                        return;
                      }
                      onDocumentDoubleClick(item);
                    }
                  }}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.is_folder ? (
                        <Folder className="size-4" />
                      ) : (
                        <Image src="/pdf.svg" alt="PDF" width={16} height={16} />
                      )}
                      {item.name}
                    </div>
                  </TableCell>
                  {!openRail && (
                    <TableCell>
                      {userId === item.owner.id
                        ? "me"
                        : `${item.owner.first_name} ${item.owner.middle_name ?? ""} ${item.owner.last_name}`}
                    </TableCell>
                  )}
                  <TableCell>{item.updated_at}</TableCell>
                  {!openRail && (
                    <TableCell>{item.classification ?? <>&mdash;</>}</TableCell>
                  )}
                  {!openRail && (
                    <TableCell>
                      {item?.current_version?.file_size ? (
                        formatFileSize(item.current_version.file_size)
                      ) : (
                        <>&mdash;</>
                      )}
                    </TableCell>
                  )}
                  {!openRail && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.location === "Shared with me" ? (
                          <UsersRound className="shrink-0 size-4" />
                        ) : item.parent_item_id ? (
                          <Folder className="shrink-0 size-4" />
                        ) : (
                          <Building className="shrink-0 size-4" />
                        )}
                        {item.location}
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="outline"
                            size="icon-xs"
                            className="border-none bg-transparent hover:bg-input/50"
                          />
                        }
                      >
                        <EllipsisVertical className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-72">
                        {!item.is_folder && (
                          <DropdownMenuItem
                            disabled={!canDownload}
                            onClick={() => handleDownload(item.id, item.name)}
                          >
                            <Download />
                            Download
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          disabled={!canRename}
                          onClick={() => {
                            setSelectedItem(item);
                            setOpenRenameItemDialog(true);
                          }}
                        >
                          <PencilLine />
                          Rename
                        </DropdownMenuItem>
                        {!item.is_folder && (
                          <DropdownMenuItem
                            disabled={!isOwner}
                            onClick={() => {
                              setSelectedItem(item);
                              setOpenChangeClassificationDialog(true);
                            }}
                          >
                            <Shield />
                            Change classification
                          </DropdownMenuItem>
                        )}
                        {!item.is_folder && (
                          <>
                            {item.classification === "protected" ? (
                              <DropdownMenuItem
                                disabled={!canShare}
                                onClick={() => {
                                  setSelectedItem(item);
                                  setOpenShareDialog(true);
                                }}
                              >
                                <UserRoundPlus />
                                Share
                              </DropdownMenuItem>
                            ) : item.classification === "public" ? (
                              <DropdownMenuItem
                                onClick={() => copyLink(item.id)}
                              >
                                <Link2 />
                                Copy Link
                              </DropdownMenuItem>
                            ) : null}
                          </>
                        )}
                        <DropdownMenuItem
                          disabled={!isOwner}
                          onClick={() => {
                            setSelectedItem(item);
                            setOpenMoveItemDialog(true);
                          }}
                        >
                          <FolderInput />
                          Move
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <CircleAlert />
                            {item.is_folder ? "Folder" : "File"} information
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="w-72">
                              <DropdownMenuItem
                                onClick={() => {
                                  if (item.is_folder) {
                                    setSelectedFolderId(item.id);
                                    setSelectedFolderName(item.name);
                                    setSelectedDocumentId(null);
                                    setSelectedDocumentFileName(null);
                                  } else {
                                    setSelectedDocumentId(item.id);
                                    setSelectedDocumentFileName(item.name);
                                    setSelectedFolderId(null);
                                    setSelectedFolderName(null);
                                  }
                                  setRailTab("details");
                                  setOpenRail(true);
                                }}
                              >
                                <Info />
                                Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  if (item.is_folder) {
                                    setSelectedFolderId(item.id);
                                    setSelectedFolderName(item.name);
                                    setSelectedDocumentId(null);
                                    setSelectedDocumentFileName(null);
                                  } else {
                                    setSelectedDocumentId(item.id);
                                    setSelectedDocumentFileName(item.name);
                                    setSelectedFolderId(null);
                                    setSelectedFolderName(null);
                                  }
                                  setRailTab("activity");
                                  setOpenRail(true);
                                }}
                              >
                                <Activity />
                                Activity
                              </DropdownMenuItem>
                              {!item.is_folder && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setOpenVersionHistoryDialog(true);
                                  }}
                                >
                                  <History />
                                  {!isOwner ? "Version history" : "Manage versions"}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

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
      {selectedItem && (
        <ShareDocumentDialog
          item={selectedItem}
          openShareDialog={openShareDialog}
          setOpenShareDialog={setOpenShareDialog}
        />
      )}
      {selectedItem && (
        <VersionHistoryDialog
          item={selectedItem}
          openVersionHistoryDialog={openVersionHistoryDialog}
          setOpenVersionHistoryDialog={setOpenVersionHistoryDialog}
        />
      )}
      {selectedItem && (
        <ChangeClassificationDialog
          item={selectedItem}
          openChangeClassificationDialog={openChangeClassificationDialog}
          setOpenChangeClassificationDialog={setOpenChangeClassificationDialog}
        />
      )}
    </>
  );
}
