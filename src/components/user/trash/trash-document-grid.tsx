import { groupItemsByRelativeDate } from "@/lib/date-grouping";
import { useRailStore } from "@/stores/rail-store";
import { TTrashedItem } from "@/types/trash-item";
import { TrashDocument } from "./trash-document";
import { useState } from "react";
import { TrashDocumentViewer } from "./trash-document-viewer";

export function TrashDocumentGrid({
  data,
}: {
  data: TTrashedItem[];
}) {
  const { openRail } = useRailStore();
  const [openDocumentViewer, setOpenDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TTrashedItem | null>(
    null,
  );

  const handleDocumentDoubleClick = (document: TTrashedItem) => {
    setSelectedDocument(document);
    setOpenDocumentViewer(true);
  };

  const groupedData = groupItemsByRelativeDate(data, (item) => item.raw_deleted_at);

  return (
    <div className="flex flex-col gap-8">
      {groupedData.map((groupData) => (
        <div key={groupData.group} className="flex flex-col gap-4">
          <h3 className="text-sm font-medium">{groupData.group}</h3>
          <div className={`grid ${openRail ? "grid-cols-2" : "grid-cols-4"} gap-4`}>
            {groupData.items.map((trashedItem) => (
              <TrashDocument
                key={trashedItem.id}
                trashedItem={trashedItem}
                onDoubleClick={() => handleDocumentDoubleClick(trashedItem)}
              />
            ))}
          </div>
        </div>
      ))}

      {selectedDocument && (
        <TrashDocumentViewer
          openDocumentViewer={openDocumentViewer}
          setOpenDocumentViewer={setOpenDocumentViewer}
          document={selectedDocument}
        />
      )}
    </div>
  );
}
