import {
  Item,
  ItemActions,
  ItemContent,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { TItem } from "@/types/item";
import { EllipsisVertical, FileText } from "lucide-react";

export function Document({ item }: { item: TItem }) {
  return (
    <Item variant="muted">
      <ItemMedia>
        <FileText className="size-4" />
      </ItemMedia>
      <ItemContent className="min-w-0">
        <ItemTitle className="block w-auto truncate">{item.name}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <EllipsisVertical className="size-4" />
      </ItemActions>
      <ItemFooter>Image</ItemFooter>
    </Item>
  );
}
