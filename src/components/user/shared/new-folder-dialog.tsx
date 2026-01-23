import { SubmitHandler, useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  newFolderFormSchema,
  TNewFolderFormSchema,
} from "@/schemas/folders/new-folder-form-schema";
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
    (state) => state.currentOrganizationUnitId,
  );
  const currentParentFolderId = useFolderStore(
    (state) => state.currentParentFolderId,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<TNewFolderFormSchema>({
    resolver: zodResolver(newFolderFormSchema),
    defaultValues: {
      name: "Untitled folder",
      folder_id: currentParentFolderId,
      organization_unit_id: currentOrganizationUnitId!,
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setOpenNewFolderDialog(false);
    }
  }, [isSubmitSuccessful, reset, setOpenNewFolderDialog]);

  const { mutateAsync: createFolderMutation } = useCreateFolder();

  const onSubmit: SubmitHandler<TNewFolderFormSchema> = async (data) => {
    await createFolderMutation(data);
  };

  return (
    <Dialog open={openNewFolderDialog} onOpenChange={setOpenNewFolderDialog}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>New folder</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
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
