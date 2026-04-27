import { TCursorPaginate } from "@/types/cursor-paginate";
import { TSharedWithMe } from "@/features/shared-with-me/types/shared-with-me";
import { useState } from "react";
import { SharedDocumentTable } from "./shared-document-table";

export function SharedDocumentList({
  data,
}: {
  data: TCursorPaginate<TSharedWithMe>["data"];
}) {
  const [openDocumentViewer, setOpenDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TSharedWithMe | null>(null);

  const handleDocumentDoubleClick = async (document: TSharedWithMe) => {
    setSelectedDocument(document);
    setOpenDocumentViewer(true);
  };

  return (
    <SharedDocumentTable
      data={data}
      onDocumentDoubleClick={handleDocumentDoubleClick}
      openDocumentViewer={openDocumentViewer}
      setOpenDocumentViewer={setOpenDocumentViewer}
      selectedDocument={selectedDocument}
    />
  );
}
