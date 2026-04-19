
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ItemActionDropdown } from "./item-action-dropdown";
import { useRailStore } from "@/stores/rail-store";
import { FolderIcon } from "lucide-react";
import { TItem } from "@/types/item";

export function Folder({
  item,
  onDoubleClick,
}: {
  item: TItem;
  onDoubleClick: (folderId: string) => void;
}) {
  const {
    setSelectedDocumentId,
    setSelectedDocumentFileName,
    setSelectedFolderId,
    setSelectedFolderName,
  } = useRailStore();

  return (
    <>
      <Item
        variant="muted"
        size="xs"
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
          <ItemActionDropdown item={item} />
        </ItemActions>
      </Item>
    </>
  );
}
