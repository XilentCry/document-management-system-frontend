import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { TUploadFileFormSchema } from "@/schemas/documents/upload-file-form-schema";
import { Dispatch, SetStateAction } from "react";

interface FileUploadVersionConflictDialogProps {
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
}

export function FileUploadVersionConflictDialog({
  conflictData,
  setConflictData,
}: FileUploadVersionConflictDialogProps) {
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
              ? `The file name '${conflictData.conflicts[0].name}' is already used by another document.`
              : "One or more file names are already used by other documents."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Cannot use existing file names</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5">
              {conflictData.conflicts.map((c) => (
                <li key={c.id}>{c.name}</li>
              ))}
            </ul>
            <p className="mt-2">Please rename the file(s) before uploading, as document names must be unique within the organization unit.</p>
          </AlertDescription>
        </Alert>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
