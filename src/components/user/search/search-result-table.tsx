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
import { useCopyLink } from "@/hooks/use-copy-link";
import { formatFileSize } from "@/lib/format-file-size";
import { useDownloadDocument } from "@/services/documents/mutations";
import { useRailStore } from "@/stores/rail-store";
import { useUserStore } from "@/stores/user-store";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TItem } from "@/types/item";
import {
  Activity,
  CircleAlert,
  Download,
  EllipsisVertical,
  FileText,
  Folder,
  FolderInput,
  Link2,
  PencilLine,
  UserRoundPlus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RenameItemDialog } from "../shared/rename-item-dialog";
import { MoveItemDialog } from "../shared/move-item-dialog";
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

  const { copyLink } = useCopyLink();
  const { mutate: downloadDocumentMutation } = useDownloadDocument();

  const handleDownload = (id: number, fileName: string) => {
    downloadDocumentMutation({ id, fileName });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {!openRail && <TableHead>Owner</TableHead>}
            <TableHead>Date modified</TableHead>
            {!openRail && <TableHead>File size</TableHead>}
            {!openRail && <TableHead>Classification</TableHead>}
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
                <TableCell>
                  {item?.current_version?.file_size ? (
                    formatFileSize(item.current_version.file_size)
                  ) : (
                    <>&mdash;</>
                  )}
                </TableCell>
              )}
              {!openRail && (
                <TableCell>{item.classification ?? <>&mdash;</>}</TableCell>
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
                        {item.classification === "Protected" ? (
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
                          item.classification === "Public" && (
                            <DropdownMenuItem
                              onClick={() => {
                                if (!item?.current_version?.file_path) {
                                  toast.error("File path is unavailable.");
                                  return;
                                }

                                copyLink(item.current_version.file_path);
                              }}
                            >
                              <Link2 />
                              Copy link
                            </DropdownMenuItem>
                          )
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
                            <FolderInput />
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
