import { useUploadDialogStore } from "@/stores/upload-dialog-store";
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
    noClick: true, // Prevents intercepting clicks on the grid/list items
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
        <div className="absolute inset-x-4 inset-y-0 mt-4 mb-4 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm border-2 border-dashed border-primary rounded-lg">
          <div className="flex flex-col items-center gap-4 text-primary pointer-events-none">
            <UploadCloud className="size-16 animate-bounce" />
            <h2 className="text-2xl font-bold">Drop PDF files here to upload</h2>
          </div>
        </div>
      )}
    </div>
  );
}
