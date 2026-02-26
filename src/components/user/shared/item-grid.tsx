import { viewDocument } from "@/services/documents/api";
import { useRailStore } from "@/stores/rail-store";
import { TCursorPaginate } from "@/types/cursor-paginate";
import type { TItem } from "@/types/item";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Document } from "./document";
import { Folder } from "./folder";

export function ItemGrid({ data }: { data: TCursorPaginate<TItem>["data"] }) {
  const router = useRouter();

  const { openRail } = useRailStore();

  const handleFolderDoubleClick = (folderId: number) => {
    router.push(`/drive/folders/${folderId}`);
  };

  const handleDocumentDoubleClick = async (documentId: number) => {
    try {
      const url = await viewDocument(documentId);
      const newWindow = window.open(url);

      if (newWindow) {
        newWindow.addEventListener("load", () => URL.revokeObjectURL(url));
      } else {
        URL.revokeObjectURL(url);
        toast.error("Please allow popups for this site.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const folders = data.filter((item) => item.is_folder);
  const documents = data.filter((item) => !item.is_folder);

  return (
    <div className={`flex flex-col gap-4 ${folders.length && "space-y-4"}`}>
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
            onDoubleClick={handleDocumentDoubleClick}
          />
        ))}
      </div>
    </div>
  );
}
