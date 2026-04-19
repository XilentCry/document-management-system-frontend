import { TTrashedItem } from "@/types/trash-item";
import { Dispatch, SetStateAction } from "react";
import { DocumentViewer } from "../shared/document-viewer";

export function TrashDocumentViewer({
  openDocumentViewer,
  setOpenDocumentViewer,
  document,
}: {
  openDocumentViewer: boolean;
  setOpenDocumentViewer: Dispatch<SetStateAction<boolean>>;
  document: TTrashedItem;
}) {
  return (
    <DocumentViewer
      openDocumentViewer={openDocumentViewer}
      setOpenDocumentViewer={setOpenDocumentViewer}
      document={document}
      isTrash={true}
    />
  );
}
