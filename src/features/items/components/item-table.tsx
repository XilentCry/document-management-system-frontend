import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatFileSize } from "@/lib/format-file-size";
import { Folder, Lock } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useCurrentUser } from "@/features/auth/api/me-queries";
import { useRailStore } from "@/features/drive/store/rail-store";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TItem } from "@/features/items/types/item";
import { DocumentViewer } from "@/features/viewer/components/document-viewer";
import { ItemActionDropdown } from "@/features/items/components/item-action-dropdown";

export function ItemTable({
  data,
  onFolderDoubleClick,
  onDocumentDoubleClick,
  openDocumentViewer,
  setOpenDocumentViewer,
  selectedDocument,
}: {
  data: TCursorPaginate<TItem>["data"];
  onFolderDoubleClick: (folderId: string) => void;
  onDocumentDoubleClick: (document: TItem) => Promise<void>;
  openDocumentViewer: boolean;
  setOpenDocumentViewer: Dispatch<SetStateAction<boolean>>;
  selectedDocument: TItem | null;
}) {
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id;

  const {
    setSelectedDocumentId,
    setSelectedDocumentFileName,
    setSelectedFolderId,
    setSelectedFolderName,
    openRail,
  } = useRailStore();

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {!openRail && <TableHead>Owner</TableHead>}
            <TableHead>Date modified</TableHead>
            {!openRail && <TableHead>Classification</TableHead>}
            {!openRail && <TableHead>File size</TableHead>}
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const isOwner = item.owner.id === userId;

            return (
              <TableRow
                key={item.id}
                onClick={() => {
                  if (item.is_folder) {
                    setSelectedFolderId(item.id);
                    setSelectedFolderName(item.name);
                    setSelectedDocumentId(null);
                    setSelectedDocumentFileName(null);
                  } else {
                    setSelectedDocumentId(item.id);
                    setSelectedDocumentFileName(item.name);
                    setSelectedFolderId(null);
                    setSelectedFolderName(null);
                  }
                }}
                onDoubleClick={() => {
                  if (item.is_folder) {
                    onFolderDoubleClick(item.id);
                  } else {
                    onDocumentDoubleClick(item);
                  }
                }}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    {item.is_folder ? (
                      <Folder className="size-4" />
                    ) : (
                      <Image src="/pdf.svg" alt="PDF" width={16} height={16} />
                    )}
                    <span className="truncate">{item.name}</span>
                    {!item.is_folder && item.is_locked && (
                      <Lock className="size-4 shrink-0" />
                    )}
                  </div>
                </TableCell>
                {!openRail && (
                  <TableCell>
                    {isOwner
                      ? "me"
                      : `${item.owner.first_name} ${item.owner.middle_name ?? ""} ${item.owner.last_name}`}
                  </TableCell>
                )}
                <TableCell>{item.updated_at}</TableCell>
                {!openRail && (
                  <TableCell>{item.classification ?? <>&mdash;</>}</TableCell>
                )}
                {!openRail && (
                  <TableCell>
                    {item?.current_version?.file_size ? (
                      formatFileSize(item.current_version.file_size)
                    ) : (
                      <>&mdash;</>
                    )}
                  </TableCell>
                )}

                <TableCell className="text-right">
                  <ItemActionDropdown item={item} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {selectedDocument && (
        <DocumentViewer
          openDocumentViewer={openDocumentViewer}
          setOpenDocumentViewer={setOpenDocumentViewer}
          document={selectedDocument}
        />
      )}
    </>
  );
}
