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
  Folder,
  FolderInput,
  History,
  PencilLine,
  UserRoundPlus,
  Info,
  Link2,
  Shield
} from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { MoveItemDialog } from "./move-item-dialog";
import { RenameItemDialog } from "./rename-item-dialog";
import { ShareDocumentDialog } from "./share-document-dialog";
import { DocumentViewer } from "./document-viewer";
import { VersionHistoryDialog } from "./manage-versions-dialog";
import { useCopyLink } from "@/hooks/use-copy-link";
import { ChangeClassificationDialog } from "./change-classification-dialog";

export function ItemTable({
  data,
  onFolderDoubleClick,
  onDocumentDoubleClick,
  openDocumentViewer,
  setOpenDocumentViewer,
  selectedDocument,
}: {
  data: TCursorPaginate<TItem>["data"];
  onFolderDoubleClick: (folderId: string) => void;
  onDocumentDoubleClick: (document: TItem) => Promise<void>;
  openDocumentViewer: boolean;
  setOpenDocumentViewer: Dispatch<SetStateAction<boolean>>;
  selectedDocument: TItem | null;
}) {
  const userId = useUserStore((state) => state.user.userId);
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {!openRail && <TableHead>Owner</TableHead>}
            <TableHead>Date modified</TableHead>
            {!openRail && <TableHead>Classification</TableHead>}
            {!openRail && <TableHead>File size</TableHead>}
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
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedItem(item);
                          setOpenChangeClassificationDialog(true);
                        }}
                      >
                        <Shield />
                        Change classification
                      </DropdownMenuItem>
                    )}
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
                              Manage versions
                            </DropdownMenuItem>
                          )}
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

      {selectedItem && (
        <RenameItemDialog
          item={selectedItem}
          openRenameItemDialog={openRenameItemDialog}
          setOpenRenameItemDialog={setOpenRenameItemDialog}
        />
      )}

      {selectedItem && (
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

      {selectedDocument && (
        <DocumentViewer
          openDocumentViewer={openDocumentViewer}
          setOpenDocumentViewer={setOpenDocumentViewer}
          document={selectedDocument}
        />
      )}
    </>
  );
}
