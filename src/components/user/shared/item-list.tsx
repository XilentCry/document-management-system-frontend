import { TCursorPaginate } from "@/types/cursor-paginate";
import { TItem } from "@/types/item";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ItemTable } from "./item-table";

export function ItemList({ data }: { data: TCursorPaginate<TItem>["data"] }) {
  const router = useRouter();

  const [openDocumentViewer, setOpenDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TItem | null>(null);

  const handleFolderDoubleClick = (folderId: string) => {
    router.push(`/drive/folders/${folderId}`);
  };

  const handleDocumentDoubleClick = async (document: TItem) => {
    setSelectedDocument(document);
    setOpenDocumentViewer(true);
  };

  return (
    <ItemTable
      data={data}
      onFolderDoubleClick={handleFolderDoubleClick}
      onDocumentDoubleClick={handleDocumentDoubleClick}
      openDocumentViewer={openDocumentViewer}
      setOpenDocumentViewer={setOpenDocumentViewer}
      selectedDocument={selectedDocument}
    />
  );
}
