import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { TFolder } from "@/types/folder";
import { EllipsisVertical, FolderIcon } from "lucide-react";

export function Folder({
  folder,
  onDoubleClick,
}: {
  folder: TFolder;
  onDoubleClick: (id: number) => void;
}) {
  return (
    <Item variant="muted" onDoubleClick={() => onDoubleClick(folder.id)}>
      <ItemMedia>
        <FolderIcon className="size-4" />
      </ItemMedia>
      <ItemContent className="min-w-0">
        <ItemTitle className="block w-auto truncate">{folder.name}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <EllipsisVertical className="size-4" />
      </ItemActions>
    </Item>
  );
}
