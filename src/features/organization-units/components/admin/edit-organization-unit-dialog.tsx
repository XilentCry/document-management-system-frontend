import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { editOrganizationUnitFormSchema, TEditOrganizationUnitFormSchema } from "@/features/organization-units/schemas/edit-organization-unit-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditOrganizationUnit } from "@/features/organization-units/api/mutations";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SelectParentOrganizationUnitDialog } from "./select-parent-organization-unit-dialog";
import { TOrganizationUnitFlat } from "@/features/organization-units/types/organization-unit-flat";


export function EditOrganizationUnitDialog({
  organizationUnit,
  openEditOrganizationUnitDialog,
  setOpenEditOrganizationUnitDialog,
}: {
  organizationUnit: TOrganizationUnitFlat;
  openEditOrganizationUnitDialog: boolean;
  setOpenEditOrganizationUnitDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
    setValue,
    control,
  } = useForm<TEditOrganizationUnitFormSchema>({
    resolver: zodResolver(editOrganizationUnitFormSchema),
    defaultValues: {
      name: organizationUnit.name,
      parent_organization_unit_id: organizationUnit.parent?.id ?? undefined,
    },
  });

  const [manualParentName, setManualParentName] = useState<{
    forUnitId: string;
    name: string;
  } | null>(null);

  const selectedParentName =
    manualParentName?.forUnitId === organizationUnit.id
      ? manualParentName.name
      : organizationUnit.parent?.name ?? null;

  const parentOrganizationUnitId = useWatch({ control, name: "parent_organization_unit_id" });

  const handleSelectParent = (id: string, name: string) => {
    setValue("parent_organization_unit_id", id, { shouldValidate: true });
    setManualParentName({ forUnitId: organizationUnit.id, name });
  };

  const handleReset = () => {
    reset({
      name: organizationUnit.name,
      parent_organization_unit_id: organizationUnit.parent?.id ?? undefined,
    });
    setManualParentName(null);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      setOpenEditOrganizationUnitDialog(false);
    }
  }, [isSubmitSuccessful, setOpenEditOrganizationUnitDialog]);

  useEffect(() => {
    reset({
      name: organizationUnit.name,
      parent_organization_unit_id: organizationUnit.parent?.id ?? undefined,
    });
  }, [organizationUnit, reset]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleReset();
    }
    setOpenEditOrganizationUnitDialog(open);
  };

  const { mutateAsync: editOrganizationUnitMutation } = useEditOrganizationUnit();

  const onSubmit: SubmitHandler<TEditOrganizationUnitFormSchema> = async (data) => {
    await editOrganizationUnitMutation({ id: organizationUnit.id, data });
  };

  return (
    <Dialog open={openEditOrganizationUnitDialog} onOpenChange={handleOpenChange}>
      <DialogContent className="w-150 max-w-150!">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Edit Organization Unit</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                placeholder="Enter organization unit name"
                {...register("name")}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>
            <Field>
              <FieldLabel>Parent Organization Unit</FieldLabel>
              <SelectParentOrganizationUnitDialog
                selectedId={parentOrganizationUnitId ?? undefined}
                selectedParentName={selectedParentName}
                onSelect={(id: string, name: string) => handleSelectParent(id, name)}
              />
              {errors.parent_organization_unit_id && (
                <FieldError>{errors.parent_organization_unit_id.message}</FieldError>
              )}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose
              render={
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    handleReset();
                  }}
                />
              }
            >
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}