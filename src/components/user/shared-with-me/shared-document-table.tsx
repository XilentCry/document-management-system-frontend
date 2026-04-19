import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

import { groupItemsByRelativeDate } from "@/lib/date-grouping";
import { useRailStore } from "@/stores/rail-store";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TSharedWithMe } from "@/types/shared-with-me";
import { Dispatch, SetStateAction } from "react";
import { SharedDocumentViewer } from "./shared-document-viewer";
import { ItemActionDropdown } from "../shared/item-action-dropdown";

export function SharedDocumentTable({
  data,
  onDocumentDoubleClick,
  openDocumentViewer,
  setOpenDocumentViewer,
  selectedDocument,
}: {
  data: TCursorPaginate<TSharedWithMe>["data"];
  onDocumentDoubleClick: (document: TSharedWithMe) => Promise<void>;
  openDocumentViewer: boolean;
  setOpenDocumentViewer: Dispatch<SetStateAction<boolean>>;
  selectedDocument: TSharedWithMe | null;
}) {
  const {
    setSelectedDocumentId,
    setSelectedDocumentFileName,
    setSelectedFolderId,
    setSelectedFolderName,
    openRail,
  } = useRailStore();

  const groupedData = groupItemsByRelativeDate(data, (item) => item.raw_created_at);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Shared by</TableHead>
            {!openRail && <TableHead>Date shared</TableHead>}
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedData.flatMap((groupData) => [
            <TableRow key={groupData.group} className="hover:bg-transparent border-none">
              <TableCell
                colSpan={openRail ? 3 : 4}
                className="font-medium text-sm"
              >
                {groupData.group}
              </TableCell>
            </TableRow>,
            ...groupData.items.map((sharedDocument) => {
              return (
                <TableRow
                  key={sharedDocument.item.id}
                  onClick={() => {
                    setSelectedDocumentId(sharedDocument.item.id);
                    setSelectedDocumentFileName(sharedDocument.item.name);
                    setSelectedFolderId(null);
                    setSelectedFolderName(null);
                  }}
                  onDoubleClick={() => {
                    onDocumentDoubleClick(sharedDocument);
                  }}
                >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image src="/pdf.svg" alt="PDF" width={16} height={16} />
                    {sharedDocument.item.name}
                  </div>
                </TableCell>
                <TableCell>{`${sharedDocument.item.owner.first_name} ${sharedDocument.item.owner.middle_name ?? ""} ${sharedDocument.item.owner.last_name}`}</TableCell>
                {!openRail && <TableCell>{sharedDocument.created_at}</TableCell>}
                <TableCell className="text-right">
                  <ItemActionDropdown item={sharedDocument.item} />
                </TableCell>
              </TableRow>
            );
          })
        ])}
        </TableBody>
      </Table>

      {selectedDocument && (
        <SharedDocumentViewer
          openDocumentViewer={openDocumentViewer}
          setOpenDocumentViewer={setOpenDocumentViewer}
          sharedDocument={selectedDocument}
        />
      )}
    </>
  );
}
