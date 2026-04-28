import {
  Item,
  ItemActions,
  ItemContent,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import Image from "next/image";
import { Lock } from "lucide-react";

import { ItemActionDropdown } from "@/features/items/components/item-action-dropdown";
import { useRailStore } from "@/features/drive/store/rail-store";
import { TSharedWithMe } from "@/features/shared-with-me/types/shared-with-me";
import { formatFileSize } from "@/lib/format-file-size";

export function SharedDocument({
  sharedDocument,
  onDoubleClick,
}: {
  sharedDocument: TSharedWithMe;
  onDoubleClick: () => Promise<void>;
}) {
  const { item, shared_by, created_at } = sharedDocument;
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
        <ItemTitle className="flex items-center gap-2 w-auto truncate">
          <span className="truncate">{item.name}</span>
          {item.is_locked && <Lock className="size-4 shrink-0" />}
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <ItemActionDropdown item={item} />
      </ItemActions>
      <ItemFooter className="min-w-0">
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <p className="min-w-0 truncate">{item.classification}</p>
            <p className="shrink-0">
              {item.current_version?.file_size &&
                formatFileSize(item.current_version.file_size)}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="min-w-0 truncate">
              {`${shared_by.first_name} ${shared_by.middle_name ?? ""} ${shared_by.last_name}`}
            </p>
            <p className="shrink-0">{created_at}</p>
          </div>
        </div>
      </ItemFooter>
    </Item>
  );
}
