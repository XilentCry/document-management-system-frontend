import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SubmitHandler, useForm } from "react-hook-form";
import { newOrganizationUnitFormSchema, TNewOrganizationUnitFormSchema } from "@/schemas/organization-units/new-organization-unit-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateOrganizationUnit } from "@/services/organization-units/mutations";
import { Field, FieldError, FieldGroup, FieldLabel } from "../../ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SelectParentOrganizationUnitDialog } from "./select-parent-organization-unit-dialog";


export function NewOrganizationUnitDialog({ openNewOrganizationUnitDialog, setOpenNewOrganizationUnitDialog }: { openNewOrganizationUnitDialog: boolean; setOpenNewOrganizationUnitDialog: Dispatch<SetStateAction<boolean>> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
    setValue,
    watch,
  } = useForm<TNewOrganizationUnitFormSchema>({
    resolver: zodResolver(newOrganizationUnitFormSchema),
    defaultValues: {
      name: "",
      parent_organization_unit_id: undefined,
    },
  });

  const [selectedParentName, setSelectedParentName] = useState<string | null>(null);

  const parentOrganizationUnitId = watch("parent_organization_unit_id");

  const handleSelectParent = (id: number, name: string) => {
    setValue("parent_organization_unit_id", id, { shouldValidate: true });
    setSelectedParentName(name);
  };

  const handleReset = () => {
    reset();
    setSelectedParentName(null);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      handleReset();
      setOpenNewOrganizationUnitDialog(false);
    }
  }, [isSubmitSuccessful, reset, setOpenNewOrganizationUnitDialog]);

  const { mutateAsync: createOrganizationUnitMutation } = useCreateOrganizationUnit();

  const onSubmit: SubmitHandler<TNewOrganizationUnitFormSchema> = async (data) => {
    await createOrganizationUnitMutation(data);
  };

  return (
    <Dialog open={openNewOrganizationUnitDialog} onOpenChange={setOpenNewOrganizationUnitDialog}>
      <DialogContent className="w-150 max-w-150!">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>New Organization Unit</DialogTitle>
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
                selectedId={parentOrganizationUnitId}
                selectedParentName={selectedParentName}
                onSelect={handleSelectParent}
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
                  onClick={() => handleReset()}
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
  )
}