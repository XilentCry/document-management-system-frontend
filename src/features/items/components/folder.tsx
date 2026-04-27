import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
  ItemFooter
} from "@/components/ui/item";
import { ItemActionDropdown } from "@/features/items/components/item-action-dropdown";
import { useRailStore } from "@/features/drive/store/rail-store";
import { FolderIcon } from "lucide-react";
import { TItem } from "@/features/items/types/item";

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
        <ItemFooter className="min-w-0">
          <p className="min-w-0 truncate">
            {item.owner.first_name} {item.owner.middle_name ?? ""}{" "}
            {item.owner.last_name}
          </p>
          <p className="shrink-0">{item.updated_at}</p>
        </ItemFooter>
      </Item>
    </>
  );
}
