import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useUploadDialogStore } from "@/features/uploads/store/upload-dialog-store";
import { UploadCloud } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export function DriveDropzone({ children }: { children: React.ReactNode }) {
  const openWithFiles = useUploadDialogStore((state) => state.openWithFiles);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        openWithFiles(acceptedFiles);
      }
    },
    [openWithFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="relative flex-1 flex flex-col min-h-0 min-w-0 outline-none"
    >
      <input {...getInputProps()} />
      {children}

      {isDragActive && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm border-2 border-primary border-dashed rounded-xl animate-in fade-in-0">
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <UploadCloud className="size-16 animate-bounce text-primary" />
              </EmptyMedia>
              <EmptyTitle>Drop PDF files here to upload</EmptyTitle>
              <EmptyDescription>Release to instantly prepare your files for upload</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      )}
    </div>
  );
}
