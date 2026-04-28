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

import {
  TRestoreNameConflict,
  useForceDeleteItem,
  useRestoreItem,
} from "@/features/items/api/mutations";
import { useRailStore } from "@/features/drive/store/rail-store";
import { TTrashedItem } from "@/features/trash/types/trash-item";
import { EllipsisVertical, History, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { formatFileSize } from "@/lib/format-file-size";
import { RestoreNameConflictDialog } from "./restore-name-conflict-dialog";
import { useCurrentUser } from "@/features/auth/api/me-queries";

export function TrashDocument({
  trashedItem,
  onDoubleClick,
}: {
  trashedItem: TTrashedItem;
  onDoubleClick: () => void;
}) {
  const { setSelectedDocumentId, setSelectedDocumentFileName } = useRailStore();
  const { data: currentUser } = useCurrentUser();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [nameConflict, setNameConflict] = useState<TRestoreNameConflict | null>(
    null,
  );

  const { mutate: restoreItem } = useRestoreItem({
    onNameConflict: setNameConflict,
  });
  const { mutate: forceDeleteItem, isPending: isDeleting } = useForceDeleteItem(
    setIsDeleteDialogOpen,
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
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Permanently?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-semibold text-foreground">
                  &quot;{trashedItem.name}&quot;
                </span>{" "}
                forever?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
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
        <RestoreNameConflictDialog
          open={nameConflict !== null}
          onOpenChange={(open) => {
            if (!open) setNameConflict(null);
          }}
          trashedItemName={trashedItem.name}
          conflict={nameConflict}
        />
      </ItemActions>
      <ItemFooter className="min-w-0">
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <p className="min-w-0 truncate">{trashedItem.classification}</p>
            <p className="shrink-0">
              {trashedItem.current_version?.file_size &&
                formatFileSize(trashedItem.current_version.file_size)}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="min-w-0 truncate">
              {trashedItem.owner.id === currentUser?.id
                ? "me"
                : `${trashedItem.owner.first_name} ${trashedItem.owner.middle_name ?? ""} ${trashedItem.owner.last_name}`}
            </p>
            <p className="shrink-0">{trashedItem.created_at}</p>
          </div>
        </div>
      </ItemFooter>
    </Item>
  );
}
