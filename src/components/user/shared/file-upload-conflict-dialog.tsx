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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { TUploadFileFormSchema } from "@/schemas/documents/upload-file-form-schema";
import { Dispatch, SetStateAction } from "react";

interface FileUploadConflictDialogProps {
  conflictData: {
    open: boolean;
    conflicts: { id: string; name: string; can_replace: boolean }[];
    pendingData: TUploadFileFormSchema | null;
  };
  setConflictData: Dispatch<
    SetStateAction<{
      open: boolean;
      conflicts: { id: string; name: string; can_replace: boolean }[];
      pendingData: TUploadFileFormSchema | null;
    }>
  >;
  handleConfirmReplacement: () => void;
}

export function FileUploadConflictDialog({
  conflictData,
  setConflictData,
  handleConfirmReplacement,
}: FileUploadConflictDialogProps) {
  return (
    <AlertDialog
      open={conflictData.open}
      onOpenChange={(open) =>
        !open && setConflictData((prev) => ({ ...prev, open: false }))
      }
    >
      <AlertDialogContent className="w-150 max-w-150!">
        <AlertDialogHeader>
          <AlertDialogTitle>File Name Conflict</AlertDialogTitle>
          <AlertDialogDescription>
            {conflictData.conflicts.length === 1
              ? `File '${conflictData.conflicts[0].name}' already exists. Do you want to replace it?`
              : "One or more files already exist. Do you want to replace them?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {conflictData.conflicts.some((c) => !c.can_replace) && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Cannot replace the following files (owned by others):</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5">
                {conflictData.conflicts
                  .filter((c) => !c.can_replace)
                  .map((c) => (
                    <li key={c.id}>{c.name}</li>
                  ))}
              </ul>
              <p className="mt-2">These files will be skipped.</p>
            </AlertDescription>
          </Alert>
        )}
        {conflictData.conflicts.some((c) => c.can_replace) &&
          conflictData.conflicts.length > 1 && (
            <Alert>
              <Info />
              <AlertTitle>Files that will be replaced:</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5">
                  {conflictData.conflicts
                    .filter((c) => c.can_replace)
                    .map((c) => (
                      <li key={c.id}>{c.name}</li>
                    ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmReplacement}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
