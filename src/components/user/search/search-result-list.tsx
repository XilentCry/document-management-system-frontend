import { TCursorPaginate } from "@/types/cursor-paginate";
import { TItem } from "@/types/item";
import { useRouter } from "next/navigation";
import { SearchResultTable } from "./search-result-table";
import { Dispatch, SetStateAction } from "react";

export function SearchResultList({
  data,
  onDocumentDoubleClick,
  openDocumentViewer,
  setOpenDocumentViewer,
  selectedDocument,
}: {
  data: TCursorPaginate<TItem>["data"];
  onDocumentDoubleClick: (document: TItem) => Promise<void>;
  openDocumentViewer: boolean;
  setOpenDocumentViewer: Dispatch<SetStateAction<boolean>>;
  selectedDocument: TItem | null;
}) {
  const router = useRouter();

  const handleFolderDoubleClick = (folderId: string) => {
    router.push(`/drive/folders/${folderId}`);
  };

  return (
    <SearchResultTable
      data={data}
      onFolderDoubleClick={handleFolderDoubleClick}
      onDocumentDoubleClick={onDocumentDoubleClick}
      openDocumentViewer={openDocumentViewer}
      setOpenDocumentViewer={setOpenDocumentViewer}
      selectedDocument={selectedDocument}
    />
  );
}
