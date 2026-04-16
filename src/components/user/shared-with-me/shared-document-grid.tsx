import { useRailStore } from "@/stores/rail-store";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TSharedWithMe } from "@/types/shared-with-me";
import { useState } from "react";
import { groupItemsByRelativeDate } from "@/lib/date-grouping";
import { SharedDocument } from "./shared-document";
import { SharedDocumentViewer } from "./shared-document-viewer";

export function SharedDocumentGrid({
  data,
}: {
  data: TCursorPaginate<TSharedWithMe>["data"];
}) {
  const { openRail } = useRailStore();
  const [openDocumentViewer, setOpenDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TSharedWithMe | null>(null);

  const handleDocumentDoubleClick = async (document: TSharedWithMe) => {
    setSelectedDocument(document);
    setOpenDocumentViewer(true);
  };

  const groupedData = groupItemsByRelativeDate(data, (item) => item.raw_created_at);

  return (
    <div className="flex flex-col gap-8">
      {groupedData.map((groupData) => (
        <div key={groupData.group} className="flex flex-col gap-4">
          <h3 className="text-sm font-medium">{groupData.group}</h3>
          <div className={`grid ${openRail ? "grid-cols-2" : "grid-cols-4"} gap-4`}>
            {groupData.items.map((sharedDocument) => (
              <SharedDocument
                key={sharedDocument.id}
                item={sharedDocument.item}
                sharePermissions={sharedDocument.share_permissions}
                onDoubleClick={() => handleDocumentDoubleClick(sharedDocument)}
              />
            ))}
          </div>
        </div>
      ))}

      {openDocumentViewer && selectedDocument && (
        <SharedDocumentViewer
          openDocumentViewer={openDocumentViewer}
          setOpenDocumentViewer={setOpenDocumentViewer}
          sharedDocument={selectedDocument}
        />
      )}
    </div>
  );
}
