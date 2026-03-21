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
import { useDownloadDocument } from "@/services/documents/mutations";
import { useRailStore } from "@/stores/rail-store";
import { useUserStore } from "@/stores/user-store";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TItem } from "@/types/item";
import {
  Activity,
  Building,
  CircleAlert,
  Download,
  EllipsisVertical,
  FileText,
  Folder,
  FolderInput,
  Info,
  PencilLine,
  UserRoundPlus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MoveItemDialog } from "../shared/move-item-dialog";
import { RenameItemDialog } from "../shared/rename-item-dialog";
import { ShareDocumentDialog } from "../shared/share-document-dialog";

export function SearchResultTable({
  data,
  onFolderDoubleClick,
  onDocumentDoubleClick,
}: {
  data: TCursorPaginate<TItem>["data"];
  onFolderDoubleClick: (folderId: number) => void;
  onDocumentDoubleClick: (documentId: number) => Promise<void>;
}) {
  const userId = useUserStore((state) => state.userId);
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
  const { mutate: downloadDocumentMutation } = useDownloadDocument();

  const handleDownload = (id: number, fileName: string) => {
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
              {!openRail && <TableHead>Location</TableHead>}
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
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
                    if (
                      item.share_permissions !== null &&
                      !item.share_permissions.some((p) => p.name === "can_view")
                    ) {
                      toast.error(
                        "You do not have permission to view this document.",
                      );
                      return;
                    }
                    onDocumentDoubleClick(item.id);
                  }
                }}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    {item.is_folder ? (
                      <Folder className="size-4" />
                    ) : (
                      <FileText className="size-4" />
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
                    <div className="flex items-center gap-2">
                      {item.parent_item_id ? (
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
                      {item.share_permissions === null ? (
                        <>
                          {!item.is_folder && (
                            <DropdownMenuItem
                              onClick={() => handleDownload(item.id, item.name)}
                            >
                              <Download />
                              Download
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(item);
                              setOpenRenameItemDialog(true);
                            }}
                          >
                            <PencilLine />
                            Rename
                          </DropdownMenuItem>
                          {!item.is_folder && item.owner.id === userId && (
                            <>
                              {item.classification === "protected" ? (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setOpenShareDialog(true);
                                  }}
                                >
                                  <UserRoundPlus />
                                  Share
                                </DropdownMenuItem>
                              ) : (
                                item.classification === "public" && null
                              )}
                            </>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(item);
                              setOpenMoveItemDialog(true);
                            }}
                          >
                            <FolderInput />
                            Move
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          {item.share_permissions.some(
                            (p) => p.name === "can_download",
                          ) && (
                              <DropdownMenuItem
                                onClick={() => handleDownload(item.id, item.name)}
                              >
                                <Download />
                                Download
                              </DropdownMenuItem>
                            )}
                          {item.share_permissions.some(
                            (p) => p.name === "can_rename",
                          ) && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedItem(item);
                                  setOpenRenameItemDialog(true);
                                }}
                              >
                                <PencilLine />
                                Rename
                              </DropdownMenuItem>
                            )}
                          {item.share_permissions.some(
                            (p) => p.name === "can_share",
                          ) && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedItem(item);
                                  setOpenShareDialog(true);
                                }}
                              >
                                <UserRoundPlus />
                                Share
                              </DropdownMenuItem>
                            )}
                        </>
                      )}
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
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
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
      {openShareDialog && selectedItem && (
        <ShareDocumentDialog
          item={selectedItem}
          openShareDialog={openShareDialog}
          setOpenShareDialog={setOpenShareDialog}
        />
      )}
    </>
  );
}
