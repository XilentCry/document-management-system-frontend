import {
  Item,
  ItemActions,
  ItemContent,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { TItem } from "@/types/item";
import {
  Activity,
  CircleAlert,
  EllipsisVertical,
  FileText,
  FolderInput,
  FolderOpen,
  PencilLine,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RenameItemDialog } from "./rename-item-dialog";
import { MoveItemDialog } from "./move-item-dialog";
import { useRailStore } from "@/stores/rail-store";

export function Document({
  item,
  onDoubleClick,
}: {
  item: TItem;
  onDoubleClick: (documentId: number) => Promise<void>;
}) {
  const [openRenameItemDialog, setOpenRenameItemDialog] = useState(false);
  const [openMoveItemDialog, setOpenMoveItemDialog] = useState(false);

  const {
    setSelectedDocumentId,
    setSelectedDocumentFileName,
    setSelectedFolderId,
    setSelectedFolderName,
    setRailTab,
    setOpenRail,
  } = useRailStore();

  return (
    <>
      <Item
        variant="muted"
        onClick={() => {
          setSelectedDocumentId(item.id);
          setSelectedDocumentFileName(item.name);
          setSelectedFolderId(null);
          setSelectedFolderName(null);
        }}
        onDoubleClick={() => onDoubleClick(item.id)}
      >
        <ItemMedia>
          <FileText className="size-4" />
        </ItemMedia>
        <ItemContent className="min-w-0">
          <ItemTitle className="block w-auto truncate">{item.name}</ItemTitle>
        </ItemContent>
        <ItemActions>
          <DropdownMenu modal={false}>
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
              <DropdownMenuItem onClick={() => setOpenRenameItemDialog(true)}>
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
                      onClick={() => setOpenMoveItemDialog(true)}
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
                  File information
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-72">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedDocumentId(item.id);
                        setSelectedDocumentFileName(item.name);
                        setSelectedFolderId(null);
                        setSelectedFolderName(null);
                        setRailTab("details");
                        setOpenRail(true);
                      }}
                    >
                      <FolderInput />
                      Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedDocumentId(item.id);
                        setSelectedDocumentFileName(item.name);
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
        </ItemActions>
        <ItemFooter className="justify-center bg-background p-4 h-40 rounded-md">
          <FileText className="size-16" strokeWidth={1} />
        </ItemFooter>
      </Item>

      {openRenameItemDialog && (
        <RenameItemDialog
          item={item}
          openRenameItemDialog={openRenameItemDialog}
          setOpenRenameItemDialog={setOpenRenameItemDialog}
        />
      )}

      {openMoveItemDialog && (
        <MoveItemDialog
          item={item}
          openMoveItemDialog={openMoveItemDialog}
          setOpenMoveItemDialog={setOpenMoveItemDialog}
        />
      )}
    </>
  );
}
