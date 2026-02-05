import { TItem } from "@/types/item";
import { TPaginate } from "@/types/paginate";
import { useRouter } from "next/navigation";
import { ItemTable } from "./item-table";
import { viewDocument } from "@/services/documents/api";
import { toast } from "sonner";

export function ItemList({
  data,
  links,
  meta,
}: {
  data: TPaginate<TItem>["data"];
  links: TPaginate<TItem>["links"];
  meta: TPaginate<TItem>["meta"];
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
    <ItemTable
      data={data}
      onFolderDoubleClick={handleFolderDoubleClick}
      onDocumentDoubleClick={handleDocumentDoubleClick}
    />
  );
}
