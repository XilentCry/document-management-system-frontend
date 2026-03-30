import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TSingleFile,
  TUploadFileFormSchema,
  uploadFileFormSchema,
} from "@/schemas/documents/upload-file-form-schema";
import { useUploadDocument } from "@/services/documents/mutations";
import { useFolderStore } from "@/stores/folder-store";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useUploadStore } from "@/stores/upload-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadIcon, X, File } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useGetAllClassifications } from "@/services/classifications/queries";
import { Spinner } from "@/components/ui/spinner";
import { checkConflicts } from "@/services/documents/api";
import { FileUploadConflictDialog } from "./file-upload-conflict-dialog";

export function FileUploadDialog({
  openFileUploadDialog,
  setOpenFileUploadDialog,
}: {
  openFileUploadDialog: boolean;
  setOpenFileUploadDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.currentOrganizationUnitId,
  );
  const currentParentFolderId = useFolderStore(
    (state) => state.currentParentFolderId,
  );
  const addUpload = useUploadStore((state) => state.addUpload);
  const updateUpload = useUploadStore((state) => state.updateUpload);

  const { mutateAsync: uploadDocumentMutation } = useUploadDocument();

  const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);
  const [conflictData, setConflictData] = useState<{
    open: boolean;
    conflicts: { id: number; name: string; can_replace: boolean }[];
    pendingData: TUploadFileFormSchema | null;
  }>({ open: false, conflicts: [], pendingData: null });

  const {
    isLoading: isClassificationsLoading,
    isError: isClassificationsError,
    error: classificationsError,
    data: classifications = [],
  } = useGetAllClassifications(openFileUploadDialog);

  const { control, handleSubmit } = useForm<TUploadFileFormSchema>({
    resolver: zodResolver(uploadFileFormSchema),
    defaultValues: { documents: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const addFilesToQueue = (files: File[]) => {
    files.forEach((file) => {
      append({
        organization_unit_id: currentOrganizationUnitId!,
        classification_id: 1,
        folder_id: currentParentFolderId,
        file,
      });
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files ?? []);
    addFilesToQueue(newFiles);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newFiles = Array.from(e.dataTransfer.files);
    addFilesToQueue(newFiles);
  };

  const uploadSingleDocument = async (data: TSingleFile) => {
    const uploadId = crypto.randomUUID();

    const classification = classifications.find(
      (c) => c.id === data.classification_id,
    );

    addUpload({
      id: uploadId,
      file: data.file,
      classification: classification!.name,
      status: "uploading",
    });

    try {
      await uploadDocumentMutation(data);
      updateUpload(uploadId, { status: "complete" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        updateUpload(uploadId, { status: "failed", error: error.message });
      }
    }
  };

  const onSubmit = async (data: TUploadFileFormSchema) => {
    try {
      setIsCheckingConflicts(true);
      const fileNames = data.documents.map((d) => d.file.name);

      const res = await checkConflicts({
        organization_unit_id: currentOrganizationUnitId!,
        file_names: fileNames,
      });

      if (res.conflicts && res.conflicts.length > 0) {
        setConflictData({ open: true, conflicts: res.conflicts, pendingData: data });
        setIsCheckingConflicts(false);
        return;
      }

      setOpenFileUploadDialog(false);
      setIsCheckingConflicts(false);
      await Promise.all(
        data.documents.map((document) => uploadSingleDocument(document)),
      );
    } catch (error) {
      console.error(error);
      setIsCheckingConflicts(false);
    }
  };

  const handleConfirmReplacement = async () => {
    setConflictData((prev) => ({ ...prev, open: false }));
    setOpenFileUploadDialog(false);

    const { conflicts, pendingData } = conflictData;
    if (!pendingData) return;

    const documentsToUpload = pendingData.documents
      .map((doc) => {
        const conflict = conflicts.find((c) => c.name === doc.file.name);
        if (conflict) {
          if (conflict.can_replace) {
            return { ...doc, replace_item_id: conflict.id };
          } else {
            return null;
          }
        }
        return doc;
      })
      .filter(Boolean) as TSingleFile[];

    await Promise.all(
      documentsToUpload.map((document) => uploadSingleDocument(document)),
    );
  };

  return (
    <>
      <Dialog open={openFileUploadDialog} onOpenChange={setOpenFileUploadDialog}>
        <DialogContent className="w-150 max-w-150!">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 min-w-0"
          >
            <DialogHeader>
              <DialogTitle>Upload file</DialogTitle>
            </DialogHeader>
            {isClassificationsLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Spinner className="text-primary size-5" />
              </div>
            ) : isClassificationsError && classificationsError ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-destructive text-sm">
                  {classificationsError.message}
                </p>
              </div>
            ) : (
              <>
                <div className="max-h-96 flex flex-col gap-6">
                  <div
                    className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <UploadIcon className="mx-auto size-12 text-muted-foreground mb-4" />
                    <p className="text-sm font-medium mb-1">
                      Click to select or drag & drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF files only, up to 10MB
                    </p>
                  </div>
                  {fields.length > 0 && (
                    <ScrollArea className="flex-1 min-h-0">
                      {fields.map((field, index) => (
                        <Item key={field.id} size="xs">
                          <ItemMedia variant="icon">
                            <File className="size-4" />
                          </ItemMedia>
                          <ItemContent className="min-w-0">
                            <ItemTitle className="block w-auto truncate">
                              {field.file.name}
                            </ItemTitle>
                          </ItemContent>
                          <ItemActions>
                            <Controller
                              control={control}
                              name={`documents.${index}.classification_id`}
                              render={({ field }) => (
                                <Select
                                  value={field.value.toString()}
                                  onValueChange={(value) =>
                                    field.onChange(Number(value))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue>
                                      {
                                        classifications.find(
                                          (c) => c.id === field.value,
                                        )?.name
                                      }
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {classifications.map((classification) => (
                                      <SelectItem
                                        key={classification.id}
                                        value={classification.id.toString()}
                                      >
                                        {classification.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <X />
                            </Button>
                          </ItemActions>
                        </Item>
                      ))}
                    </ScrollArea>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  multiple
                  accept=".pdf,application/pdf"
                  onChange={handleFileSelect}
                />
              </>
            )}
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button type="submit" disabled={fields.length === 0 || isCheckingConflicts}>
                {isCheckingConflicts ? "Checking..." : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <FileUploadConflictDialog
        conflictData={conflictData}
        setConflictData={setConflictData}
        handleConfirmReplacement={handleConfirmReplacement}
      />
    </>
  );
}
