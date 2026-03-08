import { useRailStore } from "@/stores/rail-store";
import { TCursorPaginate } from "@/types/cursor-paginate";
import type { TItem } from "@/types/item";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Document } from "./document";
import { DocumentViewer } from "./document-viewer";
import { Folder } from "./folder";

export function ItemGrid({ data }: { data: TCursorPaginate<TItem>["data"] }) {
  const [openDocumentViewer, setOpenDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TItem | null>(null);

  const router = useRouter();

  const { openRail } = useRailStore();

  const handleFolderDoubleClick = (folderId: number) => {
    router.push(`/drive/folders/${folderId}`);
  };

  const handleDocumentDoubleClick = async (document: TItem) => {
    setSelectedDocument(document);
    setOpenDocumentViewer(true);
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
            onDoubleClick={handleDocumentDoubleClick}
          />
        ))}
      </div>

      {openDocumentViewer && selectedDocument && (
        <DocumentViewer
          openDocumentViewer={openDocumentViewer}
          setOpenDocumentViewer={setOpenDocumentViewer}
          document={selectedDocument}
        />
      )}
    </div>
  );
}
