import { viewDocument } from "@/services/documents/api";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TItem } from "@/types/item";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SearchResultTable } from "./search-result-table";

export function SearchResultList({
  data,
}: {
  data: TCursorPaginate<TItem>["data"];
}) {
  const router = useRouter();

  const handleFolderDoubleClick = (folderId: number) => {
    router.push(`/drive/folders/${folderId}`);
  };

  const handleDocumentDoubleClick = async (documentId: number) => {
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
    <SearchResultTable
      data={data}
      onFolderDoubleClick={handleFolderDoubleClick}
      onDocumentDoubleClick={handleDocumentDoubleClick}
    />
  );
}
