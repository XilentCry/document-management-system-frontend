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
import { FileText, UploadIcon, X } from "lucide-react";
import { Dispatch, SetStateAction, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

const classificationMap: Record<number, string> = {
  1: "Private",
  2: "Protected",
  3: "Public",
};

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

    addUpload({
      id: uploadId,
      file: data.file,
      classification: classificationMap[data.classification_id],
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
    setOpenFileUploadDialog(false);

    await Promise.all(
      data.documents.map((document) => uploadSingleDocument(document)),
    );
  };

  return (
    <Dialog open={openFileUploadDialog} onOpenChange={setOpenFileUploadDialog}>
      <DialogContent className="w-150 max-w-150!">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 min-w-0"
        >
          <DialogHeader>
            <DialogTitle>Upload file</DialogTitle>
          </DialogHeader>
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
                      <FileText className="size-4" />
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
                                {classificationMap[field.value]}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Private</SelectItem>
                              <SelectItem value="2">Protected</SelectItem>
                              <SelectItem value="3">Public</SelectItem>
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
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={fields.length === 0}>
              Upload
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
