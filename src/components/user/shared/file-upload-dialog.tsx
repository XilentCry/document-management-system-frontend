import { Button } from "@/components/ui/button";
import Image from "next/image";
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
import { useCurrentUser } from "@/services/user/queries";
import { useUploadStore } from "@/stores/upload-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadIcon, X, Info } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useUploadDialogStore } from "@/stores/upload-dialog-store";
import { useGetAllClassifications } from "@/services/classifications/queries";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { checkConflicts } from "@/services/documents/api";
import { FileUploadConflictDialog } from "./file-upload-conflict-dialog";
import { FileUploadVersionConflictDialog } from "./file-upload-version-conflict-dialog";

const MAX_FILES = 5;

export function FileUploadDialog() {
  const isOpen = useUploadDialogStore((state) => state.isOpen);
  const setIsOpen = useUploadDialogStore((state) => state.setIsOpen);
  const pendingFiles = useUploadDialogStore((state) => state.pendingFiles);
  const replaceItemId = useUploadDialogStore((state) => state.replaceItemId);
  const clearPendingFiles = useUploadDialogStore(
    (state) => state.clearPendingFiles,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: currentUser } = useCurrentUser();
  const storeOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.currentOrganizationUnitId,
  );
  const currentOrganizationUnitId =
    storeOrganizationUnitId ?? currentUser?.currentOrganizationUnitId ?? null;
  const currentParentFolderId = useFolderStore(
    (state) => state.currentParentFolderId,
  );
  const addUpload = useUploadStore((state) => state.addUpload);
  const updateUpload = useUploadStore((state) => state.updateUpload);

  const { mutateAsync: uploadDocumentMutation } = useUploadDocument();

  const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);
  const [conflictData, setConflictData] = useState<{
    open: boolean;
    conflicts: {
      id: string;
      name: string;
      can_replace: boolean;
      versions_count: number;
    }[];
    pendingData: TUploadFileFormSchema | null;
  }>({ open: false, conflicts: [], pendingData: null });

  const {
    isLoading: isClassificationsLoading,
    isError: isClassificationsError,
    isSuccess: isClassificationsSuccess,
    error: classificationsError,
    data: classifications = [],
  } = useGetAllClassifications(isOpen);

  const { control, handleSubmit, reset } = useForm<TUploadFileFormSchema>({
    resolver: zodResolver(uploadFileFormSchema),
    defaultValues: { documents: [] },
  });

  useEffect(() => {
    if (!isOpen) {
      reset({ documents: [] });
    }
  }, [isOpen, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const addFilesToQueue = useCallback(
    (files: File[]) => {
      files.forEach((file) => {
        append({
          organization_unit_id: currentOrganizationUnitId!,
          classification_id: classifications[0]?.id ?? "",
          folder_id: currentParentFolderId,
          file,
        });
      });
    },
    [append, currentOrganizationUnitId, classifications, currentParentFolderId],
  );

  useEffect(() => {
    if (isOpen && pendingFiles.length > 0 && isClassificationsSuccess) {
      const limit = replaceItemId ? 1 : MAX_FILES;
      const filesToAdd = pendingFiles.slice(0, Math.max(0, limit - fields.length));
      addFilesToQueue(filesToAdd);
      clearPendingFiles();
    }
  }, [
    isOpen,
    pendingFiles,
    isClassificationsSuccess,
    clearPendingFiles,
    addFilesToQueue,
    replaceItemId,
    fields.length,
  ]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newFiles = Array.from(e.target.files ?? []);
    const limit = replaceItemId ? 1 : MAX_FILES;
    const remainingSlots = limit - fields.length;

    if (remainingSlots <= 0) return;

    newFiles = newFiles.slice(0, remainingSlots);
    addFilesToQueue(newFiles);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const limit = replaceItemId ? 1 : MAX_FILES;
    if (fields.length >= limit) return;

    let newFiles = Array.from(e.dataTransfer.files);
    const remainingSlots = limit - fields.length;
    newFiles = newFiles.slice(0, remainingSlots);

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

      let actualConflicts = res.conflicts || [];
      if (replaceItemId) {
        actualConflicts = actualConflicts.filter((c) => c.id !== replaceItemId);
      }

      if (actualConflicts.length > 0) {
        setConflictData({
          open: true,
          conflicts: actualConflicts,
          pendingData: data,
        });
        setIsCheckingConflicts(false);
        return;
      }

      setIsOpen(false);
      setIsCheckingConflicts(false);

      if (replaceItemId) {
        const docsWithReplaceId = data.documents.map((doc) => ({
          ...doc,
          replace_item_id: replaceItemId,
        }));
        await Promise.all(
          docsWithReplaceId.map((document) => uploadSingleDocument(document)),
        );
        return;
      }

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
    setIsOpen(false);

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
        return {
          ...doc,
          replace_item_id: replaceItemId || doc.replace_item_id,
        };
      })
      .filter(Boolean) as TSingleFile[];

    await Promise.all(
      documentsToUpload.map((document) => uploadSingleDocument(document)),
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-150 max-w-150!">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 min-w-0"
          >
            <DialogHeader>
              <DialogTitle>
                {replaceItemId ? "Upload New Version" : "Upload file"}
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-96 flex flex-col gap-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  fields.length >= (replaceItemId ? 1 : MAX_FILES)
                    ? "opacity-50 cursor-not-allowed border-muted bg-muted/20"
                    : "hover:bg-muted/50 cursor-pointer"
                }`}
                onClick={() => {
                  if (fields.length >= (replaceItemId ? 1 : MAX_FILES)) return;
                  fileInputRef.current?.click();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (fields.length >= (replaceItemId ? 1 : MAX_FILES)) {
                    e.dataTransfer.dropEffect = "none";
                  }
                }}
                onDrop={handleDrop}
              >
                <UploadIcon className="mx-auto size-12 text-muted-foreground mb-4" />
                <p className="text-sm font-medium mb-1">
                  {fields.length >= (replaceItemId ? 1 : MAX_FILES)
                    ? "Upload limit reached"
                    : "Click to select or drag & drop"}
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF files only, up to 10MB, max{" "}
                  {replaceItemId ? "1 file" : `${MAX_FILES} files`}
                </p>
              </div>
              {fields.length > 0 && (
                <ScrollArea className="flex-1 min-h-0">
                  {fields.map((field, index) => (
                    <Item key={field.id} size="xs">
                      <ItemMedia>
                        <Image
                          src="/pdf.svg"
                          alt="PDF"
                          width={16}
                          height={16}
                        />
                      </ItemMedia>
                      <ItemContent className="min-w-0">
                        <ItemTitle className="block w-auto truncate">
                          {field.file.name}
                        </ItemTitle>
                      </ItemContent>
                      <ItemActions className="items-center gap-2">
                        <Controller
                          control={control}
                          name={`documents.${index}.classification_id`}
                          render={({ field }) => {
                            const selectedClassification = classifications.find(
                              (c) => c.id === field.value,
                            );

                            return (
                              <div className="flex items-center gap-2">
                                <Select
                                  value={field.value}
                                  onValueChange={(value) =>
                                    field.onChange(value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue>
                                      {selectedClassification?.name}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {isClassificationsLoading ? (
                                      <div className="flex items-center justify-center p-4">
                                        <Spinner className="text-primary size-5" />
                                      </div>
                                    ) : isClassificationsError &&
                                      classificationsError ? (
                                      <div className="flex items-center justify-center p-4">
                                        <p className="text-destructive text-sm">
                                          {classificationsError.message}
                                        </p>
                                      </div>
                                    ) : (
                                      classifications.map((classification) => (
                                        <SelectItem
                                          key={classification.id}
                                          value={classification.id}
                                        >
                                          {classification.name}
                                        </SelectItem>
                                      ))
                                    )}
                                  </SelectContent>
                                </Select>
                                {selectedClassification?.description ? (
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="size-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {selectedClassification.description}
                                    </TooltipContent>
                                  </Tooltip>
                                ) : null}
                              </div>
                            );
                          }}
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
              multiple={!replaceItemId}
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
            />
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button
                type="submit"
                disabled={fields.length === 0 || isCheckingConflicts}
              >
                {isCheckingConflicts ? (
                  <>
                    <Spinner />
                    Checking...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {replaceItemId ? (
        <FileUploadVersionConflictDialog
          conflictData={conflictData}
          setConflictData={setConflictData}
        />
      ) : (
        <FileUploadConflictDialog
          conflictData={conflictData}
          setConflictData={setConflictData}
          handleConfirmReplacement={handleConfirmReplacement}
        />
      )}
    </>
  );
}
