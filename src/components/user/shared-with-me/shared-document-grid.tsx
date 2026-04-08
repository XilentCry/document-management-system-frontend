import { viewDocument } from "@/services/documents/api";
import { useRailStore } from "@/stores/rail-store";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TSharedWithMe } from "@/types/shared-with-me";
import { toast } from "sonner";
import { groupItemsByRelativeDate } from "@/lib/date-grouping";
import { SharedDocument } from "./shared-document";

export function SharedDocumentGrid({
  data,
}: {
  data: TCursorPaginate<TSharedWithMe>["data"];
}) {
  const { openRail } = useRailStore();

  const handleDocumentDoubleClick = async (documentId: string) => {
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
                onDoubleClick={() =>
                  handleDocumentDoubleClick(sharedDocument.item.id)
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
