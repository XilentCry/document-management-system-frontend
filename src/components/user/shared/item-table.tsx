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
import { formatFileSize } from "@/lib/format-file-size";
import { useUserStore } from "@/stores/user-store";
import { TItem } from "@/types/item";
import { TPaginate } from "@/types/paginate";
import {
  Activity,
  CircleAlert,
  EllipsisVertical,
  FileText,
  Folder,
  FolderInput,
  FolderOpen,
  PencilLine,
} from "lucide-react";
import { useState } from "react";
import { RenameItemDialog } from "./rename-item-dialog";
import { MoveItemDialog } from "./move-item-dialog";
import { useRailStore } from "@/stores/rail-store";

export function ItemTable({
  data,
  onFolderDoubleClick,
  onDocumentDoubleClick,
}: {
  data: TPaginate<TItem>["data"];
  onFolderDoubleClick: (folderId: number) => void;
  onDocumentDoubleClick: (documentId: number) => Promise<void>;
}) {
  const userId = useUserStore((state) => state.userId);
  const [openRenameItemDialog, setOpenRenameItemDialog] = useState(false);
  const [openMoveItemDialog, setOpenMoveItemDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TItem | null>(null);

  const {
    setSelectedDocumentId,
    setSelectedDocumentFileName,
    setSelectedFolderId,
    setSelectedFolderName,
    setRailTab,
    openRail,
    setOpenRail,
  } = useRailStore();

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
                <TableCell>
                  {item.classification ? item.classification : <>&mdash;</>}
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
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedItem(item);
                        setOpenRenameItemDialog(true);
                      }}
                    >
                      <PencilLine />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <FolderOpen />
                        Organize
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="w-72">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(item);
                              setOpenMoveItemDialog(true);
                            }}
                          >
                            <FolderInput />
                            Move
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
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
    </>
  );
}
