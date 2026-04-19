import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatFileSize } from "@/lib/format-file-size";
import { useCurrentUser } from "@/services/user/queries";
import { useRailStore } from "@/stores/rail-store";
import { TCursorPaginate } from "@/types/cursor-paginate";
import { TItem } from "@/types/item";
import {
  Building,
  Folder,
  UsersRound
} from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { ItemActionDropdown } from "../shared/item-action-dropdown";

export function SearchResultTable({
  data,
  onFolderDoubleClick,
  onDocumentDoubleClick,
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
      <ScrollArea>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              {!openRail && <TableHead>Owner</TableHead>}
              <TableHead>Date modified</TableHead>
              {!openRail && <TableHead>Classification</TableHead>}
              {!openRail && <TableHead>File size</TableHead>}
              {!openRail && <TableHead>Location</TableHead>}
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
                      {item.name}
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
                  {!openRail && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.location === "Shared with me" ? (
                          <UsersRound className="shrink-0 size-4" />
                        ) : item.parent_item_id ? (
                          <Folder className="shrink-0 size-4" />
                        ) : (
                          <Building className="shrink-0 size-4" />
                        )}
                        {item.location}
                      </div>
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
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

    </>
  );
}
