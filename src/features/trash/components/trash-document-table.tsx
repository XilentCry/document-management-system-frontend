import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { groupItemsByRelativeDate } from "@/lib/date-grouping";
import { formatFileSize } from "@/lib/format-file-size";
import { useCurrentUser } from "@/features/auth/api/me-queries";
import {
  TRestoreNameConflict,
  useForceDeleteItem,
  useRestoreItem,
} from "@/features/items/api/mutations";
import { useRailStore } from "@/features/drive/store/rail-store";
import { TTrashedItem } from "@/features/trash/types/trash-item";
import {
  Building,
  EllipsisVertical,
  Folder,
  History,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DeleteForeverDialog } from "./delete-forever-dialog";
import { RestoreNameConflictDialog } from "./restore-name-conflict-dialog";

export function TrashDocumentTable({
  data,
  onDocumentDoubleClick,
}: {
  data: TTrashedItem[];
  onDocumentDoubleClick: (document: TTrashedItem) => void;
}) {
  const { setSelectedDocumentId, setSelectedDocumentFileName, openRail } =
    useRailStore();

  const [itemToDelete, setItemToDelete] = useState<TTrashedItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToRestore, setItemToRestore] = useState<TTrashedItem | null>(null);
  const [nameConflict, setNameConflict] = useState<TRestoreNameConflict | null>(
    null,
  );

  const { data: userData } = useCurrentUser();
  const currentUser = userData;

  const groupedData = groupItemsByRelativeDate(
    data,
    (item) => item.raw_deleted_at,
  );

  const { mutate: restoreItem } = useRestoreItem({
    onNameConflict: setNameConflict,
  });
  const { mutate: forceDeleteItem, isPending: isDeleting } = useForceDeleteItem(
    setIsDeleteDialogOpen,
    setItemToDelete,
  );

  const handleRestore = (item: TTrashedItem) => {
    setItemToRestore(item);
    restoreItem(item.id);
  };

  const handleDeleteForever = () => {
    if (itemToDelete) {
      forceDeleteItem(itemToDelete.id);
    }
  };

  return (
    <ScrollArea>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Owner</TableHead>
            {!openRail && <TableHead>Date trashed</TableHead>}
            {!openRail && <TableHead>File size</TableHead>}
            {!openRail && <TableHead>Location</TableHead>}
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedData.flatMap((groupData) => [
            <TableRow
              key={groupData.group}
              className="hover:bg-transparent border-none"
            >
              <TableCell
                colSpan={openRail ? 3 : 6}
                className="font-medium text-sm pt-6"
              >
                {groupData.group}
              </TableCell>
            </TableRow>,
            ...groupData.items.map((trashedItem) => (
              <TableRow
                key={trashedItem.id}
                onClick={() => {
                  setSelectedDocumentId(trashedItem.id);
                  setSelectedDocumentFileName(trashedItem.name);
                }}
                onDoubleClick={() => onDocumentDoubleClick(trashedItem)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image src="/pdf.svg" alt="PDF" width={16} height={16} />
                    {trashedItem.name}
                  </div>
                </TableCell>
                <TableCell>
                  {currentUser?.id === trashedItem.owner.id
                    ? "me"
                    : `${trashedItem.owner.first_name} ${trashedItem.owner.middle_name ?? ""} ${trashedItem.owner.last_name}`}
                </TableCell>
                {!openRail && <TableCell>{trashedItem.deleted_at}</TableCell>}
                {!openRail && (
                  <TableCell>
                    {trashedItem?.current_version?.file_size ? (
                      formatFileSize(trashedItem.current_version.file_size)
                    ) : (
                      <>&mdash;</>
                    )}
                  </TableCell>
                )}
                {!openRail && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {trashedItem.parent_item_id ? (
                        <Folder className="shrink-0 size-4" />
                      ) : (
                        <Building className="shrink-0 size-4" />
                      )}
                      <span>{trashedItem.location}</span>
                    </div>
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="outline"
                          size="icon-sm"
                          className="border-none bg-transparent hover:bg-input/50"
                        />
                      }
                    >
                      <EllipsisVertical className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-72">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestore(trashedItem);
                        }}
                      >
                        <History />
                        Restore
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setItemToDelete(trashedItem);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 />
                        Delete forever
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )),
          ])}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
      <DeleteForeverDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        itemName={itemToDelete?.name}
        isDeleting={isDeleting}
        onConfirm={handleDeleteForever}
      />
      <RestoreNameConflictDialog
        open={nameConflict !== null}
        onOpenChange={(open) => {
          if (!open) {
            setNameConflict(null);
            setItemToRestore(null);
          }
        }}
        trashedItemName={itemToRestore?.name}
        conflict={nameConflict}
      />
    </ScrollArea>
  );
}
