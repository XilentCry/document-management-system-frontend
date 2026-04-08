import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dispatch, SetStateAction } from "react";

interface DiscardChangesAlertDialogProps {
  showDiscardAlert: boolean;
  setShowDiscardAlert: Dispatch<SetStateAction<boolean>>;
  handleDiscard: () => void;
}

export function DiscardChangesAlertDialog({
  showDiscardAlert,
  setShowDiscardAlert,
  handleDiscard
}: DiscardChangesAlertDialogProps) {
  return (
    <AlertDialog open={showDiscardAlert} onOpenChange={setShowDiscardAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
          <AlertDialogDescription>
            You have selected users that haven't been shared yet. Are you sure you want to discard these changes?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDiscard}> Discard </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}