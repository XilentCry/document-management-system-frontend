import { useRailStore } from "@/features/drive/store/rail-store";
import { TItem } from "@/features/items/types/item";
import { useRouter } from "next/navigation";
import { Document } from "@/features/items/components/document";
import { Folder } from "@/features/items/components/folder";

export function SearchGrid({
  data,
  onDocumentDoubleClick,
}: {
  data: TItem[];
  onDocumentDoubleClick: (document: TItem) => Promise<void>;
}) {
  const router = useRouter();
  const { openRail } = useRailStore();

  const handleFolderDoubleClick = (folderId: string) => {
    router.push(`/drive/folders/${folderId}`);
  };

  const folders = data.filter((item) => item.is_folder);
  const documents = data.filter((item) => !item.is_folder);

  return (
    <div className={`flex flex-col ${folders.length && "gap-4 space-y-4"}`}>
      <div className={`grid ${openRail ? "grid-cols-2" : "grid-cols-4"} gap-4`}>
        {folders.map((folder) => (
          <Folder
            key={folder.id}
            item={folder}
            onDoubleClick={handleFolderDoubleClick}
          />
        ))}
      </div>
      <div className={`grid ${openRail ? "grid-cols-2" : "grid-cols-4"} gap-4`}>
        {documents.map((document) => (
          <Document
            key={document.id}
            item={document}
            onDoubleClick={onDocumentDoubleClick}
          />
        ))}
      </div>
    </div>
  );
}
