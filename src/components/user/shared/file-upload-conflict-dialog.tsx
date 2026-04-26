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

type TConflict = {
  id: string;
  name: string;
  can_replace: boolean;
  is_locked?: boolean;
  versions_count: number;
};

interface FileUploadConflictDialogProps {
  conflictData: {
    open: boolean;
    conflicts: TConflict[];
    pendingData: TUploadFileFormSchema | null;
  };
  setConflictData: Dispatch<
    SetStateAction<{
      open: boolean;
      conflicts: TConflict[];
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
        {conflictData.conflicts.some((c) => c.can_replace && c.versions_count >= 3) && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Version Limit Reached</AlertTitle>
            <AlertDescription>
              <p className="mb-2">The following files already have the maximum of 3 versions. If you continue, their oldest versions will be automatically deleted:</p>
              <ul className="list-disc pl-5">
                {conflictData.conflicts
                  .filter((c) => c.can_replace && c.versions_count >= 3)
                  .map((c) => (
                    <li key={c.id}>{c.name}</li>
                  ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        {conflictData.conflicts.some((c) => !c.can_replace && c.is_locked) && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Cannot replace the following files (locked):</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5">
                {conflictData.conflicts
                  .filter((c) => !c.can_replace && c.is_locked)
                  .map((c) => (
                    <li key={c.id}>{c.name}</li>
                  ))}
              </ul>
              <p className="mt-2">These files will be skipped.</p>
            </AlertDescription>
          </Alert>
        )}
        {conflictData.conflicts.some((c) => !c.can_replace && !c.is_locked) && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Cannot replace the following files (owned by others):</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5">
                {conflictData.conflicts
                  .filter((c) => !c.can_replace && !c.is_locked)
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
