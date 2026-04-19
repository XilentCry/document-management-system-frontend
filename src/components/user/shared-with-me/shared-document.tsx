import {
  Item,
  ItemActions,
  ItemContent,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import Image from "next/image";

import { ItemActionDropdown } from "../shared/item-action-dropdown";
import { useRailStore } from "@/stores/rail-store";
import { TItem } from "@/types/item";

export function SharedDocument({
  item,
  onDoubleClick,
}: {
  item: TItem;
  onDoubleClick: () => Promise<void>;
}) {
  const {
    setSelectedDocumentId,
    setSelectedDocumentFileName,
    setSelectedFolderId,
    setSelectedFolderName,
  } = useRailStore();

  return (
    <Item
      variant="muted"
      size="xs"
      onClick={() => {
        setSelectedDocumentId(item.id);
        setSelectedDocumentFileName(item.name);
        setSelectedFolderId(null);
        setSelectedFolderName(null);
      }}
      onDoubleClick={() => {
        onDoubleClick();
      }}
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
  );
}
