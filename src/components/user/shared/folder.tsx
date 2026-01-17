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
import { TItem } from "@/types/item";
import {
  EllipsisVertical,
  FolderIcon,
  FolderInput,
  FolderOpen,
  PencilLine,
} from "lucide-react";
import { RenameFolderDialog } from "./rename-folder-dialog";
import { useState } from "react";

export function Folder({
  item,
  onDoubleClick,
}: {
  item: TItem;
  onDoubleClick: (id: number) => void;
}) {
  const [openRenameFolderDialog, setOpenRenameFolderDialog] = useState(false);

  return (
    <>
      <Item variant="muted" onDoubleClick={() => onDoubleClick(item.id)}>
        <ItemMedia>
          <FolderIcon className="size-4" />
        </ItemMedia>
        <ItemContent className="min-w-0">
          <ItemTitle className="block w-auto truncate">{item.name}</ItemTitle>
        </ItemContent>
        <ItemActions>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <EllipsisVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setOpenRenameFolderDialog(true)}>
                <PencilLine />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <FolderOpen />
                  Organize
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>
                      <FolderInput />
                      Move
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </ItemActions>
      </Item>

      {openRenameFolderDialog && (
        <RenameFolderDialog
          folder={item}
          openRenameFolderDialog={openRenameFolderDialog}
          setOpenRenameFolderDialog={setOpenRenameFolderDialog}
        />
      )}
    </>
  );
}
