import { useRailStore } from "@/stores/rail-store";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TSharedWithMe } from "@/types/shared-with-me";
import { SharedDocument } from "./shared-document";
import { groupItemsByRelativeDate } from "@/lib/date-grouping";

import { useState } from "react";
import { SharedDocumentViewer } from "./shared-document-viewer";

export function SharedDocumentGrid({
  data,
}: {
  data: TCursorPaginate<TSharedWithMe>["data"];
}) {
  const [openDocumentViewer, setOpenDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TSharedWithMe | null>(null);
  const { openRail } = useRailStore();

  const handleDocumentDoubleClick = async (document: TSharedWithMe) => {
    setSelectedDocument(document);
    setOpenDocumentViewer(true);
  };

  const groupedData = groupItemsByRelativeDate(data, (item) => item.raw_created_at);

  return (
    <div className="flex flex-col gap-4">
      {groupedData.map((groupData) => (
        <div key={groupData.group} className="flex flex-col gap-4">
          <h3 className="text-sm font-medium">{groupData.group}</h3>
          <div className={`grid ${openRail ? "grid-cols-2" : "grid-cols-4"} gap-4`}>
            {groupData.items.map((sharedDocument) => (
              <SharedDocument
                key={sharedDocument.item.id}
                item={sharedDocument.item}
                onDoubleClick={() => handleDocumentDoubleClick(sharedDocument)}
              />
            ))}
          </div>
        </div>
      ))}

      {selectedDocument && (
        <SharedDocumentViewer
          openDocumentViewer={openDocumentViewer}
          setOpenDocumentViewer={setOpenDocumentViewer}
          sharedDocument={selectedDocument}
        />
      )}
    </div>
  );
}
