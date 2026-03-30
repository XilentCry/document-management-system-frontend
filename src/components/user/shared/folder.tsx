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
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useRailStore } from "@/stores/rail-store";
import { TItem } from "@/types/item";
import {
  Activity,
  CircleAlert,
  EllipsisVertical,
  FolderIcon,
  FolderInput,
  PencilLine,
  Info,
} from "lucide-react";
import { useState } from "react";
import { MoveItemDialog } from "./move-item-dialog";
import { RenameItemDialog } from "./rename-item-dialog";

export function Folder({
  item,
  onDoubleClick,
}: {
  item: TItem;
  onDoubleClick: (folderId: string) => void;
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
        size="sm"
        onClick={() => {
          setSelectedFolderId(item.id);
          setSelectedFolderName(item.name);
          setSelectedDocumentId(null);
          setSelectedDocumentFileName(null);
        }}
        onDoubleClick={() => onDoubleClick(item.id)}
      >
        <ItemMedia>
          <FolderIcon className="size-4" />
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
              <DropdownMenuItem onClick={() => setOpenMoveItemDialog(true)}>
                <FolderInput />
                Move
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <CircleAlert />
                  Folder information
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-72">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedFolderId(item.id);
                        setSelectedFolderName(item.name);
                        setSelectedDocumentId(null);
                        setSelectedDocumentFileName(null);
                        setRailTab("details");
                        setOpenRail(true);
                      }}
                    >
                      <Info />
                      Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedFolderId(item.id);
                        setSelectedFolderName(item.name);
                        setSelectedDocumentId(null);
                        setSelectedDocumentFileName(null);
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
      </Item>

      <RenameItemDialog
        item={item}
        openRenameItemDialog={openRenameItemDialog}
        setOpenRenameItemDialog={setOpenRenameItemDialog}
      />

      <MoveItemDialog
        item={item}
        openMoveItemDialog={openMoveItemDialog}
        setOpenMoveItemDialog={setOpenMoveItemDialog}
      />
    </>
  );
}
