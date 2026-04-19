import {
  Item,
  ItemActions,
  ItemContent,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import Image from "next/image";
import { useRailStore } from "@/stores/rail-store";
import { TItem } from "@/types/item";
import { ItemActionDropdown } from "./item-action-dropdown";

export function Document({
  item,
  onDoubleClick,
}: {
  item: TItem;
  onDoubleClick: (document: TItem) => Promise<void>;
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
          setSelectedDocumentId(item.id);
          setSelectedDocumentFileName(item.name);
          setSelectedFolderId(null);
          setSelectedFolderName(null);
        }}
        onDoubleClick={() => onDoubleClick(item)}
      >
        <ItemMedia>
          <Image src="/pdf.svg" alt="PDF" width={16} height={16} />
        </ItemMedia>
        <ItemContent className="min-w-0">
          <ItemTitle className="block w-auto truncate">{item.name}</ItemTitle>
        </ItemContent>
        <ItemActions>
          <ItemActionDropdown item={item} />
        </ItemActions>
        <ItemFooter className="justify-center bg-background p-4 h-40 rounded-md">
          <Image src="/pdf.svg" alt="PDF" width={64} height={64} priority />
        </ItemFooter>
      </Item>
    </>
  );
}
