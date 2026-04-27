import { useState } from "react";
import { TTrashedItem } from "@/features/trash/types/trash-item";
import { TrashDocumentTable } from "./trash-document-table";
import { TrashDocumentViewer } from "./trash-document-viewer";

export function TrashDocumentList({
  data,
}: {
  data: TTrashedItem[];
}) {
  const [openDocumentViewer, setOpenDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TTrashedItem | null>(null);

  const handleDocumentDoubleClick = (document: TTrashedItem) => {
    setSelectedDocument(document);
    setOpenDocumentViewer(true);
  };

  return (
    <>
      <TrashDocumentTable
        data={data}
        onDocumentDoubleClick={handleDocumentDoubleClick}
      />
      
      {selectedDocument && (
        <TrashDocumentViewer
          openDocumentViewer={openDocumentViewer}
          setOpenDocumentViewer={setOpenDocumentViewer}
          document={selectedDocument}
        />
      )}
    </>
  );
}
