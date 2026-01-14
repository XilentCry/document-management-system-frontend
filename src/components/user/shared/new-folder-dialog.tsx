import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  folderFormSchema,
  TFolderFormSchema,
} from "@/schemas/folders/create-folder-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateFolder } from "@/services/folders/mutations";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useFolderStore } from "@/stores/folder-store";
import { Field, FieldError, FieldGroup, FieldLabel } from "../../ui/field";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Spinner } from "../../ui/spinner";
import { useEffect } from "react";

export default function NewFolderDialog({
  openNewFolderDialog,
  setOpenNewFolderDialog,
}: {
  openNewFolderDialog: boolean;
  setOpenNewFolderDialog: (openNewFolderDialog: boolean) => void;
}) {
  const currentOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.currentOrganizationUnitId
  );
  const currentParentFolderId = useFolderStore(
    (state) => state.currentParentFolderId
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TFolderFormSchema>({
    resolver: zodResolver(folderFormSchema),
    defaultValues: {
      name: "Untitled folder",
      parent_folder_id: currentParentFolderId,
      organization_unit_id: currentOrganizationUnitId!,
    },
  });

  useEffect(() => {
    return () =>
      reset({
        name: "Untitled folder",
        parent_folder_id: currentParentFolderId,
        organization_unit_id: currentOrganizationUnitId!,
      });
  }, [
    openNewFolderDialog,
    currentParentFolderId,
    currentOrganizationUnitId,
    reset,
  ]);

  const { mutateAsync: createFolderMutation } = useCreateFolder();

  const onSubmit = async (data: TFolderFormSchema) => {
    await createFolderMutation(data);
    setOpenNewFolderDialog(false);
    reset();
  };

  return (
    <Dialog open={openNewFolderDialog} onOpenChange={setOpenNewFolderDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" {...register("name")} />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
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
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
