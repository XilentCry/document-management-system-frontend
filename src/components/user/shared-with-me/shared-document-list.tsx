import { viewDocument } from "@/services/documents/api";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TSharedWithMe } from "@/types/shared-with-me";
import { toast } from "sonner";
import { SharedDocumentTable } from "./shared-document-table";

export function SharedDocumentList({
  data,
}: {
  data: TCursorPaginate<TSharedWithMe>["data"];
}) {
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

  return (
    <SharedDocumentTable
      data={data}
      onDocumentDoubleClick={handleDocumentDoubleClick}
    />
  );
}
