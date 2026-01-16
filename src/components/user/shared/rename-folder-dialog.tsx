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
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  renameFolderFormSchema,
  TRenameFolderFormSchema,
} from "@/schemas/folders/rename-folder-form-schema";
import { useRenameFolder } from "@/services/folders/mutations";
import { TItem } from "@/types/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

export function RenameFolderDialog({
  folder,
  openRenameFolderDialog,
  setOpenRenameFolderDialog,
}: {
  folder: TItem;
  openRenameFolderDialog: boolean;
  setOpenRenameFolderDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<TRenameFolderFormSchema>({
    resolver: zodResolver(renameFolderFormSchema),
    defaultValues: {
      name: folder.name,
    },
  });

  useEffect(() => {
    if (!openRenameFolderDialog) {
      reset({
        name: folder.name,
      });
    }
  }, [openRenameFolderDialog, reset, folder.name]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setOpenRenameFolderDialog(false);
    }
  }, [isSubmitSuccessful, reset, setOpenRenameFolderDialog]);

  const { mutateAsync: renameFolderMutation } = useRenameFolder();

  const onSubmit = async (data: TRenameFolderFormSchema) => {
    await renameFolderMutation({
      id: folder.id,
      renameData: data,
    });
  };

  return (
    <Dialog
      open={openRenameFolderDialog}
      onOpenChange={setOpenRenameFolderDialog}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename folder</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Folder name</FieldLabel>
                <Input id="name" {...register("name")} />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose
                render={
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => reset()}
                  />
                }
              >
                Cancel
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Renaming...
                  </>
                ) : (
                  "Rename"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
