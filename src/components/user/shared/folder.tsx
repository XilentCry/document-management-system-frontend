import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { TItem } from "@/types/item";
import { EllipsisVertical, FolderIcon } from "lucide-react";

export function Folder({
  item,
  onDoubleClick,
}: {
  item: TItem;
  onDoubleClick: (id: number) => void;
}) {
  return (
    <Item variant="muted" onDoubleClick={() => onDoubleClick(item.id)}>
      <ItemMedia>
        <FolderIcon className="size-4" />
      </ItemMedia>
      <ItemContent className="min-w-0">
        <ItemTitle className="block w-auto truncate">{item.name}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <EllipsisVertical className="size-4" />
      </ItemActions>
    </Item>
  );
}
