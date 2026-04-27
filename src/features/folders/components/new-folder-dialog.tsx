import { SubmitHandler, useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  newFolderFormSchema,
  TNewFolderFormSchema,
} from "@/features/folders/schemas/new-folder-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateFolder } from "@/features/folders/api/mutations";
import { useCurrentUser } from "@/features/auth/api/me-queries";
import { useOrganizationUnitStore } from "@/features/organization-units/store/organization-unit-store";
import { useFolderStore } from "@/features/drive/store/folder-store";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

export default function NewFolderDialog({
  openNewFolderDialog,
  setOpenNewFolderDialog,
}: {
  openNewFolderDialog: boolean;
  setOpenNewFolderDialog: (openNewFolderDialog: boolean) => void;
}) {
  const { data: currentUser } = useCurrentUser();
  const storeOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.currentOrganizationUnitId,
  );
  const currentOrganizationUnitId = storeOrganizationUnitId ?? currentUser?.currentOrganizationUnitId ?? null;
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
      name: "",
      folder_id: currentParentFolderId,
      organization_unit_id: currentOrganizationUnitId!,
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      setOpenNewFolderDialog(false);
    }
  }, [isSubmitSuccessful, setOpenNewFolderDialog]);

  useEffect(() => {
    if (!openNewFolderDialog) {
      reset({
        name: "",
        folder_id: currentParentFolderId,
        organization_unit_id: currentOrganizationUnitId!,
      });
    }
  }, [openNewFolderDialog, reset, currentParentFolderId, currentOrganizationUnitId]);

  const { mutateAsync: createFolderMutation } = useCreateFolder();

  const onSubmit: SubmitHandler<TNewFolderFormSchema> = async (data) => {
    await createFolderMutation(data);
  };

  return (
    <Dialog open={openNewFolderDialog} onOpenChange={setOpenNewFolderDialog}>
      <DialogContent className="w-150 max-w-150!">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>New folder</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                placeholder="Enter folder name"
                {...register("name")}
              />
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
