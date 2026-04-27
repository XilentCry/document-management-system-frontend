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
import { TUserStatus } from "@/features/users/types/user-status";

interface ConfirmStatusChangeDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  pendingStatus: TUserStatus | null;
  handleConfirmStatusChange: () => void;
}

export function ConfirmStatusChangeDialog({
  isOpen,
  setIsOpen,
  pendingStatus,
  handleConfirmStatusChange,
}: ConfirmStatusChangeDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex flex-col gap-1">
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change this user&apos;s status to{" "}
              <span className="font-semibold">{pendingStatus}</span>?
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmStatusChange}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
