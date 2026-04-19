import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { groupItemsByRelativeDate } from "@/lib/date-grouping";
import { formatFileSize } from "@/lib/format-file-size";
import { useCurrentUser } from "@/services/user/queries";
import { useForceDeleteItem, useRestoreItem } from "@/services/items/mutations";
import { useRailStore } from "@/stores/rail-store";
import { TTrashedItem } from "@/types/trash-item";
import {
  AlertTriangle,
  Building,
  EllipsisVertical,
  History,
  Trash2
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

export function TrashDocumentTable({
  data,
  onDocumentDoubleClick,
}: {
  data: TTrashedItem[];
  onDocumentDoubleClick: (document: TTrashedItem) => void;
}) {
  const {
    setSelectedDocumentId,
    setSelectedDocumentFileName,
    openRail,
  } = useRailStore();

  const [itemToDelete, setItemToDelete] = useState<TTrashedItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: userData } = useCurrentUser();
  const currentUser = userData;

  const groupedData = groupItemsByRelativeDate(data, (item) => item.raw_deleted_at);

  const { mutate: restoreItem } = useRestoreItem();
  const { mutate: forceDeleteItem, isPending: isDeleting } = useForceDeleteItem(
    setIsDeleteDialogOpen,
    setItemToDelete
  );

  const handleRestore = (id: string) => {
    restoreItem(id);
  };

  const handleDeleteForever = () => {
    if (itemToDelete) {
      forceDeleteItem(itemToDelete.id);
    }
  };

  return (
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
          <TableRow key={groupData.group} className="hover:bg-transparent border-none">
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
                    <Building className="size-4" />
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
                        handleRestore(trashedItem.id);
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
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-destructive" />
              Delete Permanently
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold text-foreground">&quot;{itemToDelete?.name}&quot;</span> forever? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteForever}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Spinner />
                  Deleting...
                </>
              ) : (
                "Delete Forever"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Table>
  );
}
