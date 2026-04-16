import { useRailStore } from "@/stores/rail-store";
import { TItem } from "@/types/item";
import { useRouter } from "next/navigation";
import { Document } from "../shared/document";
import { Folder } from "../shared/folder";
import { SharedDocument } from "../shared-with-me/shared-document";

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
        {documents.map((document) => {
          if (document.share_permissions) {
            return (
              <SharedDocument
                key={document.id}
                item={document}
                sharePermissions={document.share_permissions}
                onDoubleClick={() => onDocumentDoubleClick(document)}
              />
            );
          }

          return (
            <Document
              key={document.id}
              item={document}
              onDoubleClick={onDocumentDoubleClick}
            />
          );
        })}
      </div>
    </div>
  );
}
