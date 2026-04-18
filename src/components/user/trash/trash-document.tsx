import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Item,
  ItemActions,
  ItemContent,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import Image from "next/image";

import { useForceDeleteItem, useRestoreItem } from "@/services/items/mutations";
import { useRailStore } from "@/stores/rail-store";
import { TTrashedItem } from "@/types/trash-item";
import {
  AlertTriangle,
  EllipsisVertical,
  History,
  Trash2
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

export function TrashDocument({
  trashedItem,
  onDoubleClick,
}: {
  trashedItem: TTrashedItem;
  onDoubleClick: () => void;
}) {
  const {
    setSelectedDocumentId,
    setSelectedDocumentFileName,
  } = useRailStore();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { mutate: restoreItem } = useRestoreItem();
  const { mutate: forceDeleteItem, isPending: isDeleting } = useForceDeleteItem(
    setIsDeleteDialogOpen
  );

  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    restoreItem(trashedItem.id);
  };

  const handleDeleteForever = (e: React.MouseEvent) => {
    e.stopPropagation();
    forceDeleteItem(trashedItem.id);
  };

  return (
    <Item
      variant="muted"
      size="xs"
      onClick={() => {
        setSelectedDocumentId(trashedItem.id);
        setSelectedDocumentFileName(trashedItem.name);
      }}
      onDoubleClick={onDoubleClick}
    >
      <ItemMedia>
        <Image src="/pdf.svg" alt="PDF" width={16} height={16} />
      </ItemMedia>
      <ItemContent className="min-w-0">
        <ItemTitle className="block w-auto truncate">
          {trashedItem.name}
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <DropdownMenu modal={false}>
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
            <DropdownMenuItem onClick={handleRestore}>
              <History />
              Restore
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 />
              Delete forever
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete Permanently?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <span className="font-semibold text-foreground">"{trashedItem.name}"</span> forever?
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
      </ItemActions>
      <ItemFooter className="justify-center bg-background p-4 h-40 rounded-md">
        <Image src="/pdf.svg" alt="PDF" width={64} height={64} priority />
      </ItemFooter>
    </Item>
  );
}
