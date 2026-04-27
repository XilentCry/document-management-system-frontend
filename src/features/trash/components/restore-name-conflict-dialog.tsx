import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TRestoreNameConflict } from "@/features/items/api/mutations";
import { AlertTriangle } from "lucide-react";

type RestoreNameConflictDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trashedItemName?: string;
  conflict: TRestoreNameConflict | null;
};

export function RestoreNameConflictDialog({
  open,
  onOpenChange,
  trashedItemName,
  conflict,
}: RestoreNameConflictDialogProps) {
  const itemKind = conflict?.is_folder ? "folder" : "document";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            Rename the existing item first
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cannot restore{" "}
            <span className="font-semibold text-foreground">
              &quot;{trashedItemName}&quot;
            </span>{" "}
            because an active {itemKind} named{" "}
            <span className="font-semibold text-foreground">
              &quot;{conflict?.name}&quot;
            </span>{" "}
            already exists in this organization unit. Rename the active{" "}
            {itemKind} first, then try restoring again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => onOpenChange(false)}>
            Got it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
